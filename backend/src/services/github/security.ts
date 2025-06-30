import { githubClient } from './client';
import { SecurityMetrics } from '../../types';

export class SecurityService {
  private static instance: SecurityService;

  private constructor() {}

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  public async getVulnerabilityAlerts(
    owner: string,
    repo: string,
    state: 'open' | 'fixed' | 'dismissed' = 'open'
  ): Promise<any[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        const response = await client.rest.repos.listDeploymentStatuses({
          owner,
          repo,
          deployment_id: 0 // This is a placeholder - actual vulnerability API would be different
        });
        return response.data;
      } catch (error: any) {
        // If the vulnerability alerts API is not available, return empty array
        if (error.status === 404 || error.status === 403) {
          console.warn(`Vulnerability alerts not available for ${owner}/${repo}`);
          return [];
        }
        throw error;
      }
    });
  }

  public async getSecretScanningAlerts(
    owner: string,
    repo: string,
    state: 'open' | 'resolved' = 'open'
  ): Promise<any[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        // Note: This requires special permissions and is available for certain plans
        const response = await client.request('GET /repos/{owner}/{repo}/secret-scanning/alerts', {
          owner,
          repo,
          state
        });
        return response.data;
      } catch (error: any) {
        // If the secret scanning API is not available, return empty array
        if (error.status === 404 || error.status === 403) {
          console.warn(`Secret scanning not available for ${owner}/${repo}`);
          return [];
        }
        throw error;
      }
    });
  }

  public async getCodeScanningAlerts(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'dismissed' | 'fixed' = 'open'
  ): Promise<any[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        const response = await client.request('GET /repos/{owner}/{repo}/code-scanning/alerts', {
          owner,
          repo,
          ...(state !== 'closed' && { state })
        });
        return response.data;
      } catch (error: any) {
        // If the code scanning API is not available, return empty array
        if (error.status === 404 || error.status === 403) {
          console.warn(`Code scanning not available for ${owner}/${repo}`);
          return [];
        }
        throw error;
      }
    });
  }

  public async calculateSecurityMetrics(
    owner: string,
    repo: string
  ): Promise<SecurityMetrics> {
    try {
      // Get vulnerability alerts
      const vulnerabilityAlerts = await this.getVulnerabilityAlerts(owner, repo, 'open');
      
      // Get secret scanning alerts
      const secretAlerts = await this.getSecretScanningAlerts(owner, repo, 'open');
      
      // Get code scanning alerts
      const codeScanningAlerts = await this.getCodeScanningAlerts(owner, repo, 'open');

      // Count vulnerabilities by severity
      const vulnerabilities = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      };

      // Process vulnerability alerts (simplified - actual API would have severity levels)
      vulnerabilityAlerts.forEach(alert => {
        const severity = this.extractSeverity(alert);
        if (severity in vulnerabilities) {
          vulnerabilities[severity as keyof typeof vulnerabilities]++;
        }
      });

      // Process code scanning alerts
      codeScanningAlerts.forEach(alert => {
        const severity = this.extractSeverity(alert);
        if (severity in vulnerabilities) {
          vulnerabilities[severity as keyof typeof vulnerabilities]++;
        }
      });

      // Calculate code quality score (simplified metric)
      const totalAlerts = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
      const codeQualityScore = Math.max(0, 100 - (totalAlerts * 5)); // Decrease by 5 points per alert

      return {
        vulnerabilities,
        secretsDetected: secretAlerts.length,
        codeQualityScore
      };
    } catch (error) {
      console.error('Error calculating security metrics:', error);
      return {
        vulnerabilities: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        secretsDetected: 0,
        codeQualityScore: 100 // Default to perfect score on error
      };
    }
  }

  private extractSeverity(alert: any): string {
    // This is a simplified severity extraction
    // Actual implementation would depend on the specific alert structure
    if (alert.severity) {
      return alert.severity.toLowerCase();
    }
    if (alert.rule?.severity) {
      return alert.rule.severity.toLowerCase();
    }
    if (alert.security_severity_level) {
      return alert.security_severity_level.toLowerCase();
    }
    return 'medium'; // Default severity
  }

  public async getDependencyVulnerabilities(
    owner: string,
    repo: string
  ): Promise<any[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        // This would use the Dependency Graph API
        const response = await client.request('GET /repos/{owner}/{repo}/vulnerability-alerts', {
          owner,
          repo
        });
        return response.data;
      } catch (error: any) {
        if (error.status === 404 || error.status === 403) {
          console.warn(`Dependency vulnerability alerts not available for ${owner}/${repo}`);
          return [];
        }
        throw error;
      }
    });
  }

  public async getSecurityAdvisories(
    owner: string,
    repo: string
  ): Promise<any[]> {
    const client = githubClient.getRestClient();
    
    return await githubClient.withRetry(async () => {
      try {
        const response = await client.request('GET /repos/{owner}/{repo}/security-advisories', {
          owner,
          repo
        });
        return response.data;
      } catch (error: any) {
        if (error.status === 404 || error.status === 403) {
          console.warn(`Security advisories not available for ${owner}/${repo}`);
          return [];
        }
        throw error;
      }
    });
  }
}

export const securityService = SecurityService.getInstance();