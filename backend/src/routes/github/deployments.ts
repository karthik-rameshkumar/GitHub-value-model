import { Router } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../../middleware/auth';
import { validateQuery, validateParams } from '../../middleware/validation';
import { deploymentService } from '../../services/github';
import { 
  RepositoryParamsSchema, 
  DeploymentQuerySchema, 
  DeploymentMetricsQuerySchema
} from '../../schemas';
import { sendPaginatedResponse, sendSuccessResponse, sendErrorResponse } from '../../utils/routes';

const router = Router();

// GET /api/v1/github/deployments/:owner/:repo - Get deployments for repository
router.get(
  '/:owner/:repo',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(DeploymentQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params as { owner: string; repo: string };
      const { page, limit, environment } = req.query as any;
      
      const deployments = await deploymentService.getDeployments(
        owner, repo, environment, page, limit
      );

      sendPaginatedResponse(res, deployments, page, limit);
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to fetch deployments');
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/metrics - Get deployment metrics
router.get(
  '/:owner/:repo/metrics',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(DeploymentMetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params as { owner: string; repo: string };
      const { environment, since, until } = req.query as any;
      
      const metrics = await deploymentService.calculateMetrics(
        owner, repo, environment, since, until
      );

      sendSuccessResponse(res, metrics);
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to calculate deployment metrics');
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/change-failure-rate - Get change failure rate
router.get(
  '/:owner/:repo/change-failure-rate',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(DeploymentMetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params as { owner: string; repo: string };
      const { environment, since, until } = req.query as any;
      
      const changeFailureRate = await deploymentService.calculateChangeFailureRate(
        owner, repo, environment, since, until
      );

      sendSuccessResponse(res, { changeFailureRate });
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to calculate change failure rate');
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/mean-time-to-recovery - Get mean time to recovery
router.get(
  '/:owner/:repo/mean-time-to-recovery',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(DeploymentMetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params as { owner: string; repo: string };
      const { environment, since, until } = req.query as any;
      
      const meanTimeToRecovery = await deploymentService.calculateMeanTimeToRecovery(
        owner, repo, environment, since, until
      );

      sendSuccessResponse(res, { meanTimeToRecovery });
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to calculate mean time to recovery');
    }
  }
);

// GET /api/v1/github/deployments/:owner/:repo/change-failure-data - Get detailed change failure data
router.get(
  '/:owner/:repo/change-failure-data',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(DeploymentMetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params as { owner: string; repo: string };
      const { environment, since, until } = req.query as any;
      
      const changeFailureData = await deploymentService.getChangeFailureData(
        owner, repo, environment, since, until
      );

      sendSuccessResponse(res, changeFailureData);
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to fetch change failure data');
    }
  }
);

export default router;