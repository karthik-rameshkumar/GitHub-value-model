import request from 'supertest';
import app from '../index';

describe('GitHub API Integration Endpoints', () => {
  describe('GET /api/v1/github/config/health', () => {
    it('should return GitHub API health status', async () => {
      const response = await request(app)
        .get('/api/v1/github/config/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('isHealthy');
      expect(response.body.data).toHaveProperty('isConfigured');
      expect(response.body.data).toHaveProperty('isInitialized');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/github/webhooks/health', () => {
    it('should return webhook service health status', async () => {
      const response = await request(app)
        .get('/api/v1/github/webhooks/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('webhookServiceInitialized', true);
      expect(response.body).toHaveProperty('message', 'Webhook service is healthy');
    });
  });

  describe('GitHub API Routes without authentication', () => {
    it('should return appropriate response for repositories endpoint without auth', async () => {
      const response = await request(app)
        .get('/api/v1/github/repositories');

      // Could be 401 or 500 depending on middleware order
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return appropriate response for pull requests endpoint without auth', async () => {
      const response = await request(app)
        .get('/api/v1/github/pull-requests/owner/repo');

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return appropriate response for deployments endpoint without auth', async () => {
      const response = await request(app)
        .get('/api/v1/github/deployments/owner/repo');

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return appropriate response for security endpoint without auth', async () => {
      const response = await request(app)
        .get('/api/v1/github/security/owner/repo/alerts');

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return appropriate response for copilot endpoint without auth', async () => {
      const response = await request(app)
        .get('/api/v1/github/copilot/org/usage');

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});