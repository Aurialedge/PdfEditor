import { Request, Response } from 'express';
import ExtractedData from '../models/ExtractedData.js';
import { Error as MongooseError } from 'mongoose';

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

interface ExtractedDataInput {
  title: string;
  summary: string;
  keyPoints?: string[];
  date?: Date | string;
  author?: string;
  originalText: string;
  metadata?: {
    model?: string;
    timestamp?: string;
    charactersProcessed?: number;
  };
}

interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
}

// Create a new extracted data entry
export const createExtractedData = async (req: Request, res: Response) => {
  try {
    const { title, summary, keyPoints, date, author, originalText, metadata }: ExtractedDataInput = req.body;
    
    const newData = new ExtractedData({
      title,
      summary,
      keyPoints: keyPoints || [],
      date: date ? new Date(date) : new Date(),
      author: author || 'Unknown',
      originalText,
      metadata: metadata || {}
    });

    const savedData = await newData.save();
    
    res.status(201).json({
      success: true,
      data: savedData
    });
  } catch (error: unknown) {
    console.error('Error creating extracted data:', error);
    
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error instanceof MongooseError.ValidationError) {
        statusCode = 400; // Bad Request
      } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        statusCode = 409; // Conflict (duplicate key)
        errorMessage = 'A document with this title already exists';
      }
    }
    
    res.status(statusCode).json({
      success: false,
      message: 'Failed to create extracted data',
      error: errorMessage
    });
  }
};

// Get all extracted data with pagination and search
export const getAllExtractedData = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query as unknown as PaginationQuery;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }

    const data = await ExtractedData.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await ExtractedData.countDocuments(query);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching extracted data:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      message: 'Failed to fetch extracted data',
      error: errorMessage
    });
  }
};

// Get a single extracted data entry by ID
export const getExtractedDataById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await ExtractedData.findById(id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Extracted data not found'
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error: unknown) {
    console.error('Error fetching extracted data:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      message: 'Failed to fetch extracted data',
      error: errorMessage
    });
  }
};

// Update an extracted data entry
export const updateExtractedData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, summary, keyPoints, date, author, originalText, metadata }: ExtractedDataInput = req.body;

    const updatedData = await ExtractedData.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        keyPoints,
        date: date ? new Date(date) : undefined,
        author,
        originalText,
        metadata,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: 'Extracted data not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedData
    });
  } catch (error: unknown) {
    console.error('Error updating extracted data:', error);
    
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error instanceof MongooseError.ValidationError) {
        statusCode = 400; // Bad Request
      } else if (error.name === 'CastError') {
        statusCode = 400; // Bad Request for invalid ID format
        errorMessage = 'Invalid ID format';
      }
    }
    
    res.status(statusCode).json({
      success: false,
      message: 'Failed to update extracted data',
      error: errorMessage
    });
  }
};

// Delete an extracted data entry
export const deleteExtractedData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedData = await ExtractedData.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: 'Extracted data not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Extracted data deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Error deleting extracted data:', error);
    
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.name === 'CastError') {
        statusCode = 400; // Bad Request for invalid ID format
        errorMessage = 'Invalid ID format';
      }
    }
    
    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete extracted data',
      error: errorMessage
    });
  }
};
