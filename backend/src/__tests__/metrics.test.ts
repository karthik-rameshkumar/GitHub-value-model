import request from 'supertest';
import app from '../index';

describe('Metrics API Endpoints', () => {
  describe('GET /api/v1/metrics', () => {
    it('should return paginated metrics list', async () => {
      const response = await request(app)
        .get('/api/v1/metrics')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
    });

    it('should support pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/metrics?page=1&limit=10')
        .expect(200);

      expect(response.body.pagination.page).toBe('1');
      expect(response.body.pagination.limit).toBe('10');
    });
  });

  describe('POST /api/v1/metrics', () => {
    it('should create a new metric', async () => {
      const metricData = {
        metricType: 'test_metric',
        zone: 'quality',
        value: 85.5,
        teamId: '123e4567-e89b-12d3-a456-426614174000',
        metadata: { source: 'test' }
      };

      const response = await request(app)
        .post('/api/v1/metrics')
        .send(metricData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.metricType).toBe(metricData.metricType);
      expect(response.body.data.zone).toBe('QUALITY');
      expect(response.body.data.value).toBe(metricData.value);
      expect(response.body.data.teamId).toBe(metricData.teamId);
      expect(response.body).toHaveProperty('message', 'Metric created successfully');
    });

    it('should return 400 for invalid metric data', async () => {
      const response = await request(app)
        .post('/api/v1/metrics')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Integration test', () => {
    it('should create and retrieve metrics', async () => {
      // Create a metric
      const metricData = {
        metricType: 'deployment_frequency',
        zone: 'velocity',
        value: 3.2,
        teamId: '123e4567-e89b-12d3-a456-426614174000'
      };

      const createResponse = await request(app)
        .post('/api/v1/metrics')
        .send(metricData)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      const createdMetric = createResponse.body.data;

      // Retrieve metrics
      const listResponse = await request(app)
        .get('/api/v1/metrics')
        .expect(200);

      expect(listResponse.body.success).toBe(true);
      expect(Array.isArray(listResponse.body.data)).toBe(true);
      
      // Check if our metric is in the list
      const foundMetric = listResponse.body.data.find((m: any) => m.id === createdMetric.id);
      expect(foundMetric).toBeDefined();
      expect(foundMetric.metricType).toBe(metricData.metricType);
    });
  });
});