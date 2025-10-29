import { Router } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../../middleware/auth';
import { validateQuery, validateParams } from '../../middleware/validation';
import { pullRequestService } from '../../services/github';
import { 
  RepositoryParamsSchema, 
  PullRequestQuerySchema, 
  MetricsQuerySchema,
  PullRequestParamsSchema
} from '../../schemas';
import { sendPaginatedResponse, sendSuccessResponse, sendErrorResponse } from '../../utils/routes';

const router = Router();

// GET /api/v1/github/pull-requests/:owner/:repo - Get pull requests for repository
router.get(
  '/:owner/:repo',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(PullRequestQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params as { owner: string; repo: string };
      const { page, limit, state } = req.query as any;
      
      const pullRequests = await pullRequestService.getPullRequests(
        owner, repo, state, page, limit
      );

      sendPaginatedResponse(res, pullRequests, page, limit);
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to fetch pull requests');
    }
  }
);

// GET /api/v1/github/pull-requests/:owner/:repo/:pull_number - Get specific pull request
router.get(
  '/:owner/:repo/:pull_number',
  authenticateToken,
  validateParams(PullRequestParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo, pull_number } = req.params as { owner: string; repo: string; pull_number: string };
      
      const pullRequest = await pullRequestService.getPullRequestDetails(
        owner, repo, Number(pull_number)
      );

      sendSuccessResponse(res, pullRequest);
    } catch (error: any) {
      sendErrorResponse(res, error, 'Failed to fetch pull request');
    }
  }
);

// GET /api/v1/github/pull-requests/:owner/:repo/metrics - Get pull request metrics
router.get(
  '/:owner/:repo/metrics',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(MetricsQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params as { owner: string; repo: string };
      const { since, until } = req.query as any;
      
      const metrics = await pullRequestService.calculateMetrics(
        owner, repo, since, until
      );

      sendSuccessResponse(res, metrics);
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to calculate pull request metrics');
    }
  }
);

// GET /api/v1/github/pull-requests/:owner/:repo/:pull_number/lead-time - Get lead time for specific PR
router.get(
  '/:owner/:repo/:pull_number/lead-time',
  authenticateToken,
  validateParams(PullRequestParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo, pull_number } = req.params as { owner: string; repo: string; pull_number: string };
      
      const leadTimeData = await pullRequestService.calculateLeadTime(
        owner, repo, Number(pull_number)
      );

      sendSuccessResponse(res, leadTimeData);
    } catch (error: any) {
      sendErrorResponse(res, error, 'Failed to calculate lead time');
    }
  }
);

export default router;