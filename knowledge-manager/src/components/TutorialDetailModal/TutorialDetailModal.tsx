import React from 'react';
import { TutorialResponse } from '../../types/tutorial-list';
import './TutorialDetailModal.css';

interface TutorialDetailModalProps {
  tutorial: TutorialResponse | null;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
}

const TutorialDetailModal: React.FC<TutorialDetailModalProps> = ({
  tutorial,
  onClose,
  isLoading,
  error
}) => {
  if (!tutorial && !isLoading && !error) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {isLoading ? (
          <div className="modal-loading">Loading tutorial...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : tutorial && (
          <div className="modal-body">
            <div className="tutorial-header">
              <h2>{tutorial.title}</h2>
              
              <div className="tutorial-metadata">
                <span>Source Type: {tutorial.source_type}</span>
                {tutorial.metadata.difficulty_level && (
                  <span>Difficulty: {tutorial.metadata.difficulty_level}</span>
                )}
                {tutorial.metadata.estimated_time && (
                  <span>Estimated Time: {tutorial.metadata.estimated_time}</span>
                )}
                <span>Generated: {new Date(tutorial.generated_date).toLocaleDateString()}</span>
              </div>

              {tutorial.source_url && (
                <a 
                  href={tutorial.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  View Source Content
                </a>
              )}

              {tutorial.metadata.prerequisites && tutorial.metadata.prerequisites.length > 0 && (
                <div className="prerequisites">
                  <h3>Prerequisites</h3>
                  <ul>
                    {tutorial.metadata.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="tutorial-description">{tutorial.description}</p>
            </div>

            <div className="tutorial-sections">
              {tutorial.sections.map((section) => (
                <div key={section.section_id} className="tutorial-section">
                  <h3>{section.title}</h3>
                  {section.metadata.reading_time && (
                    <span className="reading-time">
                      Reading time: {section.metadata.reading_time}
                    </span>
                  )}
                  <div className="section-content">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialDetailModal;