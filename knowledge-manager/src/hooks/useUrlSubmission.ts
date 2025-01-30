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
  canGenerateTutorial: boolean;
  contentId: string | null;
  summary: string | null;
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
  const [canGenerateTutorial, setCanGenerateTutorial] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const pollTutorialStatus = async (tutorialTaskId: string): Promise<void> => {
    console.log('Starting tutorial status polling for:', tutorialTaskId);
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async (): Promise<void> => {
      console.log(`Tutorial poll attempt ${attempts + 1}/${maxAttempts}`);
      if (attempts >= maxAttempts) {
        throw new Error('Tutorial generation timed out');
      }

      const status = await tutorialService.getTutorialStatus(tutorialTaskId);
      console.log('Tutorial status response:', status);
      setProcessingStatus(`Generating tutorial: ${status.status}`);

      if (status.status === 'completed' && status.tutorial) {
        console.log('Tutorial generation completed:', status.tutorial);
        const tutorialContent = tutorialService.convertToTutorialContent(status.tutorial);
        setTutorialContent(tutorialContent);
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

  const pollProcessingStatus = async (contentTaskId: string): Promise<TaskResponse> => {
    console.log('Starting content processing polling for:', contentTaskId);
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async (): Promise<TaskResponse> => {
      console.log(`Content poll attempt ${attempts + 1}/${maxAttempts}`);
      if (attempts >= maxAttempts) {
        throw new Error('Processing timed out');
      }

      const status = await contentService.getTaskStatus(contentTaskId);
      console.log('Content status response:', {
        status: status.status,
        content_id: status.content_id,
        summary: status.summary,
        full_response: status
      });

      if (status.summary) {
        setSummary(status.summary);
      }

      if (status.status === 'completed') {
        console.log('Content processing completed');
        if (status.content_id) {
          console.log('✅ Content ID found in status:', status.content_id);
          setContentId(status.content_id);
        } else {
          console.warn('⚠️ No content_id in completed status response');
        }
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

  const generateTutorial = async () => {
    console.log('Starting tutorial generation with:', {
      hasProcessedContent: !!processedContent,
      contentId,
      contentType: processedContent?.metadata.type
    });
    
    if (!processedContent || !contentId) {
      console.warn('⚠️ Missing required data for tutorial generation:', {
        hasProcessedContent: !!processedContent,
        contentId
      });
      return;
    }
    console.log('Generating tutorial 3');
    const type = processedContent.metadata.type;
    if (type !== 'article' && type !== 'youtube') return;
    console.log('Generating tutorial 4');
    setIsTutorialProcessing(true);
    setTutorialError(null);
    setCanGenerateTutorial(false);
    
    try {
      console.log(`Generating tutorial for content ID: ${contentId}, type: ${type}`);
      const response = await tutorialService.generateTutorial(contentId, type);
      await pollTutorialStatus(response.task_id);
    } catch (err) {
      console.error('Tutorial generation error:', err);
      if (err instanceof Error) {
        setTutorialError(err.message);
      } else {
        setTutorialError('An unexpected error occurred during tutorial generation');
      }
      setCanGenerateTutorial(true);
    } finally {
      setIsTutorialProcessing(false);
    }
  };

  const submitUrl = async (url: string, type: 'article' | 'youtube') => {
    console.log('Starting URL submission for:', url, type);
    setIsProcessing(true);
    setError(null);
    setTaskId(null);
    setProcessedContent(null);
    setTutorialContent(null);
    setTutorialError(null);
    setCanGenerateTutorial(false);
    
    try {
      const submission: URLSubmissionRequest = { url, content_type: type };
      console.log('Submitting content:', submission);
      const response = await contentService.submitContent(submission);
      console.log('Submit content response:', response);
      setTaskId(response.task_id);
      
      const completedTask = await pollProcessingStatus(response.task_id);
      console.log('Completed task response:', completedTask);
      
      if (completedTask.status === 'completed') {
        console.log('Content processing completed, fetching content');
        const content = await contentService.getContent(response.task_id);
        console.log('Fetched content:', {
          content_id: content.metadata.id,
          metadata: content.metadata,
        });
        
        const newContentId = completedTask.content_id || content.metadata.id;
        console.log('Final content ID determination:', {
          from_task: completedTask.content_id,
          from_content: content.metadata.id,
          final_id: newContentId
        });
        
        if (newContentId) {
          console.log('✅ Setting content ID:', newContentId);
          setContentId(newContentId);
          setProcessedContent(content);
          
          console.log('Starting tutorial generation with known values');
          try {
            await generateTutorialWithId(content, newContentId);
          } catch (tutorialErr) {
            console.error('Tutorial generation failed:', tutorialErr);
            setTutorialError(tutorialErr instanceof Error ? tutorialErr.message : 'Tutorial generation failed');
            setCanGenerateTutorial(true);
          }
        } else {
          console.warn('⚠️ No content ID found in either response');
        }
      }
    } catch (err) {
      console.error('URL submission failed:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTutorialWithId = async (content: ProcessedContent, contentId: string) => {
    console.log('Generating tutorial with specific content and ID:', {
      contentId,
      contentType: content.metadata.type
    });
    
    const type = content.metadata.type;
    if (type !== 'article' && type !== 'youtube') return;

    setIsTutorialProcessing(true);
    setTutorialError(null);
    setCanGenerateTutorial(false);
    
    try {
      console.log(`Generating tutorial for content ID: ${contentId}, type: ${type}`);
      const response = await tutorialService.generateTutorial(contentId, type);
      await pollTutorialStatus(response.task_id);
    } catch (err) {
      console.error('Tutorial generation error:', err);
      if (err instanceof Error) {
        setTutorialError(err.message);
      } else {
        setTutorialError('An unexpected error occurred during tutorial generation');
      }
      setCanGenerateTutorial(true);
    } finally {
      setIsTutorialProcessing(false);
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
    canGenerateTutorial,
    contentId,
    summary,
  };
}