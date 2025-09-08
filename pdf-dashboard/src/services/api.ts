const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ExtractedData {
  _id?: string;
  title: string;
  summary: string;
  keyPoints: string[];
  date?: string | Date;
  author?: string;
  originalText: string;
  metadata?: {
    model: string;
    timestamp: string;
    charactersProcessed?: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const createExtractedData = async (data: Omit<ExtractedData, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ExtractedData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extracted-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating extracted data:', error);
    return {
      success: false,
      error: 'Failed to create extracted data',
    };
  }
};

export const getAllExtractedData = async (page = 1, limit = 10, search = ''): Promise<ApiResponse<{ data: ExtractedData[]; pagination: any }>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/extracted-data?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching extracted data:', error);
    return {
      success: false,
      error: 'Failed to fetch extracted data',
    };
  }
};

export const getExtractedDataById = async (id: string): Promise<ApiResponse<ExtractedData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extracted-data/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching extracted data by ID:', error);
    return {
      success: false,
      error: 'Failed to fetch extracted data',
    };
  }
};

export const updateExtractedData = async (id: string, data: Partial<ExtractedData>): Promise<ApiResponse<ExtractedData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extracted-data/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating extracted data:', error);
    return {
      success: false,
      error: 'Failed to update extracted data',
    };
  }
};

export const deleteExtractedData = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extracted-data/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting extracted data:', error);
    return {
      success: false,
      error: 'Failed to delete extracted data',
    };
  }
};
