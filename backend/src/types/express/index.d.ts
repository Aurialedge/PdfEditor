import { Request, Response, NextFunction } from 'express';

export {};

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a proper user type when implementing authentication
    }
  }
}

// Extend the Error interface to include status code
declare global {
  interface Error {
    statusCode?: number;
    status?: number;
    isOperational?: boolean;
  }
}

// Type for async middleware functions
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Type for controller request handlers
export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
