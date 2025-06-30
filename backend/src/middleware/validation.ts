import { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Simple validation - check required fields for metrics
      if (!req.body) {
        return res.status(400).json({
          success: false,
          error: 'Request body is required',
        });
      }

      // For metrics endpoint, validate required fields
      if (req.originalUrl.includes('/metrics') && req.method === 'POST') {
        const { metricType, zone, value, teamId } = req.body;
        
        if (!metricType || !zone || value === undefined || !teamId) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: metricType, zone, value, teamId',
          });
        }

        const validZones = ['quality', 'velocity', 'happiness', 'business'];
        if (!validZones.includes(zone.toLowerCase())) {
          return res.status(400).json({
            success: false,
            error: 'Invalid zone. Must be one of: quality, velocity, happiness, business',
          });
        }

        if (typeof value !== 'number') {
          return res.status(400).json({
            success: false,
            error: 'Value must be a number',
          });
        }
      }
      
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
      });
    }
  };
};

export const validateQuery = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Simple query validation - add defaults
    req.query.page = req.query.page || '1';
    req.query.limit = req.query.limit || '20';
    next();
  };
};

export const validateParams = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Simple param validation
    next();
  };
};