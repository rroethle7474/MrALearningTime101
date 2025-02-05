// types/search.ts

export type CollectionType = 'all' | 'articles_content' | 'youtube_content' | 'tiktok_content' | 'tutorial_sections';

export interface SearchResultDTO {
  id: string;
  content: string;
  metadata: {
    title: string;
    source_url: string;
    content_type: "article" | "youtube" | "tiktok";
    summary?: string;
    author: string;
  };
  relevanceScore: number;
}

export interface SearchResponseDTO {
  query: string;
  results: SearchResultDTO[];
}

export interface MultiCollectionSearchResponse {
  query: string;
  collections: {
    [collectionName: string]: SearchResultDTO[];
  };
}

export interface SearchParams {
  query: string;
  collection?: CollectionType;
  limit?: number;
}