import { GitHubConfig } from '../../types';

export interface GitHubServiceConfig {
  restApiUrl?: string;
  graphqlApiUrl?: string;
  rateLimit?: {
    maxRetries: number;
    retryDelay: number;
  };
  oauth?: {
    clientId: string;
    clientSecret: string;
  };
  app?: {
    appId: string;
    privateKey: string;
    installationId?: string;
  };
  webhookSecret?: string;
  organization?: string;
}

export class GitHubConfigManager {
  private static instance: GitHubConfigManager;
  private config: GitHubServiceConfig = {};

  private constructor() {
    this.loadFromEnvironment();
  }

  public static getInstance(): GitHubConfigManager {
    if (!GitHubConfigManager.instance) {
      GitHubConfigManager.instance = new GitHubConfigManager();
    }
    return GitHubConfigManager.instance;
  }

  private loadFromEnvironment(): void {
    this.config = {
      restApiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
      graphqlApiUrl: process.env.GITHUB_GRAPHQL_URL || 'https://api.github.com/graphql',
      rateLimit: {
        maxRetries: parseInt(process.env.GITHUB_MAX_RETRIES || '3'),
        retryDelay: parseInt(process.env.GITHUB_RETRY_DELAY || '1000'),
      },
      oauth: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      },
      app: {
        appId: process.env.GITHUB_APP_ID || '',
        privateKey: process.env.GITHUB_PRIVATE_KEY || '',
        installationId: process.env.GITHUB_INSTALLATION_ID || undefined,
      },
      webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
      organization: process.env.GITHUB_ORGANIZATION || '',
    };
  }

  public getConfig(): GitHubServiceConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<GitHubServiceConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  public isConfigured(): boolean {
    return !!(
      (this.config.oauth?.clientId && this.config.oauth?.clientSecret) ||
      (this.config.app?.appId && this.config.app?.privateKey)
    );
  }

  public hasOAuthConfig(): boolean {
    return !!(this.config.oauth?.clientId && this.config.oauth?.clientSecret);
  }

  public hasAppConfig(): boolean {
    return !!(this.config.app?.appId && this.config.app?.privateKey);
  }
}

export const gitHubConfig = GitHubConfigManager.getInstance();