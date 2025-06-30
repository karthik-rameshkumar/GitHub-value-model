import { Router, Request, Response } from 'express';
import { webhookService } from '../../services/github';
import { ApiResponse } from '../../types';

const router = Router();

// POST /api/v1/github/webhooks - GitHub webhook endpoint
router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const event = req.headers['x-github-event'] as string;
      const delivery = req.headers['x-github-delivery'] as string;

      if (!signature || !event || !delivery) {
        res.status(400).json({
          success: false,
          error: 'Missing required webhook headers',
        });
        return;
      }

      // Process the webhook
      await webhookService.processWebhook(event, req.body, signature);

      const response: ApiResponse<any> = {
        success: true,
        message: 'Webhook processed successfully',
        data: {
          event,
          delivery,
          processed: true
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      
      if (error.message === 'Invalid webhook signature') {
        res.status(401).json({
          success: false,
          error: 'Invalid webhook signature',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to process webhook',
        });
      }
    }
  }
);

// GET /api/v1/github/webhooks/health - Webhook health check
router.get(
  '/health',
  (req: Request, res: Response): void => {
    const response: ApiResponse<any> = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        webhookServiceInitialized: true
      },
      message: 'Webhook service is healthy'
    };

    res.json(response);
  }
);

export default router;