import type { WritableSignal } from '@angular/core';
import { ContentStatus } from './common.enum';

export type ContentType = 'Article' | 'Segment' | 'Episode';

export type ContentData = Article | Segment | Episode;

export interface BaseContent {
  id: number;
  ownerId?: number;
  contentType: ContentType;
  description: string;
  url?: string;
  contentStatus: ContentStatus;
  isDeleted: boolean;
}

export interface Article extends BaseContent {
  contentType: 'Article';
  title: string;
  author: string;
  body: string;
  imageUrl: string | null;
  content: string;
  sourceId: string;
  sourceName: string;
  isBookmarked?: boolean;
}

export interface Segment extends BaseContent {
  contentType: 'Segment';
}

export interface Episode extends BaseContent {
  contentType: 'Episode';
}

export interface ReactiveArticle extends Article {
  contentStatusSignal: WritableSignal<ContentStatus>;
}
