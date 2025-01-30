// Tutorial section types
export type TutorialSectionType = 'summary' | 'key_points' | 'code_example' | 'practice' | 'notes';

export interface TutorialSection {
  id: string;
  type: TutorialSectionType;
  title: string;
  content: string;
  metadata?: {
    language?: string;  // For code examples
    difficulty?: string;  // For practice exercises
    [key: string]: unknown;
  };
}

export interface TutorialMetadata {
  title: string;
  contentId: string;  // Reference to original content
  sourceUrl: string;
  contentType: 'article' | 'youtube';
  generatedDate: string;
}

export interface ProcessedTutorial {
  metadata: TutorialMetadata;
  sections: TutorialSection[];
}

// Keep the original interfaces for backwards compatibility if needed
export interface CodeExample {
  code: string;
  explanation: string;
  language?: string;
}

export interface PracticeExercise {
  question: string;
  solution: string;
  hints?: string[];
}

export interface TutorialContent {
  summary: string[];
  keyPoints: string[];
  codeExamples: CodeExample[];
  practiceExercises: PracticeExercise[];
  additionalNotes?: string[];
} 