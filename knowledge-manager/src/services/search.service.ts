// services/search.service.ts
import { api } from '../api/client';
import { 
  SearchParams, 
  SearchResponseDTO, 
  MultiCollectionSearchResponse, 
} from '../types/search';

export const searchService = {
  async searchSingle(params: SearchParams): Promise<SearchResponseDTO> {
    const queryParams = {
      query: params.query,
      collection: params.collection,
      limit: params.limit?.toString()
    };
    
    return api.get<SearchResponseDTO>('search/single', queryParams);
  },

  async searchMultiple(params: SearchParams): Promise<MultiCollectionSearchResponse> {
    const collections = ['articles_content', 'youtube_content', 'tutorials'];
    const queryParams = {
      query: params.query,
      collections: collections.join(','),
      limit_per_collection: params.limit?.toString() || '3'
    };
    
    return api.get<MultiCollectionSearchResponse>('search/multi', queryParams);
  },

  async search(params: SearchParams): Promise<SearchResponseDTO> {
    if (params.collection === 'all') {
      const multiResponse = await this.searchMultiple(params);
      
      // Flatten and sort results by relevance score
      const allResults = Object.values(multiResponse.collections)
        .flat()
        .sort((a, b) => b.distance - a.distance);
      
      return {
        query: multiResponse.query,
        results: allResults.slice(0, params.limit || 10)
      };
    }
    
    return this.searchSingle(params);
  }
};