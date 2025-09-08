/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  /**
   * Create a new API error
   * @param statusCode HTTP status code
   * @param message Error message
   * @param isOperational Is this a known, operational error? (default: true)
   * @param details Additional error details (optional)
   */
  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    details?: any
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    
    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware for Express
 */
export const errorHandler = (
  err: any,
  req: any,
  res: any,
  _next: any
) => {
  // Default to 500 if status code not set
  const statusCode = err.statusCode || 500;
  
  // In development, include stack trace
  const errorResponse: any = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  // Add validation errors if they exist
  if (err.details) {
    errorResponse.errors = err.details;
  }
  
  // Log the error for debugging
  if (statusCode >= 500) {
    console.error(err);
  }
  
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: any, res: any) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
};
