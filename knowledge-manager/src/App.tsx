import { useState } from 'react'
import './App.css'
import { ProcessingStatus } from './components/ProcessingStatus'
import { ContentViewer } from './components/ContentViewer/ContentViewer'
import { ProcessedContent } from './types/content'
import { sampleContent } from './mocks/sampleContent'

type InputType = 'article' | 'youtube' | 'package-tree'

function App() {
  const [url, setUrl] = useState('')
  const [inputType, setInputType] = useState<InputType>('article')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>()
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null)

  const getPlaceholderText = () => {
    switch (inputType) {
      case 'article':
        return 'Enter article URL'
      case 'youtube':
        return 'Enter YouTube video URL'
      case 'package-tree':
        return 'Enter root URL to build knowledge tree'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setProcessedContent(null)
    
    try {
      setProcessingStatus('Validating URL...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (inputType === 'package-tree') {
        setProcessingStatus('Analyzing site structure...')
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setProcessingStatus('Building knowledge tree...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        setProcessingStatus('Extracting content...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      setProcessingStatus('Processing complete!')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate API response with sample content
      setProcessedContent(sampleContent)
      
      // Reset form
      setUrl('')
      setProcessingStatus(undefined)
    } catch (error: unknown) {
      console.error('Processing error:', error);
      setProcessingStatus('Error processing content')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container">
      <h1>Knowledge Manager</h1>
      <p className="description">
        Submit a URL to process and store articles, videos, or build knowledge trees
      </p>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-type-selector">
          <button
            type="button"
            className={`type-button ${inputType === 'article' ? 'active' : ''}`}
            onClick={() => setInputType('article')}
            disabled={isProcessing}
          >
            Article
          </button>
          <button
            type="button"
            className={`type-button ${inputType === 'youtube' ? 'active' : ''}`}
            onClick={() => setInputType('youtube')}
            disabled={isProcessing}
          >
            YouTube
          </button>
          <button
            type="button"
            className={`type-button ${inputType === 'package-tree' ? 'active' : ''}`}
            onClick={() => setInputType('package-tree')}
            disabled={isProcessing}
          >
            Package Tree
          </button>
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={getPlaceholderText()}
          required
          disabled={isProcessing}
        />

        <button 
          type="submit" 
          className="submit-button"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Process Content'}
        </button>

        <ProcessingStatus 
          isProcessing={isProcessing}
          status={processingStatus}
        />
      </form>

      {processedContent && <ContentViewer content={processedContent} />}
    </div>
  )
}

export default App
