// types/collection.ts

export type ContentType = "article" | "youtube";

export interface ContentListItem {
  id: string;
  title: string;
  type: ContentType;
  source: string;
  metadata: {
    content_id: string;
    title: string;
    author: string;
    source_url: string;
    content_type: ContentType;
    duration?: string;
    published_date?: string;
    view_count?: number;
    summary?: string;
    processed_date: string;
  };
}

export interface ContentListResponse {
  total: number;
  items: ContentListItem[];
}

export interface MultiCollectionContentResponse {
  collections: {
    [collectionName: string]: ContentListResponse;
  };
}

// Simplified grid item for articles and videos
export interface GridItem {
  id: string;
  title: string;
  type: ContentType;
  sourceUrl: string;
  author: string;
  processedDate: string;
  duration?: string;  // For YouTube videos
  summary?: string;   // For quick preview
}