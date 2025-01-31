import React, { useState, useCallback } from 'react';
import { api } from '../../api/client';
import { ContextResponse } from '../../types/prompt';
import './PromptContent.css';

const MAX_QUERY_LENGTH = 1000; // Reasonable limit for query length

const PromptContent = () => {
  const [promptQuery, setPromptQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContext, setGeneratedContext] = useState<string | null>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_QUERY_LENGTH) {
      setPromptQuery(newValue);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedContext(null);

    try {
      const response = await api.post<ContextResponse>('prompt/generate', {
        query: promptQuery
      });
      
      setGeneratedContext(response.context);
    } catch (err) {
      setError('Failed to generate context. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (generatedContext) {
      navigator.clipboard.writeText(generatedContext);
    }
  }, [generatedContext]);

  const characterCount = promptQuery.length;
  const isOverLimit = characterCount > MAX_QUERY_LENGTH;

  return (
    <div className="container">
      <h1>Generate Context</h1>
      <p className="description">
        Generate context-aware prompts based on your knowledge base
      </p>

      <div className="tips-section">
        <h3>Tips for effective queries:</h3>
        <ul>
          <li>Be specific about what you want to learn</li>
          <li>Include relevant keywords</li>
          <li>Mention specific topics or concepts</li>
        </ul>
      </div>

      <form onSubmit={handleGenerate} className="input-form">
        <div className="textarea-container">
          <textarea
            value={promptQuery}
            onChange={handleQueryChange}
            placeholder="What would you like to know more about? Be specific to get better context..."
            className="prompt-input"
            required
          />
          <div className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
            {characterCount}/{MAX_QUERY_LENGTH}
          </div>
        </div>

        <button
          type="submit"
          disabled={!promptQuery.trim() || isGenerating || isOverLimit}
          className="submit-button"
        >
          {isGenerating ? 'Generating Context...' : 'Generate Context'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={handleGenerate}
            className="retry-button"
            disabled={isGenerating}
          >
            Retry
          </button>
        </div>
      )}

      {generatedContext && (
        <div className="prompt-result">
          <h2>Generated Context</h2>
          <div className="prompt-text">
            {generatedContext}
          </div>
          <div className="button-group">
            <button
              onClick={handleCopy}
              className="copy-button"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setGeneratedContext(null)}
              className="clear-button"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptContent;