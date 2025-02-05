import { useState, useEffect } from 'react'
import { ProcessedContent } from '../../types/content'
import { TutorialContent } from '../../types/tutorial'
import './ContentViewer.css'
import { TutorialView } from '../TutorialView/TutorialView'

interface ContentViewerProps {
  content: ProcessedContent;
  tutorial: TutorialContent | null;
  tutorialError: string | null;
  isTutorialProcessing: boolean;
  canGenerateTutorial: boolean;
  onGenerateTutorial: () => void;
}

// Add this constant for tutorial sections
const TUTORIAL_SECTIONS = [
  { id: 'summary', title: 'Summary' },
  { id: 'key-points', title: 'Key Points' },
  { id: 'code-examples', title: 'Code Examples' },
  { id: 'practice-examples', title: 'Practice Examples' },
  { id: 'additional-notes', title: 'Additional Notes' }
];

export function ContentViewer({ 
  content, 
  tutorial,
  tutorialError,
  isTutorialProcessing,
  canGenerateTutorial,
  onGenerateTutorial 
}: ContentViewerProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'tutorial'>('content')
  const [activeSectionId, setActiveSectionId] = useState<string>(content.sections[0]?.id)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Reset active section when switching tabs
  useEffect(() => {
    if (activeTab === 'content') {
      setActiveSectionId(content.sections[0]?.id)
    } else {
      setActiveSectionId(TUTORIAL_SECTIONS[0].id)
    }
  }, [activeTab, content.sections])

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="content-viewer">
      <div className="content-header">
        <h2>{content.metadata.title}</h2>
        <div className="content-metadata">
          <span className="metadata-item">By {content.metadata.author}</span>
          {content.metadata.type === 'youtube' && content.metadata.duration && (
            <span className="metadata-item">Duration: {content.metadata.duration}</span>
          )}
          {content.metadata.processedDate && (
            <span className="metadata-item">
              Processed: {new Date(content.metadata.processedDate).toLocaleDateString()}
            </span>
          )}
          <a 
            href={content.metadata.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="source-link"
          >
            View Source
          </a>
        </div>
        
        {content.metadata.summary && (
          <div className="content-summary">
            <h3>Summary</h3>
            <p>{content.metadata.summary}</p>
          </div>
        )}
      </div>

      <div className="content-tabs">
        <button
          className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`tab-button ${activeTab === 'tutorial' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutorial')}
        >
          Tutorial
        </button>
      </div>

      <div className="content-layout">
        <nav className="content-sidebar">
          {activeTab === 'content' ? (
            // Content sections
            content.sections.map(section => (
              <button
                key={section.id}
                className={`section-link ${section.id === activeSectionId ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
                {section.timestamp && (
                  <span className="timestamp">{section.timestamp}</span>
                )}
              </button>
            ))
          ) : (
            // Tutorial sections
            TUTORIAL_SECTIONS.map(section => (
              <button
                key={section.id}
                className={`section-link ${section.id === activeSectionId ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </button>
            ))
          )}
        </nav>

        <main className="content-main">
          {activeTab === 'content' ? (
            <div className="content-sections">
              {content.sections.map(section => (
                <section
                  key={section.id}
                  id={section.id}
                  className={`content-section ${section.id === activeSectionId ? 'active' : ''}`}
                >
                  <h3>{section.title}</h3>
                  <div className="section-content">
                    {section.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="tutorial-container">
              {isTutorialProcessing ? (
                <div className="tutorial-status">
                  <span>Generating tutorial...</span>
                </div>
              ) : tutorialError ? (
                <div className="tutorial-error">
                  <p>{tutorialError}</p>
                  {canGenerateTutorial && (
                    <button 
                      onClick={onGenerateTutorial}
                      className="retry-button"
                    >
                      Retry Tutorial Generation
                    </button>
                  )}
                </div>
              ) : tutorial ? (
                <TutorialView tutorial={tutorial} />
              ) : (
                <div className="tutorial-empty">
                  <p>No tutorial available for this content.</p>
                  {canGenerateTutorial && (
                    <button 
                      onClick={onGenerateTutorial}
                      className="generate-button"
                    >
                      Generate Tutorial
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showBackToTop && (
        <button 
          className="back-to-top-button"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  )
} 