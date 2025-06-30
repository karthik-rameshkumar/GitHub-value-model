import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken } from '../../middleware/auth';
import { validateQuery, validateParams } from '../../middleware/validation';
import { pullRequestService } from '../../services/github';
import { ApiResponse, PaginatedResponse } from '../../types';

const router = Router();

// Validation schemas
const RepositoryParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

const PullRequestQuerySchema = z.object({
  page: z.string().default('1').transform(Number),
  limit: z.string().default('20').transform(Number),
  state: z.enum(['open', 'closed', 'all']).default('all'),
});

const MetricsQuerySchema = z.object({
  since: z.string().optional().transform(val => val ? new Date(val) : undefined),
  until: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

const PullRequestParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  pull_number: z.string().transform(Number),
});

// GET /api/v1/github/pull-requests/:owner/:repo - Get pull requests for repository
router.get(
  '/:owner/:repo',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(PullRequestQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { page, limit, state } = req.query as any;
      
      const pullRequests = await pullRequestService.getPullRequests(
        owner, repo, state, page, limit
      );

      const response: PaginatedResponse<any> = {
        success: true,
        data: pullRequests,
        pagination: {
          page,
          limit,
          total: pullRequests.length,
          pages: Math.ceil(pullRequests.length / limit),
          hasNext: pullRequests.length === limit,
          hasPrev: page > 1,
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching pull requests:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pull requests',
      });
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
      const { owner, repo, pull_number } = req.params;
      
      const pullRequest = await pullRequestService.getPullRequestDetails(
        owner, repo, Number(pull_number)
      );

      const response: ApiResponse<any> = {
        success: true,
        data: pullRequest,
      };

      res.json(response);
    } catch (error: any) {
      console.error('Error fetching pull request:', error);
      const statusCode = error.status === 404 ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 404 ? 'Pull request not found' : 'Failed to fetch pull request',
      });
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
      const { owner, repo } = req.params;
      const { since, until } = req.query as any;
      
      const metrics = await pullRequestService.calculateMetrics(
        owner, repo, since, until
      );

      const response: ApiResponse<any> = {
        success: true,
        data: metrics,
      };

      res.json(response);
    } catch (error) {
      console.error('Error calculating pull request metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate pull request metrics',
      });
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
      const { owner, repo, pull_number } = req.params;
      
      const leadTimeData = await pullRequestService.calculateLeadTime(
        owner, repo, Number(pull_number)
      );

      const response: ApiResponse<any> = {
        success: true,
        data: leadTimeData,
      };

      res.json(response);
    } catch (error: any) {
      console.error('Error calculating lead time:', error);
      const statusCode = error.status === 404 ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 404 ? 'Pull request not found' : 'Failed to calculate lead time',
      });
    }
  }
);

export default router;