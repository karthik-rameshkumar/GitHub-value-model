import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken } from '../../middleware/auth';
import { validateQuery, validateParams } from '../../middleware/validation';
import { deploymentService } from '../../services/github';
import { ApiResponse, PaginatedResponse } from '../../types';

const router = Router();

// Validation schemas
const RepositoryParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

const DeploymentQuerySchema = z.object({
  page: z.string().default('1').transform(Number),
  limit: z.string().default('20').transform(Number),
  environment: z.string().optional(),
});

const MetricsQuerySchema = z.object({
  environment: z.string().optional(),
  since: z.string().optional().transform(val => val ? new Date(val) : undefined),
  until: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

// GET /api/v1/github/deployments/:owner/:repo - Get deployments for repository
router.get(
  '/:owner/:repo',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(DeploymentQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { page, limit, environment } = req.query as any;
      
      const deployments = await deploymentService.getDeployments(
        owner, repo, environment, page, limit
      );

      const response: PaginatedResponse<any> = {
        success: true,
        data: deployments,
        pagination: {
          page,
          limit,
          total: deployments.length,
          pages: Math.ceil(deployments.length / limit),
          hasNext: deployments.length === limit,
          hasPrev: page > 1,
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching deployments:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch deployments',
      });
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/metrics - Get deployment metrics
router.get(
  '/:owner/:repo/metrics',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(MetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { environment, since, until } = req.query as any;
      
      const metrics = await deploymentService.calculateMetrics(
        owner, repo, environment, since, until
      );

      const response: ApiResponse<any> = {
        success: true,
        data: metrics,
      };

      res.json(response);
    } catch (error) {
      console.error('Error calculating deployment metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate deployment metrics',
      });
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/change-failure-rate - Get change failure rate
router.get(
  '/:owner/:repo/change-failure-rate',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(MetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { environment, since, until } = req.query as any;
      
      const changeFailureRate = await deploymentService.calculateChangeFailureRate(
        owner, repo, environment, since, until
      );

      const response: ApiResponse<any> = {
        success: true,
        data: { changeFailureRate },
      };

      res.json(response);
    } catch (error) {
      console.error('Error calculating change failure rate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate change failure rate',
      });
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/mean-time-to-recovery - Get mean time to recovery
router.get(
  '/:owner/:repo/mean-time-to-recovery',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(MetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { environment, since, until } = req.query as any;
      
      const meanTimeToRecovery = await deploymentService.calculateMeanTimeToRecovery(
        owner, repo, environment, since, until
      );

      const response: ApiResponse<any> = {
        success: true,
        data: { meanTimeToRecovery },
      };

      res.json(response);
    } catch (error) {
      console.error('Error calculating mean time to recovery:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate mean time to recovery',
      });
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/change-failure-data - Get detailed change failure data
router.get(
  '/:owner/:repo/change-failure-data',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(MetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { environment, since, until } = req.query as any;
      
      const changeFailureData = await deploymentService.getChangeFailureData(
        owner, repo, environment, since, until
      );

      const response: ApiResponse<any> = {
        success: true,
        data: changeFailureData,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching change failure data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch change failure data',
      });
    }
  }
);

export default router;