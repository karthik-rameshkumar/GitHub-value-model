import { githubClient } from './client';
import { GitHubRepository } from '../../types';

export class RepositoryService {
  private static instance: RepositoryService;

  private constructor() {}

  public static getInstance(): RepositoryService {
    if (!RepositoryService.instance) {
      RepositoryService.instance = new RepositoryService();
    }
    return RepositoryService.instance;
  }

  public async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.repos.get({ owner, repo });
      const data = response.data;

      return {
        id: data.id,
        nodeId: data.node_id,
        name: data.name,
        fullName: data.full_name,
        description: data.description || null,
        language: data.language || null,
        defaultBranch: data.default_branch || 'main',
        isPrivate: data.private,
        createdAt: new Date(data.created_at || data.updated_at || Date.now()),
        updatedAt: new Date(data.updated_at || data.created_at || Date.now()),
        pushedAt: data.pushed_at ? new Date(data.pushed_at) : null
      };
    });
  }

  public async getRepositories(
    owner?: string,
    type: 'all' | 'owner' | 'member' = 'all',
    page: number = 1,
    perPage: number = 30
  ): Promise<GitHubRepository[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      let response;
      
      if (owner) {
        // Get repositories for a specific organization/user
        response = await client.rest.repos.listForOrg({
          org: owner,
          type: type === 'owner' ? 'public' : type as any,
          page,
          per_page: perPage
        });
      } else {
        // Get repositories for the authenticated user
        response = await client.rest.repos.listForAuthenticatedUser({
          type,
          page,
          per_page: perPage
        });
      }

      return response.data.map(repo => ({
        id: repo.id,
        nodeId: repo.node_id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || null,
        language: repo.language || null,
        defaultBranch: repo.default_branch || 'main',
        isPrivate: repo.private,
        createdAt: new Date(repo.created_at || repo.updated_at || Date.now()),
        updatedAt: new Date(repo.updated_at || repo.created_at || Date.now()),
        pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null
      }));
    });
  }

  public async getOrganizationRepositories(
    org: string,
    type: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member' = 'all',
    page: number = 1,
    perPage: number = 30
  ): Promise<GitHubRepository[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.repos.listForOrg({
        org,
        type,
        page,
        per_page: perPage
      });

      return response.data.map(repo => ({
        id: repo.id,
        nodeId: repo.node_id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || null,
        language: repo.language || null,
        defaultBranch: repo.default_branch || 'main',
        isPrivate: repo.private,
        createdAt: new Date(repo.created_at || repo.updated_at || Date.now()),
        updatedAt: new Date(repo.updated_at || repo.created_at || Date.now()),
        pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null
      }));
    });
  }

  public async getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.repos.listLanguages({ owner, repo });
      return response.data;
    });
  }

  public async getRepositoryTopics(owner: string, repo: string): Promise<string[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.repos.getAllTopics({ owner, repo });
      return response.data.names;
    });
  }

  public async getRepositoryContributors(
    owner: string,
    repo: string,
    page: number = 1,
    perPage: number = 30
  ): Promise<any[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.repos.listContributors({
        owner,
        repo,
        page,
        per_page: perPage
      });
      return response.data;
    });
  }

  public async getRepositoryStats(owner: string, repo: string): Promise<any> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const [codeFrequency, participation, commitActivity] = await Promise.allSettled([
        client.rest.repos.getCodeFrequencyStats({ owner, repo }),
        client.rest.repos.getParticipationStats({ owner, repo }),
        client.rest.repos.getCommitActivityStats({ owner, repo })
      ]);

      return {
        codeFrequency: codeFrequency.status === 'fulfilled' ? codeFrequency.value.data : null,
        participation: participation.status === 'fulfilled' ? participation.value.data : null,
        commitActivity: commitActivity.status === 'fulfilled' ? commitActivity.value.data : null
      };
    });
  }

  public async searchRepositories(
    query: string,
    sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated',
    order?: 'asc' | 'desc',
    page: number = 1,
    perPage: number = 30
  ): Promise<{ repositories: GitHubRepository[]; totalCount: number }> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.search.repos({
        q: query,
        ...(sort && { sort }),
        ...(order && { order }),
        page,
        per_page: perPage
      });

      const repositories = response.data.items.map(repo => ({
        id: repo.id,
        nodeId: repo.node_id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || null,
        language: repo.language || null,
        defaultBranch: repo.default_branch || 'main',
        isPrivate: repo.private,
        createdAt: new Date(repo.created_at || repo.updated_at || Date.now()),
        updatedAt: new Date(repo.updated_at || repo.created_at || Date.now()),
        pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null
      }));

      return {
        repositories,
        totalCount: response.data.total_count
      };
    });
  }

  public async syncRepository(owner: string, repo: string): Promise<{
    repository: GitHubRepository;
    stats: any;
    languages: Record<string, number>;
    topics: string[];
  }> {
    const [repository, stats, languages, topics] = await Promise.all([
      this.getRepository(owner, repo),
      this.getRepositoryStats(owner, repo),
      this.getRepositoryLanguages(owner, repo),
      this.getRepositoryTopics(owner, repo)
    ]);

    return {
      repository,
      stats,
      languages,
      topics
    };
  }
}

export const repositoryService = RepositoryService.getInstance();