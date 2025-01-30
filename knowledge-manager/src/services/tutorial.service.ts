import { api } from '../api/client'
import { TutorialContent } from '../types/tutorial'
import { TaskResponse } from './types'

export const tutorialService = {
  async generateTutorial(contentId: string): Promise<TaskResponse> {
    return api.post('tutorial/generate', { content_id: contentId })
  },

  async getTutorialStatus(taskId: string): Promise<TaskResponse> {
    return api.get(`tutorial/status/${taskId}`)
  },

  async getTutorialContent(tutorialId: string): Promise<TutorialContent> {
    return api.get(`tutorial/content/${tutorialId}`)
  }
} 