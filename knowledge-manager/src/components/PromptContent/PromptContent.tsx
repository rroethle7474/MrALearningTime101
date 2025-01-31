import React, { useState } from 'react';
import { api } from '../../api/client';
import './PromptContent.css';

const PromptContent = () => {
  const [promptQuery, setPromptQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedPrompt(null);

    try {
      const response = await api.post<{ prompt: string }>('prompt/generate', {
        query: promptQuery
      });
      
      setGeneratedPrompt(response.prompt);
    } catch (err) {
      setError('There was an error generating the prompt');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <h1>Generate Prompt</h1>
      <p className="description">
        Generate context-aware prompts based on your knowledge base
      </p>

      <form onSubmit={handleGenerate} className="input-form">
        <textarea
          value={promptQuery}
          onChange={(e) => setPromptQuery(e.target.value)}
          placeholder="Enter your query to generate a context-aware prompt..."
          className="prompt-input"
          required
        />
        <button
          type="submit"
          disabled={!promptQuery.trim() || isGenerating}
          className="submit-button"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {generatedPrompt && (
        <div className="prompt-result">
          <h2>Generated Prompt</h2>
          <div className="prompt-text">
            {generatedPrompt}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(generatedPrompt)}
            className="copy-button"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptContent;