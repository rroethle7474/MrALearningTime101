import { api } from '../api/client';
import { config } from '../config/config'

export interface DocumentSubmissionResponse {
  document_id: string;
  status: 'completed' | 'failed';
  error?: string;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  tags: string[];
  file_type: string;
  file_size: number;
  upload_date: string;
}

export interface ProcessedDocument {
  document_id: string;
  content: string;
  metadata: DocumentMetadata;
}

// Create a helper function for multipart form data requests
async function uploadFormData(endpoint: string, formData: FormData): Promise<Response> {
  const url = `${config.apiUrl}/api/${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,

  });

  if (!response.ok) {
    const error = await response.json();
    console.log('Error response:', error.error);
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response;
}

export const documentService = {
  async submitDocument(formData: FormData): Promise<DocumentSubmissionResponse> {
    try {
      const response = await uploadFormData('document/upload', formData);
      const data = await response.json();
      
      console.log('Document submission response:', data);

      if (data.status === 'failed') {
        throw new Error(data.error || 'Document processing failed');
      }
      
      return data;
    } catch (err) {
      // If the error is from our API and has a structured response
      console.log('Error:', err);
      if (err instanceof Error && 'response' in err) {
        const response = (err as any).response;
        if (response?.data?.error) {
          throw new Error(response.data.error);
        }
      }
      // Re-throw the original error if it's not a structured API error
      throw err;
    }
  },

  async getDocument(documentId: string): Promise<ProcessedDocument> {
    return api.get(`document/${documentId}`);
  },

  async deleteDocument(documentId: string): Promise<void> {
    return api.delete(`document/${documentId}`);
  },

  async searchDocuments(query: string, limit: number = 5): Promise<ProcessedDocument[]> {
    return api.get('document/search', {
      query,
      limit: limit.toString(),
    });
  }
}; 