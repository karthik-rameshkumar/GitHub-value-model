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

// Value Calculator schemas
export const AILeverageInputSchema = z.object({
  potentialTimeSavingsHours: z.number().min(0).max(168), // Can't save more than hours in a week
  averageHourlySalary: z.number().min(0).max(1000), // Reasonable salary range
  totalEngineeringStaff: z.number().int().min(1).max(10000), // Reasonable team size
  activeAIUsers: z.number().int().min(0).max(10000), // Can't exceed total staff
  aiToolCostWeekly: z.number().min(0).max(1000000), // Reasonable cost range
});

export const EfficiencyCalculatorInputSchema = z.object({
  costPerDeployment: z.number().min(0),
  deploymentFrequencyImprovement: z.number().min(0).max(1000), // percentage
  timeToMarketReduction: z.number().min(0).max(100), // percentage
  incidentCostAvoidance: z.number().min(0),
  technicalDebtReduction: z.number().min(0),
  securityImprovementValue: z.number().min(0),
  velocityImprovement: z.number().min(0).max(1000), // percentage
  contextSwitchingReduction: z.number().min(0).max(100), // percentage
  meetingTimeOptimization: z.number().min(0).max(100), // percentage
});

export const RevenueImpactInputSchema = z.object({
  fasterFeatureDelivery: z.object({
    averageFeatureRevenue: z.number().min(0),
    timeReductionWeeks: z.number().min(0).max(52),
    featuresPerQuarter: z.number().int().min(0).max(1000),
  }),
  customerRetentionImprovement: z.object({
    incidentReduction: z.number().min(0).max(100), // percentage
    customerLifetimeValue: z.number().min(0),
    churnRateImprovement: z.number().min(0).max(100), // percentage
  }),
  capacityIncrease: z.object({
    additionalFeatureCapacity: z.number().min(0).max(1000), // percentage
    revenuePerFeature: z.number().min(0),
  }),
});

export const CostSavingsInputSchema = z.object({
  incidentResponseImprovement: z.object({
    averageIncidentCost: z.number().min(0),
    incidentReductionPercentage: z.number().min(0).max(100),
    recoveryTimeImprovement: z.number().min(0).max(100), // percentage
  }),
  retentionImprovement: z.object({
    averageRecruitmentCost: z.number().min(0),
    turnoverReductionPercentage: z.number().min(0).max(100),
    onboardingCostSavings: z.number().min(0),
  }),
  infrastructureEfficiency: z.object({
    cloudCostReduction: z.number().min(0),
    resourceUtilizationImprovement: z.number().min(0).max(100), // percentage
  }),
});

export const ScenarioModelSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000),
  parameters: z.object({
    aiAdoptionRate: z.number().min(0).max(100),
    toolingInvestment: z.number().min(0),
    trainingInvestment: z.number().min(0),
    expectedImprovements: z.object({
      velocityIncrease: z.number().min(0).max(1000),
      qualityImprovement: z.number().min(0).max(100),
      satisfactionIncrease: z.number().min(0).max(100),
    }),
  }),
});

export const FinancialModelingInputSchema = z.object({
  initialInvestment: z.number().min(0),
  discountRate: z.number().min(0).max(1), // Discount rate as decimal (0.1 for 10%)
  timeHorizonYears: z.number().int().min(1).max(20),
  cashFlows: z.array(z.number()).min(1).max(20),
});

// Type exports for value calculator
export type AILeverageInputType = z.infer<typeof AILeverageInputSchema>;
export type EfficiencyCalculatorInputType = z.infer<typeof EfficiencyCalculatorInputSchema>;
export type RevenueImpactInputType = z.infer<typeof RevenueImpactInputSchema>;
export type CostSavingsInputType = z.infer<typeof CostSavingsInputSchema>;
export type ScenarioModelType = z.infer<typeof ScenarioModelSchema>;
export type FinancialModelingInputType = z.infer<typeof FinancialModelingInputSchema>;