import { api } from '../api/client'
import { SearchParams, SearchResult } from './types'

export const searchService = {
  async searchSingle(params: SearchParams): Promise<SearchResult> {
    return api.get('search/single', {
      ...params,
      limit: params.limit?.toString(),
    })
  },

  async searchMultiple(params: SearchParams): Promise<SearchResult> {
    return api.get('search/multi', {
      ...params,
      limit: params.limit?.toString(),
    })
  },

  async findSimilar(contentId: string): Promise<SearchResult> {
    return api.get(`search/similar/${contentId}`)
  }
} 