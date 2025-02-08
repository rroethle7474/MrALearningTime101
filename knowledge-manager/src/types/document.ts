export type FileType = "pdf" | "doc" | "txt" | "md";

export interface DocumentListItem {
  id: string;
  title: string;
  file_type: FileType;
  tags?: string[];
  created_date: string;
  metadata: {
    title: string;
    file_type: FileType;
    tags?: string[];
    created_date: string;
    [key: string]: unknown;
  };
}

export interface DocumentListResponse {
  total: number;
  items: DocumentListItem[];
}

export interface MultiCollectionDocumentResponse {
  collections: {
    [collectionName: string]: DocumentListResponse;
  };
}

export interface DocumentGridItem {
  id: string;
  key: string;
  title: string;
  fileType: FileType;
  tags?: string[];
  createdDate: string;
}

export interface DocumentDetailResponse {
  id: string;
  title: string;
  file_type: FileType;
  content: string[];
  tags?: string[];
  created_date: string;
  metadata: Record<string, unknown>;
  processed_date: string;
} 