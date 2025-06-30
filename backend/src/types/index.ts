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