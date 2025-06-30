import { githubClient } from './client';
import { CopilotMetrics } from '../../types';

export class CopilotService {
  private static instance: CopilotService;

  private constructor() {}

  public static getInstance(): CopilotService {
    if (!CopilotService.instance) {
      CopilotService.instance = new CopilotService();
    }
    return CopilotService.instance;
  }

  public async getCopilotUsage(
    org: string,
    since?: string,
    until?: string
  ): Promise<any> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        // Note: This requires GitHub Copilot Business/Enterprise and specific permissions
        const response = await client.request('GET /orgs/{org}/copilot/usage', {
          org,
          since,
          until
        });
        return response.data;
      } catch (error: any) {
        if (error.status === 404 || error.status === 403) {
          console.warn(`Copilot usage data not available for organization ${org}`);
          return null;
        }
        throw error;
      }
    });
  }

  public async getCopilotSeatInformation(org: string): Promise<any> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        const response = await client.request('GET /orgs/{org}/copilot/billing', {
          org
        });
        return response.data;
      } catch (error: any) {
        if (error.status === 404 || error.status === 403) {
          console.warn(`Copilot billing information not available for organization ${org}`);
          return null;
        }
        throw error;
      }
    });
  }

  public async calculateCopilotMetrics(
    org: string,
    since?: string,
    until?: string
  ): Promise<CopilotMetrics> {
    try {
      const usage = await this.getCopilotUsage(org, since, until);
      const seatInfo = await this.getCopilotSeatInformation(org);

      if (!usage || !seatInfo) {
        return this.getDefaultMetrics();
      }

      // Calculate acceptance rate
      const totalSuggestions = usage.total_suggestions_count || 0;
      const acceptedSuggestions = usage.total_acceptances_count || 0;
      const acceptanceRate = totalSuggestions > 0 
        ? (acceptedSuggestions / totalSuggestions) * 100 
        : 0;

      // Calculate usage patterns
      const usagePatterns = {
        dailyActiveUsers: usage.total_active_users || 0,
        suggestionsShown: totalSuggestions,
        suggestionsAccepted: acceptedSuggestions
      };

      // Estimate time savings (simplified calculation)
      // Assuming each accepted suggestion saves ~30 seconds on average
      const timeSavings = (acceptedSuggestions * 0.5) / 60; // Convert to hours

      // Calculate adoption rate
      const totalSeats = seatInfo.seats_created || 0;
      const activeUsers = usage.total_active_users || 0;
      const teamCoverage = totalSeats > 0 ? (activeUsers / totalSeats) * 100 : 0;

      return {
        acceptanceRate,
        usagePatterns,
        timeSavings,
        adoption: {
          teamCoverage
        }
      };
    } catch (error) {
      console.error('Error calculating Copilot metrics:', error);
      return this.getDefaultMetrics();
    }
  }

  private getDefaultMetrics(): CopilotMetrics {
    return {
      acceptanceRate: 0,
      usagePatterns: {
        dailyActiveUsers: 0,
        suggestionsShown: 0,
        suggestionsAccepted: 0
      },
      timeSavings: 0,
      adoption: {
        teamCoverage: 0
      }
    };
  }

  public async getCopilotMetricsDetailed(
    org: string,
    since?: string,
    until?: string
  ): Promise<any> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        // Get detailed metrics including breakdown by editor, language, etc.
        const response = await client.request('GET /orgs/{org}/copilot/metrics', {
          org,
          since,
          until
        });
        return response.data;
      } catch (error: any) {
        if (error.status === 404 || error.status === 403) {
          console.warn(`Detailed Copilot metrics not available for organization ${org}`);
          return null;
        }
        throw error;
      }
    });
  }

  public async getUserCopilotUsage(
    org: string,
    username: string,
    since?: string,
    until?: string
  ): Promise<any> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        const response = await client.request('GET /orgs/{org}/members/{username}/copilot', {
          org,
          username,
          since,
          until
        });
        return response.data;
      } catch (error: any) {
        if (error.status === 404 || error.status === 403) {
          console.warn(`Copilot usage for user ${username} not available`);
          return null;
        }
        throw error;
      }
    });
  }

  public async calculateProductivityImpact(
    org: string,
    since?: string,
    until?: string
  ): Promise<{
    timesSaved: number;
    productivityIncrease: number;
    codeQualityImpact: number;
  }> {
    const metrics = await this.calculateCopilotMetrics(org, since, until);
    const detailedMetrics = await this.getCopilotMetricsDetailed(org, since, until);

    // Calculate productivity impact based on acceptance rate and usage
    const productivityIncrease = metrics.acceptanceRate * 0.3; // Simplified calculation

    // Estimate code quality impact based on acceptance patterns
    const codeQualityImpact = metrics.acceptanceRate > 50 ? 15 : 
                             metrics.acceptanceRate > 30 ? 10 : 5;

    return {
      timesSaved: metrics.timeSavings,
      productivityIncrease,
      codeQualityImpact
    };
  }
}

export const copilotService = CopilotService.getInstance();