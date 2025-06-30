import { githubClient } from './client';
import { GitHubDeployment, DeploymentMetrics, ChangeFailureData } from '../../types';

export class DeploymentService {
  private static instance: DeploymentService;

  private constructor() {}

  public static getInstance(): DeploymentService {
    if (!DeploymentService.instance) {
      DeploymentService.instance = new DeploymentService();
    }
    return DeploymentService.instance;
  }

  public async getDeployments(
    owner: string,
    repo: string,
    environment?: string,
    page: number = 1,
    perPage: number = 30
  ): Promise<GitHubDeployment[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.repos.listDeployments({
        owner,
        repo,
        ...(environment && { environment }),
        page,
        per_page: perPage
      });

      return response.data.map(deployment => ({
        id: deployment.id,
        sha: deployment.sha,
        ref: deployment.ref,
        environment: deployment.environment,
        status: 'pending' as const, // Will be updated with actual status
        createdAt: new Date(deployment.created_at),
        updatedAt: new Date(deployment.updated_at),
        repository: `${owner}/${repo}`
      }));
    });
  }

  public async getDeploymentStatus(
    owner: string,
    repo: string,
    deploymentId: number
  ): Promise<string> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.repos.listDeploymentStatuses({
        owner,
        repo,
        deployment_id: deploymentId
      });

      if (response.data.length === 0) {
        return 'pending';
      }

      // Get the most recent status
      const latestStatus = response.data[0];
      return latestStatus ? latestStatus.state : 'pending';
    });
  }

  public async getDeploymentsWithStatus(
    owner: string,
    repo: string,
    environment?: string,
    since?: Date,
    until?: Date
  ): Promise<GitHubDeployment[]> {
    let allDeployments: GitHubDeployment[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const deployments = await this.getDeployments(owner, repo, environment, page, 100);
      
      // Filter by date range if specified
      const filteredDeployments = deployments.filter(deployment => {
        if (since && deployment.createdAt < since) return false;
        if (until && deployment.createdAt > until) return false;
        return true;
      });
      
      // Get status for each deployment
      for (const deployment of filteredDeployments) {
        const status = await this.getDeploymentStatus(owner, repo, deployment.id);
        deployment.status = status as any;
      }
      
      allDeployments = allDeployments.concat(filteredDeployments);
      
      // If we got fewer than 100, we're done
      hasMore = deployments.length === 100;
      page++;
      
      // Stop if we've gone past our date range
      if (since && deployments.length > 0) {
        const lastDeployment = deployments[deployments.length - 1];
        if (lastDeployment && lastDeployment.createdAt < since) {
          hasMore = false;
        }
      }
    }

    return allDeployments;
  }

  public async calculateMetrics(
    owner: string,
    repo: string,
    environment?: string,
    since?: Date,
    until?: Date
  ): Promise<DeploymentMetrics> {
    const deployments = await this.getDeploymentsWithStatus(owner, repo, environment, since, until);

    if (deployments.length === 0) {
      return {
        frequency: 0,
        success_rate: 0,
        duration: 0,
        rollback_rate: 0
      };
    }

    // Calculate frequency (deployments per day)
    const timeRange = until && since 
      ? (until.getTime() - since.getTime()) / (1000 * 60 * 60 * 24)
      : 30; // Default to 30 days if no range specified
    
    const frequency = deployments.length / timeRange;

    // Calculate success rate
    const successfulDeployments = deployments.filter(d => 
      d.status === 'success' || d.status === 'in_progress'
    );
    const successRate = (successfulDeployments.length / deployments.length) * 100;

    // Calculate average duration (simplified - time between creation and last status update)
    const totalDuration = deployments.reduce((sum, deployment) => {
      const duration = (deployment.updatedAt.getTime() - deployment.createdAt.getTime()) / (1000 * 60); // in minutes
      return sum + duration;
    }, 0);
    const averageDuration = totalDuration / deployments.length;

    // Calculate rollback rate (deployments that failed)
    const failedDeployments = deployments.filter(d => 
      d.status === 'failure' || d.status === 'error'
    );
    const rollbackRate = (failedDeployments.length / deployments.length) * 100;

    return {
      frequency,
      success_rate: successRate,
      duration: averageDuration,
      rollback_rate: rollbackRate
    };
  }

  public async getChangeFailureData(
    owner: string,
    repo: string,
    environment?: string,
    since?: Date,
    until?: Date
  ): Promise<ChangeFailureData[]> {
    const deployments = await this.getDeploymentsWithStatus(owner, repo, environment, since, until);
    
    return deployments.map(deployment => ({
      deploymentId: deployment.id.toString(),
      deploymentTime: deployment.createdAt,
      isFailure: deployment.status === 'failure' || deployment.status === 'error',
      recoveryTime: deployment.status === 'failure' || deployment.status === 'error' 
        ? deployment.updatedAt 
        : null,
      repository: deployment.repository,
      environment: deployment.environment
    }));
  }

  public async calculateChangeFailureRate(
    owner: string,
    repo: string,
    environment?: string,
    since?: Date,
    until?: Date
  ): Promise<number> {
    const changeFailureData = await this.getChangeFailureData(owner, repo, environment, since, until);
    
    if (changeFailureData.length === 0) {
      return 0;
    }

    const failures = changeFailureData.filter(data => data.isFailure);
    return (failures.length / changeFailureData.length) * 100;
  }

  public async calculateMeanTimeToRecovery(
    owner: string,
    repo: string,
    environment?: string,
    since?: Date,
    until?: Date
  ): Promise<number> {
    const changeFailureData = await this.getChangeFailureData(owner, repo, environment, since, until);
    
    const failures = changeFailureData.filter(data => data.isFailure && data.recoveryTime);
    
    if (failures.length === 0) {
      return 0;
    }

    const totalRecoveryTime = failures.reduce((sum, failure) => {
      if (failure.recoveryTime) {
        return sum + (failure.recoveryTime.getTime() - failure.deploymentTime.getTime());
      }
      return sum;
    }, 0);

    // Return in hours
    return totalRecoveryTime / (failures.length * 1000 * 60 * 60);
  }
}

export const deploymentService = DeploymentService.getInstance();