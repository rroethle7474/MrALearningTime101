import { useState } from 'react';
import { TaskResponse, URLSubmissionRequest } from '../services/types';
import { ProcessedContent } from '../types/content';
import { TutorialContent } from '../types/tutorial';
import { contentService } from '../services/content.service';
import { tutorialService } from '../services/tutorial.service';

interface UseUrlSubmissionResult {
  submitUrl: (url: string, type: 'article' | 'youtube') => Promise<void>;
  generateTutorial: () => Promise<void>;
  isProcessing: boolean;
  isTutorialProcessing: boolean;
  error: string | null;
  tutorialError: string | null;
  taskId: string | null;
  processingStatus: string | undefined;
  processedContent: ProcessedContent | null;
  tutorialContent: TutorialContent | null;
}

export function useUrlSubmission(): UseUrlSubmissionResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTutorialProcessing, setIsTutorialProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tutorialError, setTutorialError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>();
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);
  const [tutorialContent, setTutorialContent] = useState<TutorialContent | null>(null);

  const pollTutorialStatus = async (tutorialTaskId: string): Promise<void> => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        throw new Error('Tutorial generation timed out');
      }

      const status = await tutorialService.getTutorialStatus(tutorialTaskId);
      setProcessingStatus(`Generating tutorial: ${status.status}`);

      if (status.status === 'completed' && status.tutorial) {
        setTutorialContent(status.tutorial);
        return;
      } else if (status.status === 'failed') {
        throw new Error(status.message || 'Tutorial generation failed');
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return poll();
    };

    return poll();
  };

  const generateTutorial = async () => {
    if (!processedContent || !taskId) return;

    setIsTutorialProcessing(true);
    setTutorialError(null);
    
    try {
      const response = await tutorialService.generateTutorial(taskId);
      await pollTutorialStatus(response.task_id);
    } catch (err) {
      if (err instanceof Error) {
        setTutorialError(err.message);
      } else {
        setTutorialError('An unexpected error occurred during tutorial generation');
      }
    } finally {
      setIsTutorialProcessing(false);
    }
  };

  const pollProcessingStatus = async (contentTaskId: string): Promise<TaskResponse> => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async (): Promise<TaskResponse> => {
      if (attempts >= maxAttempts) {
        throw new Error('Processing timed out');
      }

      const status = await contentService.getTaskStatus(contentTaskId);
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

  const submitUrl = async (url: string, type: 'article' | 'youtube') => {
    setIsProcessing(true);
    setError(null);
    setTaskId(null);
    setProcessedContent(null);
    setTutorialContent(null);
    setTutorialError(null);
    
    try {
      // Validate URL and submit content
      const submission: URLSubmissionRequest = { url, content_type: type };
      const response = await contentService.submitContent(submission);
      setTaskId(response.task_id);
      
      // Poll for content processing
      const completedTask = await pollProcessingStatus(response.task_id);
      if (completedTask.status === 'completed') {
        const content = await contentService.getContent(response.task_id);
        setProcessedContent(content);
        
        // Automatically attempt to generate tutorial
        try {
          await generateTutorial();
        } catch (tutorialErr) {
          // If tutorial generation fails, we still have the content
          console.error('Tutorial generation failed:', tutorialErr);
          setTutorialError(tutorialErr instanceof Error ? tutorialErr.message : 'Tutorial generation failed');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    submitUrl,
    generateTutorial,
    isProcessing,
    isTutorialProcessing,
    error,
    tutorialError,
    taskId,
    processingStatus,
    processedContent,
    tutorialContent,
  };
}