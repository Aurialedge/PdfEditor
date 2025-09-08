import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ApiError } from '../utils/error';

interface ValidationErrorItem {
  field: string;
  message: string;
  value?: any;
}

/**
 * Middleware to validate request data against validation rules
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages: ValidationErrorItem[] = errors.array().map((error: ValidationError) => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    throw new ApiError(400, 'Validation failed', true, { errors: errorMessages });
  }
  
  next();
};

export default validateRequest;
