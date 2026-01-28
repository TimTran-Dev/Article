// The new "Wrapper" that matches your Controller's return (items, totalCount)
export interface PaginatedArticleResponse {
  items: ArticleAPIResponse[];
  totalCount: number;
}

// Your existing item model (keep this as is)
export interface ArticleAPIResponse {
  source: {
    id: string | null;
    name: string;
  };
  id: number;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  isBookmarked: boolean;
}
