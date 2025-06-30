import { z } from 'zod';

// Enums
export const MetricZoneSchema = z.enum(['quality', 'velocity', 'happiness', 'business']);
export const UserRoleSchema = z.enum(['admin', 'team_lead', 'developer']);
export const TeamRoleSchema = z.enum(['lead', 'member']);
export const StatusSchema = z.enum(['active', 'archived', 'planned']);

// Metric schemas
export const CreateMetricSchema = z.object({
  metricType: z.string().min(1).max(100),
  zone: MetricZoneSchema,
  value: z.number(),
  teamId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export const UpdateMetricSchema = z.object({
  metricType: z.string().min(1).max(100).optional(),
  zone: MetricZoneSchema.optional(),
  value: z.number().optional(),
  teamId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

// Team schemas
export const CreateTeamSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  githubOrganization: z.string().max(255).optional(),
});

export const UpdateTeamSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  githubOrganization: z.string().max(255).optional(),
});

// Project schemas
export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  teamId: z.string().uuid(),
  status: StatusSchema.optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  teamId: z.string().uuid().optional(),
  status: StatusSchema.optional(),
});

// Repository schemas
export const CreateRepositorySchema = z.object({
  name: z.string().min(1).max(255),
  fullName: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  language: z.string().max(100).optional(),
  teamId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  githubId: z.number().optional(),
});

// GitHub Config schemas
export const CreateGitHubConfigSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  webhookSecret: z.string().optional(),
  organization: z.string().optional(),
});

export const UpdateGitHubConfigSchema = z.object({
  clientId: z.string().min(1).optional(),
  clientSecret: z.string().min(1).optional(),
  webhookSecret: z.string().optional(),
  organization: z.string().optional(),
});

// Authentication schemas
export const LoginSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
});

export const MetricQuerySchema = PaginationSchema.extend({
  zone: MetricZoneSchema.optional(),
  teamId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  metricType: z.string().optional(),
});

export const TeamQuerySchema = PaginationSchema.extend({
  status: StatusSchema.optional(),
});

export const ProjectQuerySchema = PaginationSchema.extend({
  teamId: z.string().uuid().optional(),
  status: StatusSchema.optional(),
});

export const RepositoryQuerySchema = PaginationSchema.extend({
  teamId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  status: z.enum(['active', 'archived', 'all']).optional(),
});

// Type exports
export type CreateMetricInput = z.infer<typeof CreateMetricSchema>;
export type UpdateMetricInput = z.infer<typeof UpdateMetricSchema>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>;
export type CreateGitHubConfigInput = z.infer<typeof CreateGitHubConfigSchema>;
export type UpdateGitHubConfigInput = z.infer<typeof UpdateGitHubConfigSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type MetricQueryInput = z.infer<typeof MetricQuerySchema>;
export type TeamQueryInput = z.infer<typeof TeamQuerySchema>;
export type ProjectQueryInput = z.infer<typeof ProjectQuerySchema>;
export type RepositoryQueryInput = z.infer<typeof RepositoryQuerySchema>;