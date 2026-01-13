import { of, Observable } from 'rxjs';
import { Article, ContentData } from '../Models/content.interface';
import { ContentStatus } from '../Models/common.enum';
import { NewsArticleCreateDto } from '../Models/NewsArticleCreate.interface';
import { NewsArticleUpdateDto } from '../Models/NewsArticleUpdate.interface';

export interface PaginatedArticles {
  items: Article[];
  totalCount: number;
}

/**
 * Interface representing the public API of ProductsService.
 * This allows us to type the mock factory strictly.
 */
export interface IProductsService {
  getFeaturedProducts(): Observable<Article[]>;
  getArticles(page: number, size: number, term: string): Observable<PaginatedArticles>;
  createArticle(dto: NewsArticleCreateDto): Observable<void>;
  updateArticle(id: number, articleDto: NewsArticleUpdateDto): Observable<void>;
  deleteArticle(id: number): Observable<void>;
  updateContentStatus(content: ContentData, status: ContentStatus): Observable<ContentData>;
  assignOwnerToProduct(content: ContentData, ownerId: number): Observable<ContentData>;
}

export const createProductsServiceMock = (
  overrides: Partial<IProductsService> = {},
): IProductsService => {
  return {
    getFeaturedProducts: (): Observable<Article[]> => of([] as Article[]),

    getArticles: (page: number, size: number, term: string): Observable<PaginatedArticles> =>
      of({ items: [] as Article[], totalCount: 0 }),

    // Updated to match your refactored service (returning Observable<void>)
    createArticle: (dto: NewsArticleCreateDto): Observable<void> => of(undefined),

    updateArticle: (id: number, articleDto: NewsArticleUpdateDto): Observable<void> =>
      of(undefined),

    deleteArticle: (id: number): Observable<void> => of(undefined),

    updateContentStatus: (content: ContentData, status: ContentStatus): Observable<ContentData> =>
      of({ ...content, contentStatus: status } as ContentData),

    assignOwnerToProduct: (content: ContentData, ownerId: number): Observable<ContentData> =>
      of({ ...content, ownerId } as ContentData),

    ...overrides,
  };
};

export const mockProductsService = createProductsServiceMock();
