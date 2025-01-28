export interface ContentMetadata {
  title: string
  author: string
  duration?: string
  sourceUrl: string
  type: 'article' | 'youtube' | 'package-tree'
}

export interface ContentSection {
  id: string
  title: string
  content: string
  timestamp?: string
}

export interface ProcessedContent {
  metadata: ContentMetadata
  sections: ContentSection[]
} 