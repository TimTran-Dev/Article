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
};
