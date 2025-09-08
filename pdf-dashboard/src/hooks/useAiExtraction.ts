import { useState, useCallback } from 'react';
import { extractTextFromPdf, processExtractedText } from '../services/aiExtraction';
import type { ExtractionResult } from '../services/aiExtraction';

interface UseAiExtractionProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useAiExtraction = ({ onSuccess, onError }: UseAiExtractionProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const extractFromPdf = useCallback(async (file: File, prompt?: string) => {
    if (!file) {
      const errorMsg = 'No file provided';
      setError(errorMsg);
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // First extract text from PDF
      const extraction = await extractTextFromPdf(file, prompt);
      
      if (!extraction.success) {
        throw new Error(extraction.error || 'Failed to extract text from PDF');
      }

      // Then process the extracted text
      const processed = await processExtractedText(
        extraction.data.extractedText,
        {
          type: 'object',
          properties: {
            title: { type: 'string' },
            summary: { type: 'string' },
            keyPoints: { type: 'array', items: { type: 'string' } },
            date: { type: 'string', format: 'date' },
            author: { type: 'string' },
          },
          required: ['title', 'summary']
        }
      );

      if (!processed.success) {
        throw new Error(processed.error || 'Failed to process extracted text');
      }

      const finalResult = {
        ...extraction.data,
        processedData: processed.data
      };

      setResult(finalResult);
      onSuccess?.(finalResult);
      return { success: true, data: finalResult };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    extractFromPdf,
    isLoading,
    error,
    result,
    reset
  };
};

export default useAiExtraction;
