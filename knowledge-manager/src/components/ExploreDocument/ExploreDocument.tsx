import React, { useState, useEffect, useRef } from 'react';
import { collectionService } from '../../services/collection.service';
import { DocumentListItem, DocumentGridItem, DocumentDetailResponse, FileType } from '../../types/document';
import DocumentDetailModal from '../DocumentDetailModal/DocumentDetailModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './ExploreDocument.css';

const ExploreDocument = () => {
  const [gridItems, setGridItems] = useState<DocumentGridItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetailResponse | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DocumentGridItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const PAGE_SIZE = 50;

  const initialLoadComplete = useRef(false);
  const stateRef = useRef({ offset, loading, hasMore });
  
  useEffect(() => {
    stateRef.current = { offset, loading, hasMore };
  }, [offset, loading, hasMore]);

  const transformItems = (items: DocumentListItem[]): DocumentGridItem[] => {
    return items.map(item => ({
      id: item.id,
      key: `${item.file_type}-${item.id}`,
      title: item.title,
      fileType: item.file_type,
      tags: item.tags,
      createdDate: new Date(item.created_date).toLocaleDateString()
    }));
  };

  const loadMoreItems = async () => {
    const { loading, hasMore } = stateRef.current;
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getDocumentsContent(stateRef.current.offset, PAGE_SIZE);
      
      const newItems = Object.values(response.collections)
        .flatMap(collection => transformItems(collection.items));

      const totalItems = Object.values(response.collections)
        .reduce((acc, collection) => acc + collection.total, 0);
      
      setHasMore(stateRef.current.offset + PAGE_SIZE < totalItems);
      setOffset(prev => prev + PAGE_SIZE);
      setGridItems(prev => [...prev, ...newItems]);
    } catch (err) {
      setError('Error loading documents');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!initialLoadComplete.current) {
      initialLoadComplete.current = true;
      loadMoreItems();
    }
  }, []);

  // Intersection Observer setup
  const observer = useRef<IntersectionObserver>();
  const lastItemRef = useRef((node: HTMLTableRowElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });

    if (node) observer.current.observe(node);
  });

  const handleView = async (id: string) => {
    setIsModalLoading(true);
    setModalError(null);
    
    try {
      const documentDetail = await collectionService.getDocumentDetail('notes', id);
      setSelectedDocument(documentDetail);
    } catch (err) {
      setModalError('Error loading document details');
      console.error('Error:', err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
    setModalError(null);
  };

  const handleDelete = (item: DocumentGridItem) => {
    setItemToDelete(item);
  };
  
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
  
    setIsDeleting(true);
    try {
      await collectionService.deleteDocument('notes', itemToDelete.id);
      setGridItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      setError('Error deleting document');
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const getTypeDisplay = (type: FileType) => {
    return type.toUpperCase();
  };

  return (
    <div className="container">
      <h1>Explore Documents</h1>
      <p className="description">
        Browse through your processed uploaded documents
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="grid-container">
        <table className="content-grid">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Tags</th>
              <th>Created Date</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gridItems.length === 0 && !loading ? (
              <tr className="empty-row">
                <td colSpan={5}>No documents found</td>
              </tr>
            ) : (
              gridItems.map((item, index) => (
                <tr 
                  key={item.key}
                  ref={index === gridItems.length - 1 ? lastItemRef.current : undefined}
                  className="grid-row"
                >
                  <td>{item.title}</td>
                  <td>{getTypeDisplay(item.fileType)}</td>
                  <td>{item.tags?.join(', ') || '-'}</td>
                  <td>{item.createdDate}</td>
                  <td className="actions-column">
                    <button 
                      className="action-button view-button"
                      onClick={() => handleView(item.id)}
                    >
                      View
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <DocumentDetailModal
          document={selectedDocument}
          onClose={handleCloseModal}
          isLoading={isModalLoading}
          error={modalError}
        />
        
        <DeleteConfirmationModal
          isOpen={!!itemToDelete}
          itemName={itemToDelete?.title || ''}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
        
        {loading && (
          <div className="loading-indicator">
            Loading more documents...
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreDocument;