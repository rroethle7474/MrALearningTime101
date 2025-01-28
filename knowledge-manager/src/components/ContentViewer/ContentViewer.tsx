import { useState } from 'react'
import { ProcessedContent } from '../../types/content'
import './ContentViewer.css'
import { TutorialView } from '../TutorialView/TutorialView'
import { sampleTutorial } from '../../mocks/sampleTutorial'

interface ContentViewerProps {
  content: ProcessedContent
}

export function ContentViewer({ content }: ContentViewerProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'tutorial'>('content')
  const [activeSectionId, setActiveSectionId] = useState<string>(content.sections[0]?.id)

  return (
    <div className="content-viewer">
      <div className="content-header">
        <h2>{content.metadata.title}</h2>
        <div className="content-metadata">
          <span className="metadata-item">By {content.metadata.author}</span>
          {content.metadata.duration && (
            <span className="metadata-item">Duration: {content.metadata.duration}</span>
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
          {content.sections.map(section => (
            <button
              key={section.id}
              className={`section-link ${section.id === activeSectionId ? 'active' : ''}`}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.title}
              {section.timestamp && (
                <span className="timestamp">{section.timestamp}</span>
              )}
            </button>
          ))}
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
            <TutorialView tutorial={sampleTutorial} />
          )}
        </main>
      </div>
    </div>
  )
} 