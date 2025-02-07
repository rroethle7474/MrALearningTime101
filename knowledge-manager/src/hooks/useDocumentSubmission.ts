import { useState, useEffect } from 'react';
import { documentService, DocumentTaskResponse, ProcessedDocument } from '../services/document.service';

interface UseDocumentSubmissionResult {
  submitDocument: (file: File, title: string, tags: string) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
  taskId: string | null;
  processingStatus: string | undefined;
  processedDocument: ProcessedDocument | null;
  documentId: string | null;
}

export const useDocumentSubmission = (): UseDocumentSubmissionResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>();
  const [processedDocument, setProcessedDocument] = useState<ProcessedDocument | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount or when stopping
  const cleanupPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupPolling();
  }, []);

  const pollProcessingStatus = async (taskId: string): Promise<DocumentTaskResponse> => {
    console.log('Starting document processing polling for:', taskId);
    const maxAttempts = 60;
    let attempts = 0;

    // Clear any existing polling
    cleanupPolling();

    const poll = async (): Promise<DocumentTaskResponse> => {
      console.log(`Document poll attempt ${attempts + 1}/${maxAttempts}`);
      if (attempts >= maxAttempts) {
        cleanupPolling();
        throw new Error('Processing timed out');
      }

      try {
        const status = await documentService.getTaskStatus(taskId);
        console.log('Document status response:', status);
        setProcessingStatus(`Processing document: ${status.status}`);

        if (status.status === 'completed' || status.status === 'failed') {
          cleanupPolling();
          if (status.document_id) {
            setDocumentId(status.document_id);
          }
          if (status.status === 'failed') {
            throw new Error(status.message || 'Processing failed');
          }
          return status;
        }

        attempts++;
        return new Promise((resolve) => {
          const interval = setInterval(async () => {
            try {
              resolve(await poll());
            } catch (err) {
              cleanupPolling();
              throw err;
            }
          }, 1000);
          setPollInterval(interval);
        });
      } catch (err) {
        cleanupPolling();
        throw err;
      }
    };

    return poll();
  };

  const submitDocument = async (
    file: File,
    title: string,
    tags: string
  ): Promise<boolean> => {
    console.log('Starting document submission:', { title, tags });
    setIsProcessing(true);
    setError(null);
    setTaskId(null);
    setProcessedDocument(null);
    cleanupPolling(); // Ensure any existing polling is cleaned up
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('tags', tags);
      formData.append('file', file);

      const response = await documentService.submitDocument(formData);
      console.log('Submit document response:', response);

      // If we got this far, we have a task_id
      setTaskId(response.task_id);

      // Only poll if we don't have an immediate completion
      if (response.status !== 'completed') {
        const completedTask = await pollProcessingStatus(response.task_id);
        
        if (completedTask.status === 'completed' && completedTask.document_id) {
          const document = await documentService.getDocument(completedTask.document_id);
          setProcessedDocument(document);
          return true;
        }
      } else if (response.document_id) {
        const document = await documentService.getDocument(response.document_id);
        setProcessedDocument(document);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Document submission failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process document';
      setError(errorMessage);
      return false;
    } finally {
      setIsProcessing(false);
      cleanupPolling();
    }
  };

  return {
    submitDocument,
    isProcessing,
    error,
    taskId,
    processingStatus,
    processedDocument,
    documentId,
  };
}; 