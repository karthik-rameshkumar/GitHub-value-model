import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken } from '../../middleware/auth';
import { validateQuery, validateParams } from '../../middleware/validation';
import { securityService } from '../../services/github';
import { ApiResponse } from '../../types';

const router = Router();

// Validation schemas
const RepositoryParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

const SecurityQuerySchema = z.object({
  state: z.enum(['open', 'closed', 'dismissed', 'fixed']).default('open'),
});

// GET /api/v1/github/security/:owner/:repo/alerts - Get security alerts
router.get(
  '/:owner/:repo/alerts',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(SecurityQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { state } = req.query as any;
      
      const [vulnerabilityAlerts, secretAlerts, codeScanningAlerts] = await Promise.all([
        securityService.getVulnerabilityAlerts(owner, repo, state as any),
        securityService.getSecretScanningAlerts(owner, repo, state as any),
        securityService.getCodeScanningAlerts(owner, repo, state as any)
      ]);

      const response: ApiResponse<any> = {
        success: true,
        data: {
          vulnerabilityAlerts,
          secretAlerts,
          codeScanningAlerts,
          summary: {
            totalVulnerabilities: vulnerabilityAlerts.length,
            totalSecrets: secretAlerts.length,
            totalCodeScanningAlerts: codeScanningAlerts.length
          }
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching security alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch security alerts',
      });
    }
  }
);

// GET /api/v1/github/security/:owner/:repo/vulnerabilities - Get vulnerability alerts
router.get(
  '/:owner/:repo/vulnerabilities',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(SecurityQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { state } = req.query as any;
      
      const vulnerabilities = await securityService.getVulnerabilityAlerts(owner, repo, state as any);

      const response: ApiResponse<any> = {
        success: true,
        data: vulnerabilities,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch vulnerabilities',
      });
    }
  }
);

// GET /api/v1/github/security/:owner/:repo/secrets - Get secret scanning alerts
router.get(
  '/:owner/:repo/secrets',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(z.object({
    state: z.enum(['open', 'resolved']).default('open'),
  })),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { state } = req.query as any;
      
      const secrets = await securityService.getSecretScanningAlerts(owner, repo, state);

      const response: ApiResponse<any> = {
        success: true,
        data: secrets,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching secret scanning alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch secret scanning alerts',
      });
    }
  }
);

// GET /api/v1/github/security/:owner/:repo/code-scanning - Get code scanning alerts
router.get(
  '/:owner/:repo/code-scanning',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  validateQuery(SecurityQuerySchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      const { state } = req.query as any;
      
      const codeScanningAlerts = await securityService.getCodeScanningAlerts(owner, repo, state as any);

      const response: ApiResponse<any> = {
        success: true,
        data: codeScanningAlerts,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching code scanning alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch code scanning alerts',
      });
    }
  }
);

// GET /api/v1/github/security/:owner/:repo/metrics - Get security metrics
router.get(
  '/:owner/:repo/metrics',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      
      const metrics = await securityService.calculateSecurityMetrics(owner, repo);

      const response: ApiResponse<any> = {
        success: true,
        data: metrics,
      };

      res.json(response);
    } catch (error) {
      console.error('Error calculating security metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate security metrics',
      });
    }
  }
);

// GET /api/v1/github/security/:owner/:repo/dependency-vulnerabilities - Get dependency vulnerabilities
router.get(
  '/:owner/:repo/dependency-vulnerabilities',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      
      const vulnerabilities = await securityService.getDependencyVulnerabilities(owner, repo);

      const response: ApiResponse<any> = {
        success: true,
        data: vulnerabilities,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching dependency vulnerabilities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dependency vulnerabilities',
      });
    }
  }
);

// GET /api/v1/github/security/:owner/:repo/advisories - Get security advisories
router.get(
  '/:owner/:repo/advisories',
  authenticateToken,
  validateParams(RepositoryParamsSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { owner, repo } = req.params;
      
      const advisories = await securityService.getSecurityAdvisories(owner, repo);

      const response: ApiResponse<any> = {
        success: true,
        data: advisories,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching security advisories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch security advisories',
      });
    }
  }
);

export default router;