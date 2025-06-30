import { Router } from 'express';
import repositoriesRouter from './repositories';
import pullRequestsRouter from './pullRequests';
import deploymentsRouter from './deployments';
import securityRouter from './security';
import copilotRouter from './copilot';
import webhooksRouter from './webhooks';
import configRouter from './config';

const router = Router();

// Mount all GitHub API routes
router.use('/repositories', repositoriesRouter);
router.use('/pull-requests', pullRequestsRouter);
router.use('/deployments', deploymentsRouter);
router.use('/security', securityRouter);
router.use('/copilot', copilotRouter);
router.use('/webhooks', webhooksRouter);
router.use('/config', configRouter);

export default router;