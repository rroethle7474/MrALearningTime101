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
  },

  async downloadDocument(documentId: string): Promise<void> {
    try {
      const response = await fetch(`${config.apiUrl}/api/document/${documentId}/download`);
      
      if (!response.ok) {
        throw new Error('File not available for download');
      }

      const blob = await response.blob();
      let filename = 'document';
      
      // Try to get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition') || 
                               response.headers.get('Content-Disposition');
      console.log("CONTENT DISPOSITION", contentDisposition)
      if (contentDisposition) {
        const filenameMatch = /filename=(?:(['"])(.*?)\1|([^'"][^;]*))/.exec(contentDisposition);
        if (filenameMatch) {

          filename = filenameMatch[2] || filenameMatch[3];
        }
      } else {
        // Fallback: Try to get filename from URL
        const urlParts = response.url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart !== 'download') {
          filename = decodeURIComponent(lastPart);
        }
      }

      // Ensure we have a file extension
      if (!filename.includes('.')) {
        const contentType = response.headers.get('content-type');
        if (contentType === 'application/octet-stream') {
          filename += '.pdf';
        } else {
          const extensionMap: { [key: string]: string } = {
            'application/pdf': '.pdf',
            'text/plain': '.txt',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'text/markdown': '.md'
          };
          const extension = extensionMap[contentType] || '';
          if (extension) {
            filename += extension;
          }
        }
      }

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('No source file available to download');
      throw err;
    }
  },
}; 