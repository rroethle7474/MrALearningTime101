import { useState } from 'react';
import { documentService, ProcessedDocument } from '../services/document.service';

interface UseDocumentSubmissionResult {
  submitDocument: (file: File, title: string, tags: string) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
  processedDocument: ProcessedDocument | null;
  documentId: string | null;
}

export const useDocumentSubmission = (): UseDocumentSubmissionResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedDocument, setProcessedDocument] = useState<ProcessedDocument | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const submitDocument = async (
    file: File,
    title: string,
    tags: string
  ): Promise<boolean> => {
    console.log('Starting document submission:', { title, tags });
    setIsProcessing(true);
    setError(null);
    setProcessedDocument(null);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('tags', tags);
      formData.append('file', file);

      const response = await documentService.submitDocument(formData);
      
      if (response.document_id) {
        const document = await documentService.getDocument(response.document_id);
        setProcessedDocument(document);
        setDocumentId(response.document_id);
        return true;
      }
      
      setError(response.error || 'Failed to process document');
      return false;
    } catch (err) {
      console.error('Document submission failed:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while processing the document');
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    submitDocument,
    isProcessing,
    error,
    processedDocument,
    documentId,
  };
}; 