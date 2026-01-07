import { ContentStatus } from '../Models/common.enum';
import { Article, Content } from '../Models/content.interface';

export const mockContent: Content[] = [
  {
    id: 1,
    contentType: 'Article',
    description: 'Test Article',
    content: {
      id: 1,
      title: 'Test Article',
      author: 'Test Author',
      body: 'Test body',
      imageUrl: 'test-image-url',
    } as Article,
    contentStatus: ContentStatus.Published,
  },
];
