import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { ArticleAPIResponse } from '../../Models/ArticleAPIResponse.interface';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getUsersBookmarks(): Observable<Article[]> {
    return this.http
      .get<ArticleAPIResponse[]>(`${this.baseUrl}/bookmarks/my-bookmarks`)
      .pipe(map((apiArticles) => apiArticles.map((item) => this.mapToArticle(item))));
  }

  public toggleBookmark(articleId: number): Observable<{ bookmarked: boolean }> {
    return this.http.post<{ bookmarked: boolean }>(
      `${this.baseUrl}/bookmarks/bookmark/${articleId}`,
      {},
    );
  }

  private mapToArticle(item: ArticleAPIResponse): Article {
    return {
      id: item.id,
      contentType: 'Article',
      description: item.description || '',
      url: item.url,
      contentStatus: ContentStatus.Published,
      isDeleted: false,
      title: item.title,
      author: item.author || 'Anonymous',
      body: item.description || '',
      content: item.content || '',
      imageUrl: item.urlToImage,
      sourceId: item.source && item.source.id ? item.source.id : '',
      sourceName: item.source && item.source.name ? item.source.name : 'Unknown Source',
      isBookmarked: item.isBookmarked,
    };
  }
}
