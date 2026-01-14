import { WritableSignal } from '@angular/core';
import { ContentStatus } from './common.enum';

// 1. Define the Type Alias first
export type ContentType = 'Article' | 'Segment' | 'Episode';

// 2. Define the Union for all possible data shapes
export type ContentData = Article | Segment | Episode;

export interface BaseContent {
  id: number;
  ownerId?: number;
  contentType: ContentType; // Now this will be found
  description: string;
  url?: string;
  contentStatus: ContentStatus;
  isDeleted: boolean;
}

export interface Article extends BaseContent {
  contentType: 'Article'; // More specific literal for narrowing
  title: string;
  author: string;
  body: string;
  imageUrl: string;
  content: string;
  sourceId: string;
  sourceName: string;
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
