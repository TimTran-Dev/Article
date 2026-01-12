import { Content, Episode, Segment } from '../Models/content.interface';
import { ContentStatus } from '../Models/common.enum';
import { Article } from '../Models/content.interface';

export const mockDraftContent: Content = {
  id: 1,
  contentType: 'Article',
  ownerId: 0,
  url: 'test-url',
  content: {
    id: 1,
    ownerId: 0,
    title: 'Sample Title',
    author: 'Sample Author',
    body: 'Sample Body',
    imageUrl: 'sample-url',
    content: 'test-content',
    sourceId: 'test-id',
    sourceName: 'test-name',
  },
  description: 'Sample Description',
  contentStatus: ContentStatus.Draft,
};

export const mockProducts: Content[] = [
  {
    id: 1,
    contentType: 'Article',
    ownerId: 0,
    url: 'test-url',
    content: {
      id: 1,
      ownerId: 0,
      title: 'Featured Article',
      author: 'Featured Author',
      body: 'Featured Body',
      imageUrl: 'featured-url',
      content: 'test-content',
      sourceId: 'test-id',
      sourceName: 'test-name',
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
    url: 'test-url',
    content: {
      id: 1,
      ownerId: 1,
      title: 'Test Article',
      author: 'Test Author',
      body: 'Test body',
      imageUrl: 'test-image-url',
    } as Article,
    contentStatus: ContentStatus.Published,
  },
  {
    id: 2,
    contentType: 'Segment',
    description: 'Test Segment',
    url: 'test-url',
    content: {
      id: 2,
      ownerId: 2,
      name: 'Test Name',
      host: 'Test Host',
      contents: [],
    } as Segment,
    contentStatus: ContentStatus.Draft,
  },
  {
    id: 3,
    contentType: 'Episode',
    description: 'Test Episode',
    url: 'test-url',
    content: {
      id: 3,
      ownerId: 3,
      host: 'Test Host',
      airDate: new Date(),
      title: 'Test Title',
      segments: [],
    } as Episode,
    contentStatus: ContentStatus.Review,
  },
];
