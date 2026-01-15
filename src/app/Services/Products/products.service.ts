import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';
import { environment } from '../../../environments/environment';
import { NewsArticleUpdateDto } from '../../Models/NewsArticleUpdate.interface';
import { NewsArticleCreateDto } from '../../Models/NewsArticleCreate.interface';
import { ArticleAPIResponse } from '../../Models/ArticleAPIResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Fetches paginated articles. Returns a flattened Article structure.
   */
  public getArticles(
    page: number,
    pageSize: number,
    searchTerm: string,
  ): Observable<{ items: Article[]; totalCount: number }> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchTerm,
    };

    // 1. Type the HTTP call as ArticleAPIResponse[]
    // 2. 'observe: response' means we get the full HttpResponse object
    return this.http
      .get<ArticleAPIResponse[]>(`${this.baseUrl}/news`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          // 3. Extract headers safely
          const totalCount = Number(response.headers.get('X-Total-Count') || 0);

          // 4. response.body is now correctly typed as ArticleAPIResponse[] | null
          const apiItems: ArticleAPIResponse[] = response.body || [];

          const items: Article[] = apiItems.map((apiItem) => this.mapToArticle(apiItem));

          return { items, totalCount };
        }),
      );
  }

  public deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/news/delete/${id}`);
  }

  public updateArticle(id: number, articleDto: NewsArticleUpdateDto): Observable<void> {
    const url = `${this.baseUrl}/news/update?id=${id}`;
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

  /**
   * Helper to map API response to the flat Article interface.
   * Uses ArticleAPIResponse to ensure type safety during transformation.
   */
  private mapToArticle(apiItem: ArticleAPIResponse): Article {
    return {
      // BaseContent properties
      id: 0, // Set default or use a specific field if the API provides a numeric ID
      ownerId: 0,
      contentType: 'Article',
      description: apiItem.description || 'No description provided.',
      url: apiItem.url,
      contentStatus: ContentStatus.Published,
      isDeleted: false,

      // Article specific properties
      title: apiItem.title,
      author: apiItem.author || 'News Source',
      body: apiItem.description || '', // Mapping description to body as per your logic
      imageUrl: apiItem.urlToImage,
      content: apiItem.content || '',

      // Mapping from the nested source object in ArticleAPIResponse
      sourceId: apiItem.source.id || '',
      sourceName: apiItem.source.name || '',
    };
  }
}
