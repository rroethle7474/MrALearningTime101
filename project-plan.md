# Knowledge Management System - Project Implementation Plan

## Project Overview
This document outlines the step-by-step implementation plan for building a knowledge management system that processes YouTube videos and articles, storing them for future reference and learning.

## Technology Stack
- Frontend: React with TypeScript
- Backend: FastAPI
- Cloud Provider: Microsoft Azure
- Vector Search: Azure Cognitive Search
- LLM Integration: Azure OpenAI Service via LangChain
- Container Orchestration: Azure Container Apps
- Message Queue: Azure Service Bus
- Database: Azure SQL Database

## Implementation Phases

### Phase 1: Frontend Development
**Goal**: Create a responsive React application for URL submission and content viewing

#### Prerequisites
- Azure account with appropriate subscriptions
- Node.js and npm installed
- Azure Static Web Apps CLI

#### Tasks
1. Initialize React project with Vite and TypeScript
   ```bash
   use react and typescript for template
   npm create vite@latest knowledge-manager -- --template react-ts
   cd knowledge-manager
   npm install
   ```

2. Set up key dependencies
   ```bash
   npm install @azure/identity @azure/storage-blob @microsoft/fetch-event-source
   npm install @mui/material @emotion/react @emotion/styled   # Updated Material-UI packages
   ```

3. Set up environment configuration
   Create environment files for different deployment scenarios:
   ```bash
   # Create environment files
   touch .env.development .env.test .env.production .env.example
   ```
   
   Environment files structure:
   - `.env.development` - Local development settings
   - `.env.test` - Test environment settings
   - `.env.production` - Production environment settings
   - `.env.example` - Template file showing required variables
   
   Add environment configuration utilities:
   - `src/config/env.d.ts` - TypeScript definitions for environment variables
   - `src/config/config.ts` - Configuration object with environment values
   - `src/api/client.ts` - API client using environment configuration

   Update scripts in package.json for environment-specific runs:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "dev:test": "vite --mode test",
       "build": "tsc && vite build",
       "build:test": "tsc && vite build --mode test",
       "preview": "vite preview",
       "preview:test": "vite preview --mode test"
     }
   }
   ```

4. Configure Vite for Azure deployment
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
       sourcemap: true
     },
     server: {
       port: 3000
     }
   })
   ```

3. Implement core components:
   - URL submission form
   - Processing status indicator
   - Content viewer
   - Tutorial/summary viewer

4. Create Azure Static Web App with Vite configuration
   ```bash
   # Create the static web app
   az staticwebapp create --name knowledge-manager --resource-group knowledge-manager-rg --location "East US 2"

   # Add staticwebapp.config.json in your project root
   {
     "routes": [
       {
         "route": "/assets/*",
         "headers": {
           "cache-control": "must-revalidate, max-age=31536000"
         }
       },
       {
         "route": "/*",
         "serve": "/index.html",
         "statusCode": 200
       }
     ],
     "navigationFallback": {
       "rewrite": "/index.html"
     },
     "buildProperties": {
       "outputLocation": "dist"
     }
   }
   ```

#### Development Scripts
Add these scripts to your package.json:
```json
{
  "scripts": {
    "dev": "vite",
    "dev:test": "vite --mode test",
    "build": "tsc && vite build",
    "build:test": "tsc && vite build --mode test",
    "preview": "vite preview",
    "preview:test": "vite preview --mode test",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

#### Expected Deliverables
- Functional React application
- Azure Static Web App deployment
- Basic UI/UX implementation

### Phase 2: Backend API Development
**Goal**: Implement FastAPI backend with Azure Functions integration

#### Prerequisites
- Python 3.9+
- Azure Functions Core Tools
- Azure CLI

#### Tasks
1. Initialize FastAPI project
   ```bash
   mkdir knowledge-manager-api
   cd knowledge-manager-api
   python -m venv venv
   pip install fastapi azure-functions azure-storage-blob langchain
   ```

2. Set up core API endpoints:
   - URL submission
   - Content processing status
   - Search functionality
   - Summary retrieval

3. Create Azure Function App
   ```bash
   az functionapp create --name knowledge-manager-api --resource-group knowledge-manager-rg --runtime python
   ```

4. Implement Azure OpenAI Service integration
   ```bash
   az cognitiveservices account create --name knowledge-manager-ai --resource-group knowledge-manager-rg --kind OpenAI
   ```

#### Expected Deliverables
- FastAPI application with Azure Functions
- API documentation (Swagger/OpenAPI)
- Integration tests
- Deployment scripts

### Phase 3: Content Processing Pipeline
**Goal**: Implement robust content extraction and processing system

#### Prerequisites
- Azure Container Registry access
- Docker installed locally
- Azure Container Apps environment

#### Tasks
1. Create content extraction services:
   - YouTube transcript extractor
   - Web content scraper (with Playwright)
   - Dynamic content handler

2. Set up Azure Container Apps
   ```bash
   az containerapp create --name content-processor --resource-group knowledge-manager-rg --environment content-env
   ```

3. Implement processing pipeline:
   - Content type detection
   - Text extraction
   - Chunking and preprocessing
   - Embedding generation
   - Summary creation

4. Configure Azure Service Bus
   ```bash
   az servicebus namespace create --name knowledge-manager-bus --resource-group knowledge-manager-rg
   ```

#### Expected Deliverables
- Containerized processing services
- Message queue implementation
- Processing status tracking
- Error handling and retry logic

### Phase 4: Vector Search Implementation
**Goal**: Set up Azure Cognitive Search with vector capabilities

#### Prerequisites
- Azure Cognitive Search service
- Azure SQL Database

#### Tasks
1. Create Azure Cognitive Search service
   ```bash
   az search service create --name knowledge-manager-search --resource-group knowledge-manager-rg --sku Standard
   ```

2. Set up Azure SQL Database
   ```bash
   az sql db create --name knowledge-manager-db --resource-group knowledge-manager-rg --server knowledge-manager-sql
   ```

3. Implement search functionality:
   - Vector indexing
   - Metadata storage
   - Search API integration
   - Results ranking

#### Expected Deliverables
- Vector search implementation
- Database schema
- Search API documentation
- Performance metrics

### Phase 5: Integration and Testing
**Goal**: Ensure all components work together seamlessly

#### Tasks
1. End-to-end integration testing
2. Performance optimization
3. Security implementation
4. Monitoring setup

#### Expected Deliverables
- Integration test suite
- Performance test results
- Security audit report
- Monitoring dashboards

## Getting Started

For each phase, you'll need:

1. Azure Subscription ID
2. Resource Group creation:
   ```bash
   az group create --name knowledge-manager-rg --location eastus2
   ```

3. Service Principal for deployments:
   ```bash
   az ad sp create-for-rbac --name knowledge-manager-sp --role contributor
   ```

4. Environment Variables:
   ```bash
   AZURE_SUBSCRIPTION_ID=<your-subscription-id>
   AZURE_TENANT_ID=<your-tenant-id>
   AZURE_CLIENT_ID=<your-client-id>
   AZURE_CLIENT_SECRET=<your-client-secret>
   ```

## Support Information

- Azure Documentation: https://docs.microsoft.com/azure
- FastAPI Documentation: https://fastapi.tiangolo.com/
- React Documentation: https://reactjs.org/docs
- LangChain Documentation: https://python.langchain.com/docs

## Next Steps
To begin implementation, start with Phase 1: Frontend Development. Each phase builds upon the previous one, so completing them in order is recommended.

Need help with a specific phase? Let me know and I can provide more detailed information and guidance for that particular phase.