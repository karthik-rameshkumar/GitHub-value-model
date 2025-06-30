import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import { createAppAuth } from '@octokit/auth-app';
import { gitHubConfig, GitHubServiceConfig } from './config';
import { GitHubRepository, GitHubPullRequest, GitHubDeployment } from '../../types';

export class GitHubApiClient {
  private static instance: GitHubApiClient;
  private octokitRest: Octokit | null = null;
  private octokitGraphQL: typeof graphql | null = null;
  private config: GitHubServiceConfig;

  private constructor() {
    this.config = gitHubConfig.getConfig();
    this.initializeClients();
  }

  public static getInstance(): GitHubApiClient {
    if (!GitHubApiClient.instance) {
      GitHubApiClient.instance = new GitHubApiClient();
    }
    return GitHubApiClient.instance;
  }

  private async initializeClients(): Promise<void> {
    try {
      if (this.config.app?.appId && this.config.app?.privateKey) {
        // GitHub App authentication
        const auth = createAppAuth({
          appId: this.config.app.appId,
          privateKey: this.config.app.privateKey,
          ...(this.config.app.installationId && { installationId: this.config.app.installationId }),
        });

        this.octokitRest = new Octokit({
          auth,
          baseUrl: this.config.restApiUrl || 'https://api.github.com',
        });

        this.octokitGraphQL = graphql.defaults({
          baseUrl: this.config.graphqlApiUrl || 'https://api.github.com/graphql',
          request: {
            hook: auth.hook,
          },
        });
      } else if (this.config.oauth?.clientId && this.config.oauth?.clientSecret) {
        // OAuth App authentication
        const auth = createOAuthAppAuth({
          clientId: this.config.oauth.clientId,
          clientSecret: this.config.oauth.clientSecret,
        });

        this.octokitRest = new Octokit({
          auth,
          baseUrl: this.config.restApiUrl || 'https://api.github.com',
        });

        this.octokitGraphQL = graphql.defaults({
          baseUrl: this.config.graphqlApiUrl || 'https://api.github.com/graphql',
          request: {
            hook: auth.hook,
          },
        });
      } else {
        console.warn('GitHub API clients not configured - missing authentication credentials');
      }
    } catch (error) {
      console.error('Failed to initialize GitHub API clients:', error);
    }
  }

  public async reinitialize(): Promise<void> {
    this.config = gitHubConfig.getConfig();
    await this.initializeClients();
  }

  public isInitialized(): boolean {
    return this.octokitRest !== null && this.octokitGraphQL !== null;
  }

  public getRestClient(): Octokit {
    if (!this.octokitRest) {
      throw new Error('GitHub REST API client not initialized');
    }
    return this.octokitRest;
  }

  public getGraphQLClient(): typeof graphql {
    if (!this.octokitGraphQL) {
      throw new Error('GitHub GraphQL API client not initialized');
    }
    return this.octokitGraphQL;
  }

  // Rate limiting helper
  public async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.config.rateLimit?.maxRetries || 3
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a rate limit error
        if (error.status === 403 && error.message?.includes('rate limit')) {
          const resetTime = error.response?.headers?.['x-ratelimit-reset'];
          if (resetTime) {
            const waitTime = (parseInt(resetTime) * 1000) - Date.now();
            if (waitTime > 0) {
              console.log(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }
        }
        
        // Check if it's a secondary rate limit error
        if (error.status === 403 && error.message?.includes('secondary rate limit')) {
          const retryAfter = error.response?.headers?.['retry-after'];
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : this.config.rateLimit?.retryDelay || 1000;
          console.log(`Secondary rate limited. Waiting ${waitTime / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // For other errors, wait a bit before retrying
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Exponential backoff, max 30s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  // Health check method
  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isInitialized()) {
        return false;
      }
      
      await this.withRetry(async () => {
        await this.octokitRest!.rest.meta.get();
      });
      
      return true;
    } catch (error) {
      console.error('GitHub API health check failed:', error);
      return false;
    }
  }
}

export const githubClient = GitHubApiClient.getInstance();