import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken, requireRole } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import { db } from '../services/database';
import { ApiResponse, PaginatedResponse } from '../types';

const router = Router();

// Basic schemas for this implementation
const CreateMetricSchema = z.object({
  metricType: z.string().min(1),
  zone: z.enum(['quality', 'velocity', 'happiness', 'business']),
  value: z.number(),
  teamId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

const MetricParamSchema = z.object({
  id: z.string().uuid(),
});

const PaginationSchema = z.object({
  page: z.string().default('1').transform(Number),
  limit: z.string().default('20').transform(Number),
});

// GET /api/v1/metrics - Get paginated list of metrics
router.get(
  '/',
  authenticateToken,
  validateQuery(PaginationSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { page, limit } = req.query as any;
      
      const metrics = await db.prisma.metric.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          team: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      });

      const total = await db.prisma.metric.count();
      const pages = Math.ceil(total / limit);

      const response: PaginatedResponse<any> = {
        success: true,
        data: metrics,
        pagination: {
          page,
          limit,
          total,
          pages,
          hasNext: page < pages,
          hasPrev: page > 1,
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch metrics',
      });
    }
  }
);

// POST /api/v1/metrics - Create new metric
router.post(
  '/',
  authenticateToken,
  requireRole(['admin', 'team_lead']),
  validateBody(CreateMetricSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const metricData = req.body;

      const metric = await db.prisma.metric.create({
        data: {
          ...metricData,
          zone: metricData.zone ? metricData.zone.toUpperCase() : 'QUALITY',
        },
        include: {
          team: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      });

      const response: ApiResponse<any> = {
        success: true,
        data: metric,
        message: 'Metric created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating metric:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create metric',
      });
    }
  }
);

export default router;