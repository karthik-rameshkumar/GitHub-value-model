import { Router } from 'express';
import { Pool } from 'pg';
import { createClient } from 'redis';

const router = Router();

// Database connection
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'essp_dashboard',
  user: process.env.DATABASE_USER || 'essp_user',
  password: process.env.DATABASE_PASSWORD || 'essp_password',
});

// Redis connection
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Basic health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Database health check
router.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now,
      pool: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Redis health check
router.get('/redis', async (req, res) => {
  try {
    const pong = await redisClient.ping();
    res.status(200).json({
      status: 'healthy',
      redis: 'connected',
      response: pong,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Redis health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      redis: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Comprehensive health check
router.get('/all', async (req, res) => {
  const healthChecks = {
    api: { status: 'healthy' },
    database: { status: 'unknown' },
    redis: { status: 'unknown' }
  };

  // Check database
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    healthChecks.database = { status: 'healthy' };
  } catch (error) {
    healthChecks.database = { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error'
    } as any;
  }

  // Check Redis
  try {
    await redisClient.ping();
    healthChecks.redis = { status: 'healthy' };
  } catch (error) {
    healthChecks.redis = { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error'
    } as any;
  }

  const overallStatus = Object.values(healthChecks).every(check => check.status === 'healthy') 
    ? 'healthy' 
    : 'unhealthy';

  const statusCode = overallStatus === 'healthy' ? 200 : 503;

  res.status(statusCode).json({
    status: overallStatus,
    checks: healthChecks,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;