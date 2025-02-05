import React, { useState } from 'react';
import { api } from '../../api/client';
import { SearchResponseDTO, CollectionType } from '../../types/search';
import './SearchContent.css';

const COLLECTIONS: { value: CollectionType; label: string }[] = [
  { value: 'all', label: 'All Collections' },
  { value: 'articles_content', label: 'Articles' },
  { value: 'youtube_content', label: 'YouTube Content' },
  { value: 'tutorial_sections', label: 'Tutorials' }
];

const SearchContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponseDTO | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    setResults(null);

    try {
      if (selectedCollection === 'all') {
        // For multi-collection search
        const collections = ['articles_content', 'youtube_content', 'tutorial_sections'];
        const params = {
          query: searchQuery,
          collections: collections.join(','),
          limit_per_collection: '3'
        };
        
        const searchResults = await api.get<SearchResponseDTO>('search/multi', params);
        setResults(searchResults);
      } else {
        // For single collection search
        const params = {
          query: searchQuery,
          collection: selectedCollection,
          limit: 10
        };
        
        const searchResults = await api.get<SearchResponseDTO>('search/single', {
          ...params,
          limit: params.limit.toString()
        });
        
        setResults(searchResults);
      }
    } catch (err) {
      setError('There was an error processing this request');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container">
      <h1>Search Content</h1>
      <p className="description">
        Search through your processed articles, videos, and tutorials
      </p>

      <form onSubmit={handleSearch} className="input-form">
        <textarea
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter your search query..."
          className="search-input"
          required
        />
        
        <div className="collection-select">
          <label htmlFor="collection">Collection:</label>
          <select
            id="collection"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value as CollectionType)}
            className="collection-dropdown"
          >
            {COLLECTIONS.map(collection => (
              <option key={collection.value} value={collection.value}>
                {collection.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!searchQuery.trim() || isSearching}
          className="submit-button"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {results && (
        <div className="search-results">
          {results.results.length === 0 ? (
            <p className="no-results">No results returned</p>
          ) : (
            results.results.map((result, index) => (
              <div key={result.id || index} className="result-item">
                <div className="result-header">
                  <a
                    href={result.metadata.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    {result.metadata.title || 'Untitled Content'}
                  </a>
                  <span className="result-type">{result.metadata.content_type}</span>
                </div>
                <p className="result-content">{result.content}</p>
                <div className="result-footer">
                  <span className="result-author">By {result.metadata.author}</span>
                  <span className="result-score">
                    Relevance: {(1 - result.relevanceScore).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchContent;