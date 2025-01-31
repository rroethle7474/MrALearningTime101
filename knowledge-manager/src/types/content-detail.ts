export interface ContentDetailResponse {
    id: string;
    title: string;
    content_type: string;
    author: string;
    source_url: string;
    summary?: string;
    published_date?: string;
    processed_date: string;
    tutorial_id?: string;
    content_chunks: string[];
    metadata: {
      [key: string]: any;
    };
  }