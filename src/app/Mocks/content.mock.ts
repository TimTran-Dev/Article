import { Content } from '../Models/content.interface';
import { ContentStatus } from '../Models/common.enum';
import { Article } from '../Models/content.interface';

export const mockDraftContent: Content = {
  id: 1,
  contentType: 'Article',
  ownerId: 0,
  content: {
    id: 1,
    ownerId: 0,
    title: 'Sample Title',
    author: 'Sample Author',
    body: 'Sample Body',
    imageUrl: 'sample-url',
  },
  description: 'Sample Description',
  contentStatus: ContentStatus.Draft,
};

export const mockProducts: Content[] = [
  {
    id: 1,
    contentType: 'Article',
    ownerId: 0,
    content: {
      id: 1,
      ownerId: 0,
      title: 'Featured Article',
      author: 'Featured Author',
      body: 'Featured Body',
      imageUrl: 'featured-url',
    },
    description: 'Featured Article Description',
    contentStatus: ContentStatus.Published,
  },
];

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
