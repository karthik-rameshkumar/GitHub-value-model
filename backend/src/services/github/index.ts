// Main GitHub service aggregator
export { githubClient, GitHubApiClient } from './client';
export { gitHubConfig, GitHubConfigManager } from './config';
export { pullRequestService, PullRequestService } from './pullRequests';
export { deploymentService, DeploymentService } from './deployments';
export { securityService, SecurityService } from './security';
export { copilotService, CopilotService } from './copilot';
export { webhookService, WebhookService } from './webhooks';
export { repositoryService, RepositoryService } from './repositories';

// Data transformation utilities
export class DataTransformationService {
  public static calculateESSPMetrics(data: {
    pullRequestMetrics: any;
    deploymentMetrics: any;
    securityMetrics: any;
    copilotMetrics: any;
  }) {
    return {
      deploymentFrequency: data.deploymentMetrics.frequency,
      leadTimeForChanges: data.pullRequestMetrics.leadTime,
      changeFailureRate: data.deploymentMetrics.rollback_rate,
      timeToRestoreService: data.deploymentMetrics.duration,
      codeQuality: data.securityMetrics.codeQualityScore,
      developerProductivity: data.copilotMetrics.acceptanceRate
    };
  }

  public static aggregateTeamMetrics(teamRepositories: string[], metrics: any[]) {
    // Aggregate metrics across multiple repositories for a team
    return metrics.reduce((acc, metric) => {
      // Sum numeric values, average rates
      Object.keys(metric).forEach(key => {
        if (typeof metric[key] === 'number') {
          acc[key] = (acc[key] || 0) + metric[key];
        }
      });
      return acc;
    }, {});
  }
}

export const dataTransformation = DataTransformationService;