import { useState } from 'react';
import { TaskResponse, URLSubmissionRequest } from '../services/types';
import { ProcessedContent } from '../types/content';
import { contentService } from '../services/content.service';

interface UseUrlSubmissionResult {
  submitUrl: (url: string, type: 'article' | 'youtube') => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  taskId: string | null;
  processingStatus: string | undefined;
  processedContent: ProcessedContent | null;
}

export function useUrlSubmission(): UseUrlSubmissionResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>();
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);

  const submitUrl = async (url: string, type: 'article' | 'youtube') => {
    setIsProcessing(true);
    setError(null);
    setTaskId(null);
    setProcessedContent(null);
    
    try {
      // Validate URL
      try {
        new URL(url);
      } catch {
        throw new Error('Invalid URL format');
      }

      // Validate YouTube URL if type is youtube
      if (type === 'youtube' && !url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
        throw new Error('Invalid YouTube URL');
      }

      const submission: URLSubmissionRequest = {
        url,
        content_type: type
      };

      setProcessingStatus('Submitting URL...');
      
      const response = await contentService.submitContent(submission);
      console.log('Submit response:', response);
      setTaskId(response.task_id);
      
      // Start polling for status if needed
      if (response.task_id) {
        const completedTask = await pollProcessingStatus(response.task_id);
        if (completedTask.status === 'completed') {
          // Fetch the processed content
          const content = await contentService.getContent(response.task_id);
          setProcessedContent(content);
          setProcessingStatus('Content processed successfully!');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setProcessingStatus(`Error: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
        setProcessingStatus('An unexpected error occurred');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const pollProcessingStatus = async (taskId: string): Promise<TaskResponse> => {
    const maxAttempts = 30; // 30 seconds
    let attempts = 0;

    const poll = async (): Promise<TaskResponse> => {
      if (attempts >= maxAttempts) {
        throw new Error('Processing timed out');
      }

      const status = await contentService.getTaskStatus(taskId); // Changed from getProcessingStatus to getTaskStatus
      console.log('Poll status:', status);
      setProcessingStatus(status.message || status.status);

      if (status.status === 'completed') {
        return status;
      } else if (status.status === 'failed') {
        throw new Error(status.message || 'Processing failed');
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return poll();
    };

    return poll();
  };

  return {
    submitUrl,
    isProcessing,
    error,
    taskId,
    processingStatus,
    processedContent
  };
}