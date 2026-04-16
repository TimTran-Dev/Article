import { ContentStatus } from '../Models/common.enum';
import { Article, ContentData } from '../Models/content.interface';

export const mockDraftArticle: Article = {
  id: 1,
  ownerId: 101,
  contentType: 'Article',
  contentStatus: ContentStatus.Draft,
  isDeleted: false,
  url: 'https://example.com/draft',
  description: 'A sample draft article description',

  title: 'Sample Draft Title',
  author: 'John Doe',
  body: 'This is the main body content of the article.',
  imageUrl: 'https://example.com/image.jpg',
  content: 'Truncated preview content',
  sourceId: 'manual',
  sourceName: 'Local Editor',
};

export const mockArticles: Article[] = [
  {
    ...mockDraftArticle,
    id: 1,
    title: 'Featured Tech News',
    contentStatus: ContentStatus.Published,
  },
  {
    ...mockDraftArticle,
    id: 2,
    title: 'Upcoming Science Breakthroughs',
    contentStatus: ContentStatus.Review,
  },
];

export const mockMixedContent: ContentData[] = [
  {
    id: 1,
    contentType: 'Article',
    contentStatus: ContentStatus.Published,
    isDeleted: false,
    description: 'Tech Trends 2026',
    url: 'https://tech.com/trends',
    title: 'Tech Trends 2026',
    author: 'Jane Smith',
    body: 'Future tech insights...',
    imageUrl: 'https://tech.com/img.png',
    content: 'Future tech...',
    sourceId: 'news-api',
    sourceName: 'Tech Daily',
  },
  {
    id: 2,
    contentType: 'Segment',
    contentStatus: ContentStatus.Draft,
    isDeleted: false,
    description: 'Morning News Segment',
  },
  {
    id: 3,
    contentType: 'Episode',
    contentStatus: ContentStatus.Review,
    isDeleted: false,
    description: 'Podcast Episode 42',
  },
];
