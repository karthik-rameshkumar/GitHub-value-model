import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken, requireRole } from '../../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../../middleware/validation';
import { repositoryService } from '../../services/github';
import { RepositoryParamsSchema } from '../../schemas';
import { sendPaginatedResponse, sendSuccessResponse, sendErrorResponse } from '../../utils/routes';

const router = Router();

// Local validation schemas for routes-specific needs
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

      sendPaginatedResponse(res, repositories, page, limit);
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to fetch repositories');
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
      const { org } = req.params as { org: string };
      const { page, limit, type } = req.query as any;
      
      const repositories = await repositoryService.getOrganizationRepositories(
        org, type, page, limit
      );

      sendPaginatedResponse(res, repositories, page, limit);
    } catch (error) {
      sendErrorResponse(res, error, 'Failed to fetch organization repositories');
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
      const { owner, repo } = req.params as { owner: string; repo: string };
      
      const repository = await repositoryService.getRepository(owner, repo);

      sendSuccessResponse(res, repository);
    } catch (error: any) {
      sendErrorResponse(res, error, 'Failed to fetch repository');
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

      sendSuccessResponse(res, syncResult, 'Repository synced successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, 'Failed to sync repository');
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
      const { owner, repo } = req.params as { owner: string; repo: string };
      
      const languages = await repositoryService.getRepositoryLanguages(owner, repo);

      sendSuccessResponse(res, languages);
    } catch (error: any) {
      sendErrorResponse(res, error, 'Failed to fetch repository languages');
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
      const { owner, repo } = req.params as { owner: string; repo: string };
      
      const stats = await repositoryService.getRepositoryStats(owner, repo);

      sendSuccessResponse(res, stats);
    } catch (error: any) {
      sendErrorResponse(res, error, 'Failed to fetch repository stats');
    }
  }
);

export default router;