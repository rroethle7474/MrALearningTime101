// types/tutorial-list.ts

export interface TutorialListItem {
    id: string;
    title: string;
    description: string;
    source_url: string;
    generated_date: string;
    source_type: "article" | "youtube";
    section_count: number;
    metadata: {
      difficulty_level?: string;
      estimated_time?: string;
      [key: string]: any;
    };
  }
  
  export interface TutorialListResponse {
    total: number;
    items: TutorialListItem[];
  }
  
  export interface TutorialSection {
    section_id: string;
    tutorial_id: string;
    title: string;
    content: string;
    section_type: string;
    order: number;
    metadata: {
      reading_time?: string;
      [key: string]: any;
    };
  }
  
  export interface TutorialResponse {
    id: string;
    title: string;
    description: string;
    source_content_id?: string;
    source_type: "article" | "youtube";
    source_url?: string;
    generated_date: string;
    sections: TutorialSection[];
    metadata: {
      difficulty_level?: string;
      estimated_time?: string;
      prerequisites?: string[];
      [key: string]: any;
    };
  }