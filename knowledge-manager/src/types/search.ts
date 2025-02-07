// types/search.ts

export type CollectionType = 'all' | 'articles_content' | 'youtube_content' | 'tutorials' | 'notes';

export interface SearchResultDTO {
  id: string;
  content: string;
  metadata: {
    title: string;
    source_url: string;
    content_type: "article" | "youtube" | "tutorial" | "note";
    summary?: string;
    author: string;
  };
  distance: number;
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