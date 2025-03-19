# Knowledge Manager

A web application for creating tutorials and retrieving content to help assist in a user's learning journey.

This site will allow for article url's, youtube videos, or documents to be uploaded and parsed through an LLM (stored via a Chroma db on the backend) and summarized for future retrieval.

Also, a tutorial is generated for use in future learning (recall).

This application is only run locally. To run, see the pre-requisite section.

## Overview

Knowledge Manager allows you to:

- Process and store articles from URLs
- Process and store YouTube videos
- Upload and manage documents (PDF, DOC, TXT)
- Generate tutorials from processed content
- Search through your knowledge base
- Explore content, tutorials, and documents

## Features

### Content Processing

- **Article Processing**: Submit URLs to articles to extract and store their content
- **YouTube Processing**: Submit YouTube video URLs to process and store video content
- **Document Upload**: Upload documents in various formats (.txt, .pdf, .doc, .docx)

### Content Exploration

- **Search**: Find specific content in your knowledge base
- **Explore Content**: Browse through all processed content
- **Explore Tutorials**: Access generated tutorials
- **Explore Documents**: View and manage uploaded documents
- **Prompt**: Interact with your knowledge base using prompts

## How Processing Works

The application uses asynchronous processing to handle content extraction and tutorial generation:

### URL Processing Flow

1. **URL Submission**: 
   - The application validates the URL based on the content type (article or YouTube)
   - Checks if the content already exists in the database
   - If it exists, it's deleted to allow reprocessing

2. **Content Processing**:
   - A processing task is initiated on the backend
   - The frontend polls the task status approximately every second (up to 60 attempts)
   - Processing status is displayed to the user with a progress indicator
   - When processing completes, content is retrieved and displayed

3. **Tutorial Generation**:
   - After content processing completes, a tutorial generation task starts automatically
   - The frontend polls the tutorial task status regularly
   - When the tutorial is ready, it's retrieved and displayed alongside the content
   - If tutorial generation fails, users can manually retry

### Document Processing Flow

1. **Document Submission**:
   - The document file, title, and optional tags are uploaded via FormData
   - Processing begins on the backend to extract and store document content

2. **Status Tracking**:
   - Processing status is tracked and displayed to the user
   - On successful processing, the document ID is stored for retrieval
   - Success or error messages are displayed based on the processing outcome

### Error Handling

- URL validation checks ensure YouTube links are processed correctly
- Timeouts prevent endless polling if processing takes too long
- Detailed error messages are displayed to users when issues occur
- Automatic cleanup of existing content prevents duplication

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository (https://github.com/rroethle7474/MrALearningTime101)
```bash
cd knowledge-manager
```

2. Clone the backend repository (https://github.com/rroethle7474/LearningTimeAPI-V1)
Follow the instructions to run locally via the README file in the backend repository.

3. Update the poorly named .env file setting directing the user to the backend API url: VITE_API_URL


4. Install dependencies
```bash
npm install
# or
yarn install
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. Open your browser and navigate to url.

## Usage

### Processing Articles

1. Navigate to the Home page
2. Select "Article" as the input type
3. Enter the article URL
4. Click "Process Content"

### Processing YouTube Videos

1. Navigate to the Home page
2. Select "YouTube" as the input type
3. Enter the YouTube video URL
4. Click "Process Content"

### Uploading Documents

1. Navigate to the Home page
2. Scroll down to the "Upload Document" section
3. Select a document file (.txt, .pdf, .doc, .docx)
4. Enter a title (required) and optional tags
5. Click "Upload Document"

### Exploring Content

Use the navigation links at the top of the application to:
- Search your knowledge base
- Explore all content
- Browse tutorials
- Access uploaded documents
- Use prompts to interact with your knowledge base

### PROMPT

Use the form to generate a new prompt from your original question based on all the knowledge stored from your previous uploads.

## Technologies

- React
- TypeScript
- Vite
- React Router

## License

[MIT](LICENSE)
