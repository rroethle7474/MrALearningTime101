import React, { useState, useEffect, useCallback } from 'react';
import { tutorialService } from '../../services/tutorial.service';
import { TutorialListItem, TutorialResponse } from '../../types/tutorial-list';
import TutorialDetailModal from '../TutorialDetailModal/TutorialDetailModal';
import './ExploreTutorial.css';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

const ExploreTutorial = () => {
  const [tutorials, setTutorials] = useState<TutorialListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialResponse | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [tutorialToDelete, setTutorialToDelete] = useState<TutorialListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const PAGE_SIZE = 50;

  const loadMoreTutorials = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await tutorialService.getTutorialsList(offset, PAGE_SIZE);
      setHasMore(response.total > offset + PAGE_SIZE);
      setOffset(prev => prev + PAGE_SIZE);
      setTutorials(prev => [...prev, ...response.items]);
    } catch (err) {
      setError('Error loading tutorials');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore]);

  useEffect(() => {
    loadMoreTutorials();
  }, []);

  // Intersection Observer for infinite scroll
  const observer = React.useRef<IntersectionObserver>();
  const lastTutorialRef = useCallback((node: HTMLTableRowElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreTutorials();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreTutorials]);

  const handleView = async (tutorialId: string) => {
    setIsModalLoading(true);
    setModalError(null);
    
    try {
      const tutorialDetail = await tutorialService.getTutorialDetail(tutorialId);
      setSelectedTutorial(tutorialDetail);
    } catch (err) {
      setModalError('Error loading tutorial details');
      console.error('Error:', err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTutorial(null);
    setModalError(null);
  };
  const handleDelete = async (tutorial: TutorialListItem) => {
    setTutorialToDelete(tutorial);
  };
  
  const handleConfirmDelete = async () => {
    if (!tutorialToDelete) return;
  
    setIsDeleting(true);
    try {
      await collectionService.deleteContent('tutorials', tutorialToDelete.id);
      
      // Remove tutorial from state
      setTutorials(prevTutorials => 
        prevTutorials.filter(tutorial => tutorial.id !== tutorialToDelete.id)
      );
      setTutorialToDelete(null);
      
    } catch (err) {
      setError('Error deleting tutorial');
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleCancelDelete = () => {
    setTutorialToDelete(null);
  };

  return (
    <div className="container">
      <h1>Explore Tutorials</h1>
      <p className="description">
        Browse through generated tutorials from your content
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="grid-container">
        <table className="tutorial-grid">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Source Type</th>
              <th>Sections</th>
              <th>Difficulty</th>
              <th>Generated Date</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.length === 0 && !loading ? (
              <tr className="empty-row">
                <td colSpan={7}>No tutorials found</td>
              </tr>
            ) : (
              tutorials.map((tutorial, index) => (
                <tr 
                  key={tutorial.id}
                  ref={index === tutorials.length - 1 ? lastTutorialRef : undefined}
                  className="grid-row"
                >
                  <td>{tutorial.title}</td>
                  <td className="description-cell">{tutorial.description}</td>
                  <td>{tutorial.source_type}</td>
                  <td>{tutorial.section_count} sections</td>
                  <td>{tutorial.metadata.difficulty_level || 'N/A'}</td>
                  <td>{new Date(tutorial.generated_date).toLocaleDateString()}</td>
                  <td className="actions-column">
                    <button 
                      className="action-button view-button"
                      onClick={() => handleView(tutorial.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {loading && (
          <div className="loading-indicator">
            Loading more tutorials...
          </div>
        )}
      </div>

      <TutorialDetailModal
        tutorial={selectedTutorial}
        onClose={handleCloseModal}
        isLoading={isModalLoading}
        error={modalError}
      />
      <DeleteConfirmationModal
        isOpen={!!tutorialToDelete}
        itemName={tutorialToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
        />
    </div>
  );
};

export default ExploreTutorial;