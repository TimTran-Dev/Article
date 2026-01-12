import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Content, Article } from '../Models/content.interface';
import { ContentStatus } from '../Models/common.enum';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Fetches paginated articles and maps them to the Content interface.
   * Includes the total count from the custom backend header.
   */
  public getArticles(
    page: number,
    pageSize: number,
    searchTerm: string,
  ): Observable<{ items: Content[]; totalCount: number }> {
    const params = { page: page.toString(), pageSize: pageSize.toString(), searchTerm };

    return this.http.get<any[]>(`${this.baseUrl}/news`, { params, observe: 'response' }).pipe(
      map((response) => {
        // Read the custom header we exposed in ASP.NET Core
        const totalCount = Number(response.headers.get('X-Total-Count') || 0);

        const items: Content[] = (response.body || []).map((apiItem) => ({
          id: apiItem.id,
          contentType: 'Article',
          description: apiItem.description || 'No description provided.',
          contentStatus: ContentStatus.Published,
          url: apiItem.url,
          content: {
            id: apiItem.id,
            title: apiItem.title,
            author: apiItem.author || 'News Source',
            body: apiItem.description,
            imageUrl: apiItem.urlToImage,
            content: apiItem.content,
            sourceId: apiItem.sourceId,
            sourceName: apiItem.sourceName,
          } as Article,
        }));

        return { items, totalCount };
      }),
    );
  }

  // Keep your existing getFeaturedProducts if needed for the Home page
  public getFeaturedProducts(): Observable<Content[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/news`)
      .pipe(map((apiArticles) => apiArticles.map(this.mapToContent)));
  }

  private mapToContent(apiItem: any): Content {
    return {
      id: apiItem.id,
      contentType: 'Article',
      description: apiItem.description || '',
      url: apiItem.url,
      contentStatus: ContentStatus.Published,
      content: {
        id: apiItem.id,
        title: apiItem.title,
        author: apiItem.author || 'News Source',
        body: apiItem.description,
        imageUrl: apiItem.urlToImage || 'https://via.placeholder.com/150',
      } as Article,
    };
  }
}
