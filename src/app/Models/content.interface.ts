import { ContentStatus } from './common.enum';

export interface Content {
  id: number;
  ownerId?: number;
  contentType: ContentType;
  content: Article | Segment | Episode;
  description: string;
  contentStatus: ContentStatus;
}

export interface Article {
  id: number;
  ownerId?: number;
  title: string;
  author: string;
  body: string;
  imageUrl: string;
}

export interface Segment {
  id: number;
  ownerId?: number;
  name: string;
  host: string;
  contents: Content[];
}

export interface Episode {
  id: number;
  ownerId?: number;
  host: string;
  airDate: Date;
  title: string;
  segments: Segment[];
}

export type ContentType = 'Article' | 'Segment' | 'Episode';
