export interface NewsArticleUpdateDto {
  title: string;
  url: string;
  description?: string;
  author?: string;
  urlToImage?: string;
  content?: string;
}
