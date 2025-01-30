import { api } from '../api/client'
import { ProcessedContent, ContentSection } from '../types/content'
import { TaskResponse, URLSubmissionRequest, SearchResult } from './types'

interface APIResponse {
  metadata: {
    title: string
    author: string
    source_url: string
    content_type: string
    duration?: string
    summary?: string
    processed_date?: string
  }
  chunks: string[]
}

export const contentService = {
  async submitContent(submission: URLSubmissionRequest): Promise<TaskResponse> {
    return api.post('content/submit', submission)
  },

  async getTaskStatus(taskId: string): Promise<TaskResponse> {
    return api.get(`content/task/${taskId}`)
  },

  async getContent(contentId: string): Promise<ProcessedContent> {
    const response = await api.get<APIResponse>(`content/${contentId}`)
    
    // Transform the API response to match the ProcessedContent type
    return {
      metadata: {
        title: response.metadata.title,
        author: response.metadata.author,
        sourceUrl: response.metadata.source_url,
        type: response.metadata.content_type as 'article' | 'youtube' | 'package-tree',
        duration: response.metadata.duration,
        summary: response.metadata.summary,
        processedDate: response.metadata.processed_date
      },
      sections: response.chunks.map((chunk, index) => ({
        id: `section-${index}`,
        title: `Section ${index + 1}`,
        content: chunk
      }))
    }
  },

  async searchContent(query: string, contentType: string, limit: number = 5): Promise<SearchResult> {
    return api.get('search/single', {
      query,
      content_type: contentType,
      limit: limit.toString(),
    })
  }
}