import { api } from '../api/client'
import { ProcessedTutorial, TutorialContent } from '../types/tutorial'
import { TaskResponse } from './types'
import { TutorialListResponse, TutorialResponse } from '../types/tutorial-list'

interface TutorialGenerationRequest {
  content_id: string;
  content_type: 'article' | 'youtube';
}

export const tutorialService = {
  async generateTutorial(contentId: string, contentType: 'article' | 'youtube'): Promise<TaskResponse> {
    const request: TutorialGenerationRequest = {
      content_id: contentId,
      content_type: contentType
    };
    return api.post('tutorial/generate', request);
  },

  async getTutorialStatus(taskId: string): Promise<TaskResponse> {
    return api.get(`tutorial/status/${taskId}`);
  },

  async getTutorialContent(tutorialId: string): Promise<ProcessedTutorial> {
    return api.get(`tutorial/content/${tutorialId}`);
  },

  // Helper method to convert ProcessedTutorial to TutorialContent
  convertToTutorialContent(tutorial: ProcessedTutorial): TutorialContent {
    const summary: string[] = [];
    const keyPoints: string[] = [];
    const codeExamples: { code: string; explanation: string; language?: string }[] = [];
    const practiceExercises: { question: string; solution: string; hints?: string[] }[] = [];
    const additionalNotes: string[] = [];

    // Process each section based on its type
    tutorial.sections.forEach(section => {
      switch (section.type) {
        case 'summary':
          summary.push(section.content);
          break;
        case 'key_points':
          // Split content by newlines or bullet points if needed
          keyPoints.push(section.content);
          break;
        case 'code_example':
          codeExamples.push({
            code: section.content,
            explanation: section.title,
            language: section.metadata?.language
          });
          break;
        case 'practice':
          practiceExercises.push({
            question: section.title,
            solution: section.content,
            hints: section.metadata?.hints as string[] | undefined
          });
          break;
        case 'notes':
          additionalNotes.push(section.content);
          break;
      }
    });

    return {
      summary,
      keyPoints,
      codeExamples,
      practiceExercises,
      additionalNotes: additionalNotes.length > 0 ? additionalNotes : undefined
    };
  },

  async getTutorialsList(offset: number = 0, limit: number = 50): Promise<TutorialListResponse> {
    return api.get<TutorialListResponse>('tutorials', {
      offset: offset.toString(),
      limit: limit.toString()
    });
  },

  async getTutorialDetail(tutorialId: string): Promise<TutorialResponse> {
    return api.get<TutorialResponse>(`tutorials/${tutorialId}`);
  }
} 