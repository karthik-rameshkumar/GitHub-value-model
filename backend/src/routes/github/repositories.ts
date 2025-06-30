import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken, requireRole } from '../../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../../middleware/validation';
import { repositoryService } from '../../services/github';
import { ApiResponse, PaginatedResponse } from '../../types';

const router = Router();

// Validation schemas
const RepositoryParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

const RepositoryQuerySchema = z.object({
  page: z.string().default('1').transform(Number),
  limit: z.string().default('20').transform(Number),
  type: z.enum(['all', 'owner', 'member']).default('all'),
});

const SyncRepositorySchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

const OrganizationQuerySchema = z.object({
  org: z.string().min(1),
  type: z.enum(['all', 'public', 'private', 'forks', 'sources', 'member']).default('all'),
  page: z.string().default('1').transform(Number),
  limit: z.string().default('20').transform(Number),
});

// GET /api/v1/github/repositories - Get list of repositories
router.get(
  '/',
  authenticateToken,
  validateQuery(RepositoryQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { page, limit, type } = req.query as any;
      
      const repositories = await repositoryService.getRepositories(undefined, type, page, limit);

      const response: PaginatedResponse<any> = {
        success: true,
        data: repositories,
        pagination: {
          page,
          limit,
          total: repositories.length, // Note: GitHub API doesn't provide total count easily
          pages: Math.ceil(repositories.length / limit),
          hasNext: repositories.length === limit,
          hasPrev: page > 1,
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch repositories',
      });
    }
  }
);

// GET /api/v1/github/repositories/org/:org - Get organization repositories
router.get(
  '/org/:org',
  authenticateToken,
  validateParams(z.object({ org: z.string().min(1) })),
  validateQuery(OrganizationQuerySchema.omit({ org: true })),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { org } = req.params;
      const { page, limit, type } = req.query as any;
      
      const repositories = await repositoryService.getOrganizationRepositories(
        org, type, page, limit
      );

      const response: PaginatedResponse<any> = {
        success: true,
        data: repositories,
        pagination: {
          page,
          limit,
          total: repositories.length,
          pages: Math.ceil(repositories.length / limit),
          hasNext: repositories.length === limit,
          hasPrev: page > 1,
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching organization repositories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch organization repositories',
      });
    }
  }
);

// GET /api/v1/github/repositories/:owner/:repo - Get specific repository
router.get(
  '/:owner/:repo',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      
      const repository = await repositoryService.getRepository(owner, repo);

      const response: ApiResponse<any> = {
        success: true,
        data: repository,
      };

      res.json(response);
    } catch (error: any) {
      console.error('Error fetching repository:', error);
      const statusCode = error.status === 404 ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 404 ? 'Repository not found' : 'Failed to fetch repository',
      });
    }
  }
);

// POST /api/v1/github/repositories/sync - Sync repository data
router.post(
  '/sync',
  authenticateToken,
  requireRole(['admin', 'team_lead']),
  validateBody(SyncRepositorySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.body;
      
      const syncResult = await repositoryService.syncRepository(owner, repo);

      const response: ApiResponse<any> = {
        success: true,
        data: syncResult,
        message: 'Repository synced successfully',
      };

      res.json(response);
    } catch (error: any) {
      console.error('Error syncing repository:', error);
      const statusCode = error.status === 404 ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 404 ? 'Repository not found' : 'Failed to sync repository',
      });
    }
  }
);

// GET /api/v1/github/repositories/:owner/:repo/languages - Get repository languages
router.get(
  '/:owner/:repo/languages',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      
      const languages = await repositoryService.getRepositoryLanguages(owner, repo);

      const response: ApiResponse<any> = {
        success: true,
        data: languages,
      };

      res.json(response);
    } catch (error: any) {
      console.error('Error fetching repository languages:', error);
      const statusCode = error.status === 404 ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 404 ? 'Repository not found' : 'Failed to fetch repository languages',
      });
    }
  }
);

// GET /api/v1/github/repositories/:owner/:repo/stats - Get repository statistics
router.get(
  '/:owner/:repo/stats',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      
      const stats = await repositoryService.getRepositoryStats(owner, repo);

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
      };

      res.json(response);
    } catch (error: any) {
      console.error('Error fetching repository stats:', error);
      const statusCode = error.status === 404 ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 404 ? 'Repository not found' : 'Failed to fetch repository stats',
      });
    }
  }
);

export default router;