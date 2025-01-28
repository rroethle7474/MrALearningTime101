export interface CodeExample {
  code: string
  explanation: string
  language?: string
}

export interface PracticeExercise {
  question: string
  solution: string
  hints?: string[]
}

export interface TutorialContent {
  summary: string[]
  keyPoints: string[]
  codeExamples: CodeExample[]
  practiceExercises: PracticeExercise[]
  additionalNotes?: string[]
} 