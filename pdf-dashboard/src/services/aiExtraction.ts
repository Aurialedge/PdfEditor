import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Function to list available models
const listModels = async () => {
  try {
    console.log('Fetching available models...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    console.log('Available models:', data);
    return data;
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
};

// List available models on initialization
listModels();

// Define the extraction result type
export interface ExtractionResult {
  success: boolean;
  data: any;
  error?: string;
  metadata?: {
    model: string;
    timestamp: string;
    charactersProcessed?: number;
  };
}

/**
 * Extracts text from a PDF file using Google's Gemini AI
 * @param file - The PDF file to extract text from
 * @param prompt - Custom prompt for the AI (optional)
 * @returns Promise with the extraction result
 */
export const extractTextFromPdf = async (
  file: File,
  prompt: string = 'Extract and summarize the key information from this PDF document.'
): Promise<ExtractionResult> => {
  try {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      throw new Error('Gemini API key is not configured');
    }

    // Try different model names in order of preference
    const modelNames = ['gemini-pro', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let lastError: Error | null = null;
    
    // Read the file as text first
    const fileContent = await file.text();
    const fullPrompt = `${prompt}\n\nDocument content:\n${fileContent.substring(0, 30000)}`;
    
    // Try each model until one works
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log(`Attempting to use model: ${modelName}`);
        
        // Try to generate content with this model
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        // If we get here, the model worked
        console.log(`Successfully used model: ${modelName}`);
        
        return {
          success: true,
          data: {
            extractedText: text,
            metadata: {
              model: modelName,
              timestamp: new Date().toISOString(),
              charactersProcessed: fileContent.length
            }
          }
        };
      } catch (error) {
        console.warn(`Failed to use model ${modelName}:`, error);
        lastError = error as Error;
      }
    }
    
    // If we get here, no models worked
    throw new Error(`No working model found. Last error: ${lastError?.message || 'Unknown error'}`);
  } catch (error) {
    console.error('Error extracting text with Gemini:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Processes extracted text to extract structured data
 * @param text - The extracted text to process
 * @param schema - Optional schema for structured data extraction
 * @returns Processed structured data
 */
export const processExtractedText = async (
  text: string,
  schema?: Record<string, any>
): Promise<ExtractionResult> => {
  try {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      throw new Error('Gemini API key is not configured');
    }

    // Try different model names in order of preference
    const modelNames = ['gemini-pro', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let lastError: Error | null = null;
    
    const prompt = schema 
      ? `Extract the following information from the text in a structured JSON format based on this schema: ${JSON.stringify(schema)}. Text: ${text}`
      : `Extract key information from the following text and return as structured JSON: ${text}`;
    
    // Try each model until one works
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log(`Attempting to use model: ${modelName}`);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log(`Successfully used model: ${modelName}`);
        
        // Try to parse the response as JSON if possible
        try {
          const jsonData = JSON.parse(responseText);
          return {
            success: true,
            data: jsonData,
            metadata: {
              model: modelName,
              timestamp: new Date().toISOString()
            }
          };
        } catch (e) {
          // If not valid JSON, return as text
          return {
            success: true,
            data: { extractedText: responseText },
            metadata: {
              model: modelName,
              timestamp: new Date().toISOString()
            }
          };
        }
      } catch (error) {
        console.warn(`Failed to use model ${modelName}:`, error);
        lastError = error as Error;
      }
    }
    
    // If we get here, no models worked
    throw new Error(`No working model found. Last error: ${lastError?.message || 'Unknown error'}`);
  } catch (error) {
    console.error('Error processing text with Gemini:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error processing text'
    };
  }
};
