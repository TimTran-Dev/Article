export interface NewsArticleCreateDto {
  title: string;
  url: string;
  description?: string | null;
  author?: string | null;
  urlToImage?: string | null;
  content?: string | null;
  sourceId?: string | null;
  sourceName?: string | null;
}
