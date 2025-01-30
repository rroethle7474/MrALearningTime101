export interface TaskResponse {
  task_id: string
  status: 'processing' | 'completed' | 'failed'
  message?: string
}

export interface SearchParams {
  query: string
  content_type: 'article' | 'youtube' | 'tutorial'
  limit?: number
}

export interface SearchResult {
  results: Array<{
    id: string
    content: string
    metadata: Record<string, unknown>
    distance: number
  }>
}

export interface URLSubmissionRequest {
  url: string
  content_type: 'article' | 'youtube'
} 