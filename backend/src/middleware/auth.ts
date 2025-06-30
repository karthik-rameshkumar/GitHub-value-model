import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Simple mock authentication for development
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // For development, create a mock user
  req.user = {
    id: 'mock-user-id',
    username: 'developer',
    email: 'dev@example.com',
    role: 'admin',
  };
  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // For development, create a mock user
  req.user = {
    id: 'mock-user-id',
    username: 'developer',
    email: 'dev@example.com',
    role: 'admin',
  };
  next();
};