import { Webhooks, createNodeMiddleware } from '@octokit/webhooks';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { gitHubConfig } from './config';
import { GitHubWebhookPayload } from '../../types';

export class WebhookService {
  private static instance: WebhookService;
  private webhooks: Webhooks | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  private initialize(): void {
    const config = gitHubConfig.getConfig();
    
    if (config.webhookSecret) {
      this.webhooks = new Webhooks({
        secret: config.webhookSecret,
      });

      this.setupEventHandlers();
    } else {
      console.warn('GitHub webhook secret not configured');
    }
  }

  private setupEventHandlers(): void {
    if (!this.webhooks) return;

    // Pull request events
    this.webhooks.on('pull_request', async ({ payload }) => {
      console.log(`Pull request ${payload.action} for ${payload.repository.full_name}#${payload.number}`);
      await this.handlePullRequestEvent(payload);
    });

    // Push events
    this.webhooks.on('push', async ({ payload }) => {
      console.log(`Push to ${payload.repository.full_name} on ${payload.ref}`);
      await this.handlePushEvent(payload);
    });

    // Deployment events
    this.webhooks.on('deployment', async ({ payload }) => {
      console.log(`Deployment created for ${payload.repository.full_name}`);
      await this.handleDeploymentEvent(payload);
    });

    this.webhooks.on('deployment_status', async ({ payload }) => {
      console.log(`Deployment status ${payload.deployment_status.state} for ${payload.repository.full_name}`);
      await this.handleDeploymentStatusEvent(payload);
    });

    // Repository events
    this.webhooks.on('repository', async ({ payload }) => {
      console.log(`Repository ${payload.action} for ${payload.repository.full_name}`);
      await this.handleRepositoryEvent(payload);
    });

    // Security alert events
    this.webhooks.on('repository_vulnerability_alert', async ({ payload }) => {
      console.log(`Security alert ${payload.action} for ${payload.repository.full_name}`);
      await this.handleSecurityAlertEvent(payload);
    });

    // Error handling
    this.webhooks.onError((error) => {
      console.error('Webhook error:', error);
    });
  }

  private async handlePullRequestEvent(payload: any): Promise<void> {
    try {
      // Extract relevant data
      const prData = {
        repository: payload.repository.full_name,
        prNumber: payload.number,
        action: payload.action,
        state: payload.pull_request.state,
        author: payload.pull_request.user.login,
        createdAt: new Date(payload.pull_request.created_at),
        updatedAt: new Date(payload.pull_request.updated_at),
        mergedAt: payload.pull_request.merged_at ? new Date(payload.pull_request.merged_at) : null
      };

      // Process based on action
      switch (payload.action) {
        case 'opened':
          await this.processPullRequestOpened(prData);
          break;
        case 'closed':
          if (payload.pull_request.merged) {
            await this.processPullRequestMerged(prData);
          } else {
            await this.processPullRequestClosed(prData);
          }
          break;
        case 'review_requested':
          await this.processPullRequestReviewRequested(prData);
          break;
        default:
          console.log(`Unhandled PR action: ${payload.action}`);
      }
    } catch (error) {
      console.error('Error handling pull request event:', error);
    }
  }

  private async handlePushEvent(payload: any): Promise<void> {
    try {
      const pushData = {
        repository: payload.repository.full_name,
        ref: payload.ref,
        commits: payload.commits.length,
        author: payload.pusher.name,
        timestamp: new Date()
      };

      // Process push event (could trigger metrics recalculation)
      await this.processPushEvent(pushData);
    } catch (error) {
      console.error('Error handling push event:', error);
    }
  }

  private async handleDeploymentEvent(payload: any): Promise<void> {
    try {
      const deploymentData = {
        repository: payload.repository.full_name,
        deploymentId: payload.deployment.id,
        environment: payload.deployment.environment,
        ref: payload.deployment.ref,
        sha: payload.deployment.sha,
        createdAt: new Date(payload.deployment.created_at)
      };

      await this.processDeploymentEvent(deploymentData);
    } catch (error) {
      console.error('Error handling deployment event:', error);
    }
  }

  private async handleDeploymentStatusEvent(payload: any): Promise<void> {
    try {
      const statusData = {
        repository: payload.repository.full_name,
        deploymentId: payload.deployment.id,
        status: payload.deployment_status.state,
        environment: payload.deployment.environment,
        updatedAt: new Date(payload.deployment_status.updated_at)
      };

      await this.processDeploymentStatusEvent(statusData);
    } catch (error) {
      console.error('Error handling deployment status event:', error);
    }
  }

  private async handleRepositoryEvent(payload: any): Promise<void> {
    try {
      const repoData = {
        repository: payload.repository.full_name,
        action: payload.action,
        repositoryId: payload.repository.id,
        isPrivate: payload.repository.private,
        language: payload.repository.language
      };

      await this.processRepositoryEvent(repoData);
    } catch (error) {
      console.error('Error handling repository event:', error);
    }
  }

  private async handleSecurityAlertEvent(payload: any): Promise<void> {
    try {
      const alertData = {
        repository: payload.repository.full_name,
        action: payload.action,
        alert: payload.alert
      };

      await this.processSecurityAlertEvent(alertData);
    } catch (error) {
      console.error('Error handling security alert event:', error);
    }
  }

  // Processing methods (these would typically update database or trigger other services)
  private async processPullRequestOpened(data: any): Promise<void> {
    console.log('Processing PR opened:', data);
    // TODO: Update metrics, trigger notifications, etc.
  }

  private async processPullRequestMerged(data: any): Promise<void> {
    console.log('Processing PR merged:', data);
    // TODO: Calculate lead time, update velocity metrics, etc.
  }

  private async processPullRequestClosed(data: any): Promise<void> {
    console.log('Processing PR closed:', data);
    // TODO: Update metrics
  }

  private async processPullRequestReviewRequested(data: any): Promise<void> {
    console.log('Processing PR review requested:', data);
    // TODO: Track review metrics
  }

  private async processPushEvent(data: any): Promise<void> {
    console.log('Processing push event:', data);
    // TODO: Update commit metrics, trigger builds, etc.
  }

  private async processDeploymentEvent(data: any): Promise<void> {
    console.log('Processing deployment event:', data);
    // TODO: Track deployment frequency
  }

  private async processDeploymentStatusEvent(data: any): Promise<void> {
    console.log('Processing deployment status event:', data);
    // TODO: Update deployment success rate, calculate recovery time
  }

  private async processRepositoryEvent(data: any): Promise<void> {
    console.log('Processing repository event:', data);
    // TODO: Update repository information
  }

  private async processSecurityAlertEvent(data: any): Promise<void> {
    console.log('Processing security alert event:', data);
    // TODO: Update security metrics
  }

  // Middleware for Express
  public getMiddleware() {
    if (!this.webhooks) {
      throw new Error('Webhooks not initialized');
    }
    return createNodeMiddleware(this.webhooks);
  }

  // Manual webhook verification (alternative to middleware)
  public verifySignature(payload: string, signature: string): boolean {
    const config = gitHubConfig.getConfig();
    if (!config.webhookSecret) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', config.webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(`sha256=${expectedSignature}`, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  }

  // Process webhook manually
  public async processWebhook(
    eventName: string,
    payload: any,
    signature: string
  ): Promise<void> {
    if (!this.webhooks) {
      throw new Error('Webhooks not initialized');
    }

    // Verify signature
    if (!this.verifySignature(JSON.stringify(payload), signature)) {
      throw new Error('Invalid webhook signature');
    }

    // Process the webhook
    await this.webhooks.receive({
      id: Date.now().toString(),
      name: eventName as any,
      payload,
    });
  }
}

export const webhookService = WebhookService.getInstance();