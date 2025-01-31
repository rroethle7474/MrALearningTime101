export interface ContextRequest {
  query: string;
}

export interface ContextResponse {
  context: string;
  error?: string;
} 