export interface WikiArticle {
  id: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl: string;
  categories?: string[];
}
