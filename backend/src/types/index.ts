export interface Metric {
  id: string;
  metricType: string;
  zone: 'quality' | 'velocity' | 'happiness' | 'business';
  value: number;
  teamId: string;
  projectId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  githubOrganization?: string;
  members: TeamMember[];
  repositories: string[];
  settings?: TeamSettings;
}

export interface TeamMember {
  id: string;
  username: string;
  role: 'lead' | 'member';
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface TeamSettings {
  notifications?: {
    email: boolean;
    slack: boolean;
  };
  thresholds?: {
    deploymentFrequency: number;
    leadTime: number;
    recoveryTime: number;
    changeFailureRate: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  status: 'active' | 'archived' | 'planned';
  repositories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  teamId: string;
  projectId?: string;
  status: 'active' | 'archived';
  lastDeployment?: Date;
  githubId?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  githubId?: number;
  role: 'admin' | 'team_lead' | 'developer';
}

export interface GitHubConfig {
  id: string;
  clientId: string;
  clientSecret: string;
  webhookSecret?: string;
  organization?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string; // Add token field for auth responses
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// GitHub API Integration Types
export interface PullRequestMetrics {
  leadTime: number;           // Time from first commit to merge
  reviewTime: number;         // Time spent in review
  mergeRate: number;         // PRs merged vs total PRs
  averageSize: number;       // Lines of code changed
  reviewerCount: number;     // Average number of reviewers
}

export interface DeploymentMetrics {
  frequency: number;         // Deployments per day/week
  success_rate: number;      // Successful deployments %
  duration: number;          // Average deployment time
  rollback_rate: number;     // Percentage of rollbacks
}

export interface SecurityMetrics {
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  secretsDetected: number;
  codeQualityScore: number;
}

export interface CopilotMetrics {
  acceptanceRate: number;    // Acceptance rate of suggestions
  usagePatterns: {
    dailyActiveUsers: number;
    suggestionsShown: number;
    suggestionsAccepted: number;
  };
  timeSavings: number;      // Estimated time saved in hours
  adoption: {
    teamCoverage: number;   // Percentage of team using Copilot
  };
}

export interface LeadTimeData {
  prNumber: number;
  firstCommitTime: Date;
  mergeTime: Date;
  leadTimeHours: number;
  repository: string;
  author: string;
}

export interface ChangeFailureData {
  deploymentId: string;
  deploymentTime: Date;
  isFailure: boolean;
  recoveryTime?: Date;
  repository: string;
  environment: string;
}

export interface GitHubRepository {
  id: number;
  nodeId: string;
  name: string;
  fullName: string;
  description?: string | null;
  language?: string | null;
  defaultBranch: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  pushedAt?: Date | null;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: Date;
  updatedAt: Date;
  mergedAt?: Date;
  closedAt?: Date;
  author: string;
  repository: string;
  additions: number;
  deletions: number;
  reviewers: string[];
  reviewComments: number;
}

export interface GitHubDeployment {
  id: number;
  sha: string;
  ref: string;
  environment: string;
  status: 'pending' | 'success' | 'failure' | 'error' | 'in_progress';
  createdAt: Date;
  updatedAt: Date;
  repository: string;
}

export interface GitHubWebhookPayload {
  action: string;
  repository: GitHubRepository;
  [key: string]: any;
}