import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../Models/content.interface';
import { ArticleCardComponent } from '../Articles/Cards/article-card.component';
import { BookmarkService } from '../../Services/Bookmark/bookmark.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent, RouterLink],
  templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit {
  private bookmarkService = inject(BookmarkService);

  bookmarks = signal<Article[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadBookmarks();
  }

  loadBookmarks(): void {
    this.isLoading.set(true);
    this.bookmarkService.getUsersBookmarks().subscribe({
      next: (data) => {
        const markedData = data.map((a) => ({ ...a, isBookmarked: true }));
        this.bookmarks.set(markedData);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  handleRemoveBookmark(id: number): void {
    const backup = this.bookmarks();

    this.bookmarks.update((list) => list.filter((a) => a.id !== id));

    this.bookmarkService.toggleBookmark(id).subscribe({
      error: (err) => {
        console.error('Could not remove bookmark', err);
        this.bookmarks.set(backup);
      },
    });
  }
}
