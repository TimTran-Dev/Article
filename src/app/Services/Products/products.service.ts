import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';
import { environment } from '../../../environments/environment';
import { NewsArticleUpdateDto } from '../../Models/NewsArticleUpdate.interface';
import { NewsArticleCreateDto } from '../../Models/NewsArticleCreate.interface';
import {
  ArticleAPIResponse,
  PaginatedArticleResponse,
} from '../../Models/ArticleAPIResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getArticles(
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
      .get<PaginatedArticleResponse>(`${this.baseUrl}/news`, {
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

  public deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/news/delete/${id}`);
  }

  public updateArticle(id: number, articleDto: NewsArticleUpdateDto): Observable<void> {
    const url = `${this.baseUrl}/news/update/${id}`;
    return this.http.patch<void>(url, articleDto);
  }

  public createArticle(articleDto: NewsArticleCreateDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/news/create`, articleDto);
  }

  public getFeaturedProducts(): Observable<Article[]> {
    return this.http
      .get<ArticleAPIResponse[]>(`${this.baseUrl}/news`)
      .pipe(
        map((apiArticles: ArticleAPIResponse[]) =>
          apiArticles.map((item) => this.mapToArticle(item)),
        ),
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
