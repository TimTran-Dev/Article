import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentStatus } from '../../Models/common.enum';
import { Segment, ContentData } from '../../Models/content.interface';
import { ProductsService } from '../../Services/Products/products.service';
import { map, Subject, takeUntil } from 'rxjs';

/**
 * Interface to wrap our Segment with a reactive status signal.
 * This avoids 'any' and ensures type safety for the local UI state.
 */
interface ReactiveSegment extends Segment {
  contentStatusSignal: WritableSignal<ContentStatus>;
}

@Component({
  selector: 'app-segment',
  templateUrl: 'segment.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class SegmentComponent implements OnInit, OnDestroy {
  // strictly typed signal
  segment = signal<ReactiveSegment[]>([]);
  isLoading = signal(false);
  contentStatus: ContentStatus[] = Object.values(ContentStatus);

  private readonly productService = inject(ProductsService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeSegments();
  }

  /**
   * Safely handles status changes by validating against the Enum
   */
  onStatusChange(newStatus: string): void {
    const isValidStatus = Object.values(ContentStatus).includes(newStatus as ContentStatus);
    if (isValidStatus) {
      console.log('Status changed to valid value:', newStatus);
      // Logic for updating the backend would go here
    }
  }

  private initializeSegments(): void {
    this.isLoading.set(true);

    this.productService
      .getFeaturedProducts() // Returns Observable<ContentData[]>
      .pipe(
        takeUntil(this.destroy$),
        map((items: ContentData[]) =>
          // Type Predicate: narrows ContentData to Segment
          items.filter((item): item is Segment => item.contentType === 'Segment'),
        ),
      )
      .subscribe({
        next: (segmentItems: Segment[]) => {
          const reactiveSegments: ReactiveSegment[] = segmentItems.map((s) => ({
            ...s,
            // Wrapping existing status in a signal for local reactivity
            contentStatusSignal: signal(s.contentStatus),
          }));

          this.segment.set(reactiveSegments);
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          console.error('Error fetching segments:', error.message);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
