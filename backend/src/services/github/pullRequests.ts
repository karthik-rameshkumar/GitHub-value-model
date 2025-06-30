import { githubClient } from './client';
import { GitHubPullRequest, PullRequestMetrics, LeadTimeData } from '../../types';

export class PullRequestService {
  private static instance: PullRequestService;

  private constructor() {}

  public static getInstance(): PullRequestService {
    if (!PullRequestService.instance) {
      PullRequestService.instance = new PullRequestService();
    }
    return PullRequestService.instance;
  }

  public async getPullRequests(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'all',
    page: number = 1,
    perPage: number = 30
  ): Promise<GitHubPullRequest[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const response = await client.rest.pulls.list({
        owner,
        repo,
        state,
        page,
        per_page: perPage,
        sort: 'updated',
        direction: 'desc'
      });

      return response.data.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state as 'open' | 'closed' | 'merged',
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
        mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
        closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
        author: pr.user?.login || 'unknown',
        repository: `${owner}/${repo}`,
        additions: 0, // Not available in list API, use getPullRequestDetails for actual values
        deletions: 0, // Not available in list API, use getPullRequestDetails for actual values
        reviewers: [], // Will be populated separately
        reviewComments: 0 // Will be populated separately
      }));
    });
  }

  public async getPullRequestDetails(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<GitHubPullRequest> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      // Get PR details
      const prResponse = await client.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
      });

      // Get review comments
      const reviewCommentsResponse = await client.rest.pulls.listReviewComments({
        owner,
        repo,
        pull_number: pullNumber
      });

      // Get reviews to find reviewers
      const reviewsResponse = await client.rest.pulls.listReviews({
        owner,
        repo,
        pull_number: pullNumber
      });

      const pr = prResponse.data;
      const reviewers = [...new Set(reviewsResponse.data.map(review => review.user?.login).filter(Boolean))];

      return {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state as 'open' | 'closed' | 'merged',
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
        mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
        closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
        author: pr.user?.login || 'unknown',
        repository: `${owner}/${repo}`,
        additions: 0, // Not available in list API, use getPullRequestDetails for actual values
        deletions: 0, // Not available in list API, use getPullRequestDetails for actual values
        reviewers: reviewers as string[],
        reviewComments: reviewCommentsResponse.data.length
      };
    });
  }

  public async calculateLeadTime(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<LeadTimeData | null> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      const pr = await this.getPullRequestDetails(owner, repo, pullNumber);
      
      if (!pr.mergedAt) {
        return null; // Can't calculate lead time for unmerged PRs
      }

      // Get commits for the PR
      const commitsResponse = await client.rest.pulls.listCommits({
        owner,
        repo,
        pull_number: pullNumber
      });

      if (commitsResponse.data.length === 0) {
        return null;
      }

      // Find the first commit
      const firstCommit = commitsResponse.data[0];
      if (!firstCommit) {
        return null;
      }
      
      const firstCommitTime = new Date(
        firstCommit.commit.author?.date || 
        firstCommit.commit.committer?.date || 
        pr.createdAt
      );
      
      const leadTimeHours = (pr.mergedAt.getTime() - firstCommitTime.getTime()) / (1000 * 60 * 60);

      return {
        prNumber: pr.number,
        firstCommitTime,
        mergeTime: pr.mergedAt,
        leadTimeHours,
        repository: pr.repository,
        author: pr.author
      };
    });
  }

  public async calculateMetrics(
    owner: string,
    repo: string,
    since?: Date,
    until?: Date
  ): Promise<PullRequestMetrics> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      // Get all PRs in the time range
      let allPRs: GitHubPullRequest[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const prs = await this.getPullRequests(owner, repo, 'all', page, 100);
        
        // Filter by date range if specified
        const filteredPRs = prs.filter(pr => {
          if (since && pr.createdAt < since) return false;
          if (until && pr.createdAt > until) return false;
          return true;
        });
        
        allPRs = allPRs.concat(filteredPRs);
        
        // If we got fewer than 100, we're done
        hasMore = prs.length === 100;
        page++;
        
        // Stop if we've gone past our date range
        if (since && prs.length > 0) {
          const lastPR = prs[prs.length - 1];
          if (lastPR && lastPR.createdAt < since) {
            hasMore = false;
          }
        }
      }

      if (allPRs.length === 0) {
        return {
          leadTime: 0,
          reviewTime: 0,
          mergeRate: 0,
          averageSize: 0,
          reviewerCount: 0
        };
      }

      // Calculate metrics
      const mergedPRs = allPRs.filter(pr => pr.state === 'closed' && pr.mergedAt);
      const totalPRs = allPRs.length;
      const mergeRate = totalPRs > 0 ? (mergedPRs.length / totalPRs) * 100 : 0;

      // Calculate average lead time
      let totalLeadTime = 0;
      let leadTimeCount = 0;
      
      for (const pr of mergedPRs) {
        const leadTimeData = await this.calculateLeadTime(owner, repo, pr.number);
        if (leadTimeData) {
          totalLeadTime += leadTimeData.leadTimeHours;
          leadTimeCount++;
        }
      }
      
      const averageLeadTime = leadTimeCount > 0 ? totalLeadTime / leadTimeCount : 0;

      // Calculate average review time (time from creation to merge for merged PRs)
      const averageReviewTime = mergedPRs.length > 0 
        ? mergedPRs.reduce((sum, pr) => {
            if (pr.mergedAt) {
              return sum + (pr.mergedAt.getTime() - pr.createdAt.getTime()) / (1000 * 60 * 60);
            }
            return sum;
          }, 0) / mergedPRs.length
        : 0;

      // Calculate average size (lines changed)
      const averageSize = allPRs.length > 0
        ? allPRs.reduce((sum, pr) => sum + pr.additions + pr.deletions, 0) / allPRs.length
        : 0;

      // Calculate average reviewer count
      const averageReviewerCount = allPRs.length > 0
        ? allPRs.reduce((sum, pr) => sum + pr.reviewers.length, 0) / allPRs.length
        : 0;

      return {
        leadTime: averageLeadTime,
        reviewTime: averageReviewTime,
        mergeRate,
        averageSize,
        reviewerCount: averageReviewerCount
      };
    });
  }
}

export const pullRequestService = PullRequestService.getInstance();