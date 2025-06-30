import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authenticateToken, requireRole } from '../../middleware/auth';
import { validateBody } from '../../middleware/validation';
import { gitHubConfig, githubClient } from '../../services/github';
import { ApiResponse } from '../../types';

const router = Router();

// Validation schemas
const GitHubConfigSchema = z.object({
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  webhookSecret: z.string().optional(),
  organization: z.string().optional(),
  appId: z.string().optional(),
  privateKey: z.string().optional(),
  installationId: z.string().optional(),
});

// GET /api/v1/github/config - Get GitHub configuration status
router.get(
  '/',
  authenticateToken,
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const config = gitHubConfig.getConfig();
      
      // Don't expose sensitive information
      const safeConfig = {
        isConfigured: gitHubConfig.isConfigured(),
        hasOAuthConfig: gitHubConfig.hasOAuthConfig(),
        hasAppConfig: gitHubConfig.hasAppConfig(),
        organization: config.organization,
        restApiUrl: config.restApiUrl,
        graphqlApiUrl: config.graphqlApiUrl,
        rateLimit: config.rateLimit,
        clientIdConfigured: !!config.oauth?.clientId,
        webhookSecretConfigured: !!config.webhookSecret,
        appIdConfigured: !!config.app?.appId,
      };

      const response: ApiResponse<any> = {
        success: true,
        data: safeConfig,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching GitHub configuration:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch GitHub configuration',
      });
    }
  }
);

// POST /api/v1/github/config - Update GitHub configuration
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  validateBody(GitHubConfigSchema),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const configUpdates = req.body;
      
      // Build the update object based on what was provided
      const updates: any = {};
      
      if (configUpdates.clientId || configUpdates.clientSecret) {
        updates.oauth = {
          clientId: configUpdates.clientId,
          clientSecret: configUpdates.clientSecret,
        };
      }
      
      if (configUpdates.appId || configUpdates.privateKey || configUpdates.installationId) {
        updates.app = {
          appId: configUpdates.appId,
          privateKey: configUpdates.privateKey,
          installationId: configUpdates.installationId,
        };
      }
      
      if (configUpdates.webhookSecret) {
        updates.webhookSecret = configUpdates.webhookSecret;
      }
      
      if (configUpdates.organization) {
        updates.organization = configUpdates.organization;
      }

      // Update the configuration
      gitHubConfig.updateConfig(updates);
      
      // Reinitialize the GitHub client with new configuration
      await githubClient.reinitialize();

      const response: ApiResponse<any> = {
        success: true,
        message: 'GitHub configuration updated successfully',
        data: {
          isConfigured: gitHubConfig.isConfigured(),
          hasOAuthConfig: gitHubConfig.hasOAuthConfig(),
          hasAppConfig: gitHubConfig.hasAppConfig(),
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error updating GitHub configuration:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update GitHub configuration',
      });
    }
  }
);

// GET /api/v1/github/config/health - Check GitHub API connection health
router.get(
  '/health',
  authenticateToken,
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const isHealthy = await githubClient.healthCheck();
      const isConfigured = gitHubConfig.isConfigured();

      const response: ApiResponse<any> = {
        success: true,
        data: {
          isHealthy,
          isConfigured,
          isInitialized: githubClient.isInitialized(),
          timestamp: new Date().toISOString()
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error checking GitHub API health:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check GitHub API health',
      });
    }
  }
);

// POST /api/v1/github/config/test - Test GitHub API connection
router.post(
  '/test',
  authenticateToken,
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      if (!gitHubConfig.isConfigured()) {
        res.status(400).json({
          success: false,
          error: 'GitHub API not configured',
        });
        return;
      }

      const isHealthy = await githubClient.healthCheck();
      
      let testResults: any = {
        connectionTest: isHealthy,
      };

      if (isHealthy) {
        try {
          // Try to get user information
          const client = githubClient.getRestClient();
          const userInfo = await client.rest.users.getAuthenticated();
          testResults.authenticatedUser = {
            login: userInfo.data.login,
            type: userInfo.data.type,
          };
        } catch (error: any) {
          testResults.authenticationTest = false;
          testResults.authenticationError = error.message;
        }
      }

      const response: ApiResponse<any> = {
        success: isHealthy,
        data: testResults,
        message: isHealthy ? 'GitHub API connection test successful' : 'GitHub API connection test failed',
      };

      res.json(response);
    } catch (error) {
      console.error('Error testing GitHub API connection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to test GitHub API connection',
      });
    }
  }
);

export default router;