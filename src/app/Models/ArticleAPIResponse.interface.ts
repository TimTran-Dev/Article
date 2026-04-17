export interface PaginatedArticleResponse {
  items: ArticleAPIResponse[];
  totalCount: number;
}

export interface ArticleAPIResponse {
  id: number;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  isBookmarked: boolean;
  sourceName: string | null;
}
