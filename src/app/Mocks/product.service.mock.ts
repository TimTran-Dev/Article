import { of, Observable } from 'rxjs';
import { vi, Mock } from 'vitest';
import { Article, ContentData } from '../Models/content.interface';
import { ContentStatus } from '../Models/common.enum';
import { NewsArticleCreateDto } from '../Models/NewsArticleCreate.interface';
import { NewsArticleUpdateDto } from '../Models/NewsArticleUpdate.interface';

export interface PaginatedArticles {
  items: Article[];
  totalCount: number;
}

/**
 * Pass the function signature as the single generic argument to Mock.
 * Syntax: Mock<(params) => ReturnType>
 */
export interface IProductsServiceMock {
  getFeaturedProducts: Mock<() => Observable<Article[]>>;
  getArticles: Mock<(page: number, size: number, term: string) => Observable<PaginatedArticles>>;
  createArticle: Mock<(dto: NewsArticleCreateDto) => Observable<void>>;
  updateArticle: Mock<(id: number, articleDto: NewsArticleUpdateDto) => Observable<void>>;
  deleteArticle: Mock<(id: number) => Observable<void>>;
  updateContentStatus: Mock<
    (content: ContentData, status: ContentStatus) => Observable<ContentData>
  >;
  assignOwnerToProduct: Mock<(content: ContentData, ownerId: number) => Observable<ContentData>>;
}

export const createProductsServiceMock = (): IProductsServiceMock => {
  return {
    getFeaturedProducts: vi.fn().mockReturnValue(of([])),
    getArticles: vi.fn().mockReturnValue(of({ items: [], totalCount: 0 })),
    createArticle: vi.fn().mockReturnValue(of(undefined)),
    updateArticle: vi.fn().mockReturnValue(of(undefined)),
    deleteArticle: vi.fn().mockReturnValue(of(undefined)),
    // For functions with logic, use vi.fn((params) => ...)
    updateContentStatus: vi.fn((content: ContentData, status: ContentStatus) =>
      of({ ...content, contentStatus: status }),
    ),
    assignOwnerToProduct: vi.fn((content: ContentData, ownerId: number) =>
      of({ ...content, ownerId }),
    ),
  };
};

export const mockProductsService = createProductsServiceMock();
