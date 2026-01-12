import { of } from 'rxjs';
import { Content } from '../Models/content.interface';
import { ContentStatus } from '../Models/common.enum';
import { mockContent } from './content.mock';

export const mockProductsService = {
  getFeaturedProducts: () => of(mockContent),
  assignOwnerToProduct: (content: Content, ownerId: number) => ({ ...content, ownerId }),
  updateContentStatus: (content: Content, status: ContentStatus) => ({
    ...content,
    contentStatus: status,
  }),
  getArticles: (page: number, pageSize: number, searchTerm: string) => {
    return of({
      items: mockContent, // Returns your full mock array regardless of params
      totalCount: mockContent.length,
    });
  },
};
