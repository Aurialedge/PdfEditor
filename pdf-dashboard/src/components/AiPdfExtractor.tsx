import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiLoader, FiAlertCircle, FiSave } from 'react-icons/fi';
import useAiExtraction from '../hooks/useAiExtraction';
import { createExtractedData } from '../services/api';
import './AiPdfExtractor.css';

const AiPdfExtractor: React.FC = () => {
  const [customPrompt, setCustomPrompt] = useState('');
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { 
    extractFromPdf, 
    isLoading, 
    error, 
    result, 
    reset 
  } = useAiExtraction({
    onSuccess: (data) => {
      console.log('AI Extraction successful:', data);
    },
    onError: (err) => {
      console.error('AI Extraction error:', err);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      extractFromPdf(file, customPrompt || undefined);
    }
  }, [extractFromPdf, customPrompt]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const handleReset = () => {
    reset();
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!result) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const response = await createExtractedData({
        title: result.processedData?.title || 'Untitled Document',
        summary: result.processedData?.summary || '',
        keyPoints: result.processedData?.keyPoints || [],
        originalText: result.extractedText,
        author: result.processedData?.author || '',
        date: result.processedData?.date || new Date().toISOString(),
        metadata: result.metadata || {
          model: 'gemini-pro',
          timestamp: new Date().toISOString(),
          charactersProcessed: result.extractedText?.length || 0
        }
      });
      
      if (response.success) {
        navigate('/extracted-data');
      } else {
        setSaveError(response.error || 'Failed to save extracted data');
      }
    } catch (error) {
      console.error('Error saving extracted data:', error);
      setSaveError('An error occurred while saving the data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ai-pdf-extractor">
      <h2>AI-Powered PDF Extractor</h2>
      
      <div className="prompt-section">
        <label htmlFor="custom-prompt">Custom Prompt (optional):</label>
        <input
          id="custom-prompt"
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="E.g., 'Extract all dates and names from this document'"
          disabled={isLoading}
        />
      </div>

      {!result && (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <div className="loading-state">
              <FiLoader className="spinner" />
              <p>Processing PDF with AI...</p>
            </div>
          ) : (
            <div className="dropzone-content">
              <FiUpload className="upload-icon" />
              <p>{isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF here, or click to select'}</p>
              <p className="small">Supports .pdf files</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          <FiAlertCircle className="error-icon" />
          <p>{error}</p>
          <button onClick={handleReset} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {result && (
        <div className="extraction-result">
          <div className="result-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleReset}
              disabled={isSaving}
            >
              Start Over
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={isSaving}
            >
              <FiSave /> {isSaving ? 'Saving...' : 'Save Extracted Data'}
            </button>
          </div>
          {saveError && <div className="error-message">{saveError}</div>}
          <div className="result-content">
            <h3>{result.processedData?.title || 'Extracted Document'}</h3>
            {result.processedData?.summary && (
              <div className="result-section">
                <h4>Summary:</h4>
                <p>{result.processedData.summary}</p>
              </div>
            )}
            
            {result.processedData?.keyPoints?.length > 0 && (
              <div className="result-section">
                <h4>Key Points:</h4>
                <ul>
                  {result.processedData.keyPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {(result.processedData?.author || result.processedData?.date) && (
              <div className="metadata-section">
                {result.processedData.author && (
                  <div className="metadata-item">
                    <span className="metadata-label">Author:</span>
                    <span>{result.processedData.author}</span>
                  </div>
                )}
                {result.processedData.date && (
                  <div className="metadata-item">
                    <span className="metadata-label">Date:</span>
                    <span>{result.processedData.date}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="raw-data-toggle">
              <details>
                <summary>View Raw Extraction</summary>
                <pre className="raw-data">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPdfExtractor;
