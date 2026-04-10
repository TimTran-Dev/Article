import { Article } from '../Models/content.interface';
import { ContentStatus } from '../Models/common.enum';

/**
 * Factory to create a valid Article object for testing.
 */
export const createArticleMock = (overrides: Partial<Article> = {}): Article => ({
  id: 1,
  ownerId: 0,
  contentType: 'Article',
  contentStatus: ContentStatus.Published,
  isDeleted: false,
  title: 'Test Article Title',
  author: 'Test Author',
  description: 'Test Description',
  body: 'Test Body Content',
  imageUrl: 'https://test.com/image.png',
  url: 'https://test.com/article',
  content: 'Test Content',
  sourceId: 'manual',
  sourceName: 'User Contributed',
  ...overrides,
});
