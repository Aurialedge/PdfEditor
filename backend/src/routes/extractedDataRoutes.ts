import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createExtractedData,
  getAllExtractedData,
  getExtractedDataById,
  updateExtractedData,
  deleteExtractedData
} from '../controllers/extractedDataController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { body, param } from 'express-validator';

const router = Router();

// Validation middleware for extracted data
const validateExtractedData = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  body('keyPoints').optional().isArray().withMessage('Key points must be an array'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('author').optional().trim(),
  body('originalText').trim().notEmpty().withMessage('Original text is required'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  validateRequest
];

const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validateRequest
];

// Create a new extracted data entry
router.post('/', validateExtractedData, asyncHandler(createExtractedData));

// Get all extracted data with pagination and search
router.get('/', asyncHandler(getAllExtractedData));

// Get a single extracted data entry by ID
router.get('/:id', validateObjectId, asyncHandler(getExtractedDataById));

// Update an extracted data entry
router.put('/:id', [...validateObjectId, ...validateExtractedData], asyncHandler(updateExtractedData));

// Delete an extracted data entry
router.delete('/:id', validateObjectId, asyncHandler(deleteExtractedData));

export default router;
