import React from 'react';
import { ContentDetailResponse } from '../../types/content-detail';
import './ContentDetailModal.css';

interface ContentDetailModalProps {
  content: ContentDetailResponse | null;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  content,
  onClose,
  isLoading,
  error
}) => {
  if (!content && !isLoading && !error) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {isLoading ? (
          <div className="modal-loading">Loading content...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : content && (
          <div className="modal-body">
            <div className="modal-header">
              <h2>{content.title}</h2>
              <div className="content-metadata">
                <span>By {content.author}</span>
                {content.published_date && (
                  <span>Published: {new Date(content.published_date).toLocaleDateString()}</span>
                )}
                <span>Type: {content.content_type === 'youtube' ? 'YouTube' : 'Article'}</span>
                {content.metadata.duration && (
                  <span>Duration: {content.metadata.duration}</span>
                )}
              </div>
              {content.summary && (
                <div className="content-summary">
                  <h3>Summary</h3>
                  <p>{content.summary}</p>
                </div>
              )}
              {content.tutorial_id && (
                <div className="tutorial-link">
                  <span>Has associated tutorial</span>
                </div>
              )}
              <a 
                href={content.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                View Source
              </a>
            </div>

            <div className="content-chunks">
              <h3>Content</h3>
              {content.content_chunks.map((chunk, index) => (
                <div key={index} className="content-chunk">
                  {chunk}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;