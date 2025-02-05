import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import { ProcessingStatus } from './components/ProcessingStatus'
import { ContentViewer } from './components/ContentViewer/ContentViewer'
import { useUrlSubmission } from './hooks/useUrlSubmission'
import SearchContent from './components/SearchContent/SearchContent';
import ExploreContent from './components/ExploreContent/ExploreContent';
import PromptContent from './components/PromptContent/PromptContent';
import ExploreTutorial from './components/ExploreTutorial/ExploreTutorial';

type InputType = 'article' | 'youtube' | 'package-tree' | 'tiktok'

function App() {
  const [url, setUrl] = useState('')
  const [inputType, setInputType] = useState<InputType>('article')
  
  const {
    submitUrl,
    isProcessing,
    error,
    processingStatus,
    processedContent,
    tutorialContent,
    tutorialError,
    isTutorialProcessing,
    canGenerateTutorial,
    generateTutorial
  } = useUrlSubmission();

  const getPlaceholderText = () => {
    switch (inputType) {
      case 'article':
        return 'Enter article URL'
      case 'youtube':
        return 'Enter YouTube video URL'
      case 'package-tree':
        return 'Enter root URL to build knowledge tree'
      case 'tiktok':
        return 'Enter TikTok video URL'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitUrl(url, inputType as 'article' | 'youtube');
      if (!error) {
        setUrl('');
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  }

  return (
    <Router>
      <div className="app">
        <nav className="navigation">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Search Content</Link>
          <Link to="/explore" className="nav-link">Explore</Link>
          <Link to="/explore-tutorial" className="nav-link">Explore Tutorial</Link>
          <Link to="/prompt" className="nav-link">Prompt</Link>
        </nav>

      <Routes>
          <Route path="/search" element={<SearchContent />} />
          <Route path="/explore" element={<ExploreContent />} />
          <Route path="/explore-tutorial" element={<ExploreTutorial />} />
          <Route path="/prompt" element={<PromptContent />} />
          <Route path="/" element={
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
                    className={`type-button ${inputType === 'tiktok' ? 'active' : ''}`}
                    onClick={() => setInputType('tiktok')}
                    disabled={isProcessing}
                  >
                    TikTok
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

              {processedContent && <ContentViewer
                content={processedContent}
                tutorial={tutorialContent}
                tutorialError={tutorialError}
                isTutorialProcessing={isTutorialProcessing}
                canGenerateTutorial={canGenerateTutorial}
                onGenerateTutorial={generateTutorial}
              />} 
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App