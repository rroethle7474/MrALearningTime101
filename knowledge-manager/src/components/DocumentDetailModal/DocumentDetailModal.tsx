import React from 'react';
import { DocumentDetailResponse } from '../../types/document';
import './DocumentDetailModal.css';

interface DocumentDetailModalProps {
  document: DocumentDetailResponse | null;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  isLoading,
  error
}) => {
  if (!document && !isLoading && !error) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {isLoading ? (
          <div className="modal-loading">Loading document...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : document && (
          <div className="modal-body">
            <div className="modal-header">
              <h2>{document.title}</h2>
              <div className="document-metadata">
                <span>Type: {document.file_type.toUpperCase()}</span>
                <span>Created: {new Date(document.created_date).toLocaleDateString()}</span>
                {document.tags && document.tags.length > 0 && (
                  <span>Tags: {document.tags.join(', ')}</span>
                )}
              </div>
            </div>

            <div className="document-content">
              <h3>Content</h3>
              {document.content.map((chunk, index) => (
                <div key={index} className="document-chunk">
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

export default DocumentDetailModal; 