import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentStatus } from '../../Models/common.enum';
import { Episode, ContentData } from '../../Models/content.interface'; // Updated Imports
import { ProductsService } from '../../Services/Products/products.service';
import { map, Subject, takeUntil } from 'rxjs';

/**
 * Interface to wrap our Episode with a reactive status signal.
 * Strictly typed to avoid the old nested 'content' property.
 */
interface ReactiveEpisode extends Episode {
  contentStatusSignal: WritableSignal<ContentStatus>;
}

@Component({
  selector: 'app-episode',
  templateUrl: 'episode.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class EpisodeComponent implements OnInit, OnDestroy {
  // strictly typed signal using our flat inheritance model
  episode = signal<ReactiveEpisode[]>([]);
  isLoading = signal(false);
  contentStatus: ContentStatus[] = Object.values(ContentStatus);

  private readonly productService = inject(ProductsService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeEpisodes();
  }

  onStatusChange(newStatus: string): void {
    // Validating against enum for strictness
    const isValid = Object.values(ContentStatus).includes(newStatus as ContentStatus);
    if (isValid) {
      console.log('Status changed to:', newStatus);
    }
  }

  private initializeEpisodes(): void {
    this.isLoading.set(true);

    this.productService
      .getFeaturedProducts() // Returns Observable<ContentData[]>
      .pipe(
        takeUntil(this.destroy$),
        // Type Predicate: Correctly narrows ContentData union to Episode
        map((items: ContentData[]) =>
          items.filter((item): item is Episode => item.contentType === 'Episode'),
        ),
      )
      .subscribe({
        next: (episodeItems: Episode[]) => {
          const reactiveEpisodes: ReactiveEpisode[] = episodeItems.map((e) => ({
            ...e,
            contentStatusSignal: signal(e.contentStatus),
          }));

          this.episode.set(reactiveEpisodes);
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          console.error('Error fetching episodes:', error.message);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
