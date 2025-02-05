import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collectionService } from '../../services/collection.service';
import { ContentListItem, GridItem, ContentType } from '../../types/collection';
import { ContentDetailResponse } from '../../types/content-detail';
import ContentDetailModal from '../ContentDetailModal/ContentDetailModal';
import './ExploreContent.css';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

const ExploreContent = () => {
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedContent, setSelectedContent] = useState<ContentDetailResponse | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GridItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const PAGE_SIZE = 50;

  // Use useRef to track if initial load has happened
  const initialLoadComplete = useRef(false);

  // Remove loadMoreItems from dependencies by using useRef for state values
  const stateRef = useRef({ offset, loading, hasMore });
  
  // Update ref when state changes
  useEffect(() => {
    stateRef.current = { offset, loading, hasMore };
  }, [offset, loading, hasMore]);

  // Transform collection items to grid items
  const transformItems = (items: ContentListItem[]): GridItem[] => {
    return items.map(item => ({
      id: item.id,
      key: `${item.metadata.content_type}-${item.id}`,
      title: item.title,
      type: item.metadata.content_type,
      sourceUrl: item.metadata.source_url,
      author: item.metadata.author,
      processedDate: new Date(item.metadata.processed_date).toLocaleDateString(),
      duration: item.metadata.duration,
      summary: item.metadata.summary
    }));
  };

  const loadMoreItems = useCallback(async () => {
    const { loading, hasMore } = stateRef.current;
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getCollectionsContent(stateRef.current.offset, PAGE_SIZE);
      
      const newItems = Object.values(response.collections)
        .flatMap(collection => transformItems(collection.items));

      const totalItems = Object.values(response.collections)
        .reduce((acc, collection) => acc + collection.total, 0);
      
      setHasMore(stateRef.current.offset + PAGE_SIZE < totalItems);
      setOffset(prev => prev + PAGE_SIZE);
      setGridItems(prev => [...prev, ...newItems]);
    } catch (err) {
      setError('Error loading content');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed anymore

  // Initial load
  useEffect(() => {
    if (!initialLoadComplete.current) {
      initialLoadComplete.current = true;
      loadMoreItems();
    }
  }, []); // Empty dependency array since we're using ref

  // Intersection Observer setup
  const observer = useRef<IntersectionObserver>();

  // Add separate cleanup effect
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const lastItemRef = useCallback((node: HTMLTableRowElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreItems]);

  const handleView = async (id: string, type: ContentType) => {
    setIsModalLoading(true);
    setModalError(null);
    
    try {
      const collectionName = type === 'youtube' 
        ? 'youtube_content' 
        : type === 'tiktok'
          ? 'tiktok_content'
          : 'articles_content';
      const contentDetail = await collectionService.getContentDetail(collectionName, id);
      setSelectedContent(contentDetail);
    } catch (err) {
      setModalError('Error loading content details');
      console.error('Error:', err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedContent(null);
    setModalError(null);
  };

  const handleDelete = async (item: GridItem) => {
    setItemToDelete(item);
  };
  
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
  
    setIsDeleting(true);
    try {
      const collectionName = itemToDelete.type === 'youtube' ? 'youtube_content' : 'articles_content';
      await collectionService.deleteContent(collectionName, itemToDelete.id);
      
      // Remove item from state
      setGridItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      setItemToDelete(null);
      
    } catch (err) {
      setError('Error deleting content');
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const getTypeDisplay = (type: ContentType) => {
    switch (type) {
      case 'youtube':
        return 'YouTube';
      case 'tiktok':
        return 'TikTok';
      default:
        return 'Article';
    }
  };

  return (
    <div className="container">
      <h1>Explore Content</h1>
      <p className="description">
        Browse through your processed articles and videos
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
              <th>Author</th>
              <th>Processed Date</th>
              <th>Duration</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gridItems.length === 0 && !loading ? (
              <tr className="empty-row">
                <td colSpan={6}>No content found</td>
              </tr>
            ) : (
              gridItems.map((item, index) => (
                <tr 
                  key={item.key}
                  ref={index === gridItems.length - 1 ? lastItemRef : undefined}
                  className="grid-row"
                >
                  <td>
                    <a 
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      {item.title}
                    </a>
                  </td>
                  <td>{getTypeDisplay(item.type)}</td>
                  <td>{item.author}</td>
                  <td>{item.processedDate}</td>
                  <td>{item.duration || '-'}</td>
                  <td className="actions-column">
                  <button 
                    className="action-button view-button"
                    onClick={() => handleView(item.id, item.type)}
                    title={item.summary}
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
        <ContentDetailModal
        content={selectedContent}
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
            Loading more content...
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreContent;