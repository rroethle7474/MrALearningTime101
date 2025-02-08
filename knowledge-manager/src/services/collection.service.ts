import { api } from '../api/client';
import { MultiCollectionContentResponse } from '../types/collection';
import { ContentDetailResponse } from '../types/content-detail';
import { MultiCollectionDocumentResponse, DocumentDetailResponse } from '../types/document';

const CONTENT_COLLECTIONS = [
  'articles_content',
  'youtube_content'
];

const DOCUMENT_COLLECTIONS = [
  'notes'
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

  async deleteContent(collectionName: string, contentId: string): Promise<void> {
    await api.delete(`search/content/${collectionName}/${contentId}`);
  },

  async checkContentExists(collectionName: string, sourceUrl: string): Promise<{ exists: boolean; content_id: string } | null> {
    try {
      return api.get(`search/content/${collectionName}/by-url`, { source_url: sourceUrl });
    } catch (error) {
      if ((error as any)?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getDocumentsContent(offset: number = 0, limit: number = 50): Promise<MultiCollectionDocumentResponse> {
    const queryParams = {
      collections: DOCUMENT_COLLECTIONS.join(','),
      offset: offset.toString(),
      limit: limit.toString()
    };
    
    return api.get<MultiCollectionDocumentResponse>('search/documents/collections/contents', queryParams);
  },

  async getDocumentDetail(collectionName: string, documentId: string): Promise<DocumentDetailResponse> {
    return api.get<DocumentDetailResponse>(`search/document/${collectionName}/${documentId}`);
  },

  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    await api.delete(`search/document/${collectionName}/${documentId}`);
  }
};