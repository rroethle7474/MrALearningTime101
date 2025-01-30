export interface ContentMetadata {
  title: string
  author: string
  duration?: string
  sourceUrl: string
  type: 'article' | 'youtube' | 'package-tree'
  summary?: string
  processedDate?: string
  id?: string
}

export interface ContentSection {
  id: string
  title: string
  content: string
  timestamp?: string
}

export interface ProcessedContent {
  metadata: {
    title: string,
    author: string,
    sourceUrl: string,
    type: 'article' | 'youtube' | 'package-tree',
    duration?: string,
    id?: string
  },
  sections: ContentSection[]
} 