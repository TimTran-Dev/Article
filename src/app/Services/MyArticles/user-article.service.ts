import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Article } from '../../Models/content.interface';
import { map, Observable } from 'rxjs';
import {
  ArticleAPIResponse,
  PaginatedArticleResponse,
} from '../../Models/ArticleAPIResponse.interface';
import { ContentStatus } from '../../Models/common.enum';

@Injectable({
  providedIn: 'root',
})
export class UserArticleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getUserArticles(
    page: number,
    pageSize: number,
    searchTerm = '',
  ): Observable<{ items: Article[]; totalCount: number }> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchTerm,
    };

    return this.http
      .get<PaginatedArticleResponse>(`${this.baseUrl}/UserArticle`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const body = response.body;
          const totalCount = body?.totalCount ?? 0;
          const apiItems = body?.items ?? [];
          const items: Article[] = apiItems.map((apiItem) => this.mapToArticle(apiItem));

          return { items, totalCount };
        }),
      );
  }

  private mapToArticle(apiItem: ArticleAPIResponse): Article {
    return {
      id: apiItem.id,
      ownerId: 0,
      contentType: 'Article',
      description: apiItem.description || 'No description provided.',
      url: apiItem.url,
      contentStatus: ContentStatus.Published,
      isDeleted: false,
      title: apiItem.title,
      author: apiItem.author || 'News Source',
      body: apiItem.description || '',
      imageUrl: apiItem.urlToImage,
      content: apiItem.content || '',
      isBookmarked: apiItem.isBookmarked ?? false,
      sourceName: apiItem.sourceName || 'Unknown Source',
    };
  }
}
