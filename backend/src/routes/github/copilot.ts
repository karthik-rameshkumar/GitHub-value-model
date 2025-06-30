import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken } from '../../middleware/auth';
import { validateQuery, validateParams } from '../../middleware/validation';
import { copilotService } from '../../services/github';
import { ApiResponse } from '../../types';

const router = Router();

// Validation schemas
const OrganizationParamsSchema = z.object({
  org: z.string().min(1),
});

const CopilotQuerySchema = z.object({
  since: z.string().optional(),
  until: z.string().optional(),
});

const UserParamsSchema = z.object({
  org: z.string().min(1),
  username: z.string().min(1),
});

// GET /api/v1/github/copilot/:org/usage - Get Copilot usage for organization
router.get(
  '/:org/usage',
  authenticateToken,
  validateParams(OrganizationParamsSchema),
  validateQuery(CopilotQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { org } = req.params;
      const { since, until } = req.query as any;
      
      const usage = await copilotService.getCopilotUsage(org, since, until);

      const response: ApiResponse<any> = {
        success: true,
        data: usage,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching Copilot usage:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch Copilot usage',
      });
    }
  }
);

// GET /api/v1/github/copilot/:org/metrics - Get Copilot metrics for organization
router.get(
  '/:org/metrics',
  authenticateToken,
  validateParams(OrganizationParamsSchema),
  validateQuery(CopilotQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { org } = req.params;
      const { since, until } = req.query as any;
      
      const metrics = await copilotService.calculateCopilotMetrics(org, since, until);

      const response: ApiResponse<any> = {
        success: true,
        data: metrics,
      };

      res.json(response);
    } catch (error) {
      console.error('Error calculating Copilot metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate Copilot metrics',
      });
    }
  }
);

// GET /api/v1/github/copilot/:org/detailed-metrics - Get detailed Copilot metrics
router.get(
  '/:org/detailed-metrics',
  authenticateToken,
  validateParams(OrganizationParamsSchema),
  validateQuery(CopilotQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { org } = req.params;
      const { since, until } = req.query as any;
      
      const detailedMetrics = await copilotService.getCopilotMetricsDetailed(org, since, until);

      const response: ApiResponse<any> = {
        success: true,
        data: detailedMetrics,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching detailed Copilot metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch detailed Copilot metrics',
      });
    }
  }
);

// GET /api/v1/github/copilot/:org/seats - Get Copilot seat information
router.get(
  '/:org/seats',
  authenticateToken,
  validateParams(OrganizationParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { org } = req.params;
      
      const seatInfo = await copilotService.getCopilotSeatInformation(org);

      const response: ApiResponse<any> = {
        success: true,
        data: seatInfo,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching Copilot seat information:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch Copilot seat information',
      });
    }
  }
);

// GET /api/v1/github/copilot/:org/productivity-impact - Get productivity impact metrics
router.get(
  '/:org/productivity-impact',
  authenticateToken,
  validateParams(OrganizationParamsSchema),
  validateQuery(CopilotQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { org } = req.params;
      const { since, until } = req.query as any;
      
      const productivityImpact = await copilotService.calculateProductivityImpact(org, since, until);

      const response: ApiResponse<any> = {
        success: true,
        data: productivityImpact,
      };

      res.json(response);
    } catch (error) {
      console.error('Error calculating productivity impact:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate productivity impact',
      });
    }
  }
);

// GET /api/v1/github/copilot/:org/users/:username - Get user-specific Copilot usage
router.get(
  '/:org/users/:username',
  authenticateToken,
  validateParams(UserParamsSchema),
  validateQuery(CopilotQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { org, username } = req.params;
      const { since, until } = req.query as any;
      
      const userUsage = await copilotService.getUserCopilotUsage(org, username, since, until);

      const response: ApiResponse<any> = {
        success: true,
        data: userUsage,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching user Copilot usage:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user Copilot usage',
      });
    }
  }
);

export default router;