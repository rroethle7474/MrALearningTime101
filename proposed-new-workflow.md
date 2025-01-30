# Content Processing Enhancement Plan

## Current Flow
1. User submits URL
2. Content processor extracts content
3. Content is chunked and stored in ChromaDB
4. Tutorial generator uses stored chunks for tutorial generation

## Proposed Flow
1. User submits URL
2. Content processor extracts content
3. Generate initial summary using LLM
4. Content is chunked and stored in ChromaDB along with summary
5. Return summary immediately to user
6. Tutorial generator uses stored chunks for tutorial generation

## Implementation Changes Required

### 1. Update Content Metadata Model

### 2. Add Summary Generation to ContentProcessor


### 3. Update Vector Store Storage
Add this method to VectorStore:

### 4. Update Content Processing Task
Update the submit_content endpoint to include summary in response:

### 5. Update Task Status Model

## Migration Steps
1. Update data models and schemas
2. Add LLM client to ContentProcessor if not already present
3. Implement summary generation
4. Update storage logic to include summaries
5. Modify API responses to include summaries
6. Update tests to cover new functionality

## Testing Considerations
1. Test summary generation quality
2. Verify summary storage and retrieval
3. Test error handling for summary generation
4. Validate API response formats
5. Check ChromaDB storage structure



## Front End Section Changes
Here's a summary of the key changes between the old and new workflow:
Major Workflow Changes
Early Summary Generation: Summary is now generated immediately after content extraction, before chunking
Immediate User Feedback: Summary is available in task status responses while processing continues
Persistent Storage: Summary is stored with content metadata in ChromaDB

Key Type/Interface Changes
// Old
interface TaskStatus {
  task_id: string;
  status: string;
  content_id?: string;
  error?: string;
}

// New
interface TaskStatus {
  task_id: string;
  status: string;
  content_id?: string;
  error?: string;
  summary?: string  // Added field
}

Content Metadata:
// Old
interface ContentMetadata {
  title: string;
  author: string;
  source_url: string;
  content_type: 'article' | 'youtube';
  duration?: string;
  published_date?: string;
  view_count?: number;
}

// New
interface ContentMetadata {
  title: string;
  author: string;
  source_url: string;
  content_type: 'article' | 'youtube';
  duration?: string;
  published_date?: string;
  view_count?: number;
  summary?: string;         // Added field
  processed_date?: string;  // Added field
}

API Response Changes
GET /api/content/task/{task_id}:
Now includes summary field even while status is "processing"
Summary available earlier in the process
UI can show summary before full content processing completes
GET /api/content/{task_id}:
Metadata now includes summary and processed_date
All content chunks still available as before
Key Points for UI Developers
Polling Updates:
Check for summary field in task status responses
Can display summary while showing processing indicator
Status still progresses: processing → completed/failed
Error Handling:
Summary might be available even if full processing fails
New error cases for summary generation
Need to handle null/undefined summary fields
Display Considerations:
Add summary section to content display
Consider showing summary during processing state
Update content caching to include summary data
Backward Compatibility:
All old fields still present
New fields are optional
Existing content might not have summaries



## Additional Details of Update.
1. API Types/Interfaces Updates:
// types/content.ts
interface TaskStatus {
  task_id: string;
  status: string;
  content_id?: string;
  error?: string;
  summary?: string;  // New field
}

interface ContentMetadata {
  title: string;
  author: string;
  source_url: string;
  content_type: 'article' | 'youtube';
  duration?: string;
  published_date?: string;
  view_count?: number;
  summary?: string;  // New field
  processed_date?: string;
}

interface ProcessedContent {
  content_id: string;
  metadata: ContentMetadata;
  chunks: string[];
}

## API Client Updates
// services/api.ts
class ContentAPI {
  // Existing methods remain the same
  // Response types need to be updated to include summary
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    // Now includes summary in response
  }

  async getProcessedContent(taskId: string): Promise<ProcessedContent> {
    // Now includes summary in metadata
  }
}

## UI Component Changes
// components/ContentProcessingStatus.tsx
interface ProcessingStatusProps {
  taskId: string;
  onComplete?: (content: ProcessedContent) => void;
}

// Add summary display while processing
const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ taskId }) => {
  const [status, setStatus] = useState<TaskStatus>();
  
  // Show summary while still processing
  if (status?.summary) {
    return (
      <div>
        <ProcessingIndicator />
        <SummaryPreview summary={status.summary} />
      </div>
    );
  }
  // ...
};

// components/ContentView.tsx
interface ContentViewProps {
  content: ProcessedContent;
}

// Add summary section to content display
const ContentView: React.FC<ContentViewProps> = ({ content }) => {
  return (
    <div>
      <ContentHeader metadata={content.metadata} />
      {content.metadata.summary && (
        <SummarySection summary={content.metadata.summary} />
      )}
      <ContentChunks chunks={content.chunks} />
    </div>
  );
};

