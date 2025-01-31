import { api } from '../api/client';
import { MultiCollectionContentResponse } from '../types/collection';
import { ContentDetailResponse } from '../types/content-detail';

const CONTENT_COLLECTIONS = [
  'articles_content',
  'youtube_content'
];

export const collectionService = {
  async getCollectionsContent(offset: number = 0, limit: number = 50): Promise<MultiCollectionContentResponse> {
    const queryParams = {
      collections: CONTENT_COLLECTIONS.join(','),
      offset: offset.toString(),
      limit: limit.toString()
    };
    
    return api.get<MultiCollectionContentResponse>('search/collections/contents', queryParams);
  },

  async getContentDetail(collectionName: string, contentId: string): Promise<ContentDetailResponse> {
    return api.get<ContentDetailResponse>(`search/content/${collectionName}/${contentId}`);
  },

  async deleteContent(collectionName: string, contentId: string): Promise<boolean> {
    return api.delete(`search/content/${collectionName}/${contentId}`);
  }
};