export interface WikiArticle {
  id: number;
  title: string;
  displayTitle: string;
  /** ~200-word preview, trimmed at a sentence boundary */
  extract: string;
  /** Full extract for expand-in-feed reading mode */
  extractFull: string;
  /** Short Wikidata one-liner, e.g. "French mathematician" */
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl: string;
  /** Up to 3 clean category labels (maintenance categories stripped) */
  categories: string[];
  /** Up to 4 linked articles from the article body — the rabbit holes */
  relatedTopics: RelatedTopic[];
  /** 0–5, derived from title hash, selects fallback gradient palette */
  colorSeed: number;
  lang: "en";
}

export interface RelatedTopic {
  title: string;
  pageUrl: string;
}
