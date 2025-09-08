import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers and middleware to catch and forward errors to Express error handling
 * @param fn Async function to wrap
 * @returns A new function that handles errors properly
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
