import request from 'supertest';
import app from '../index';

describe('Value Calculator API', () => {
  describe('POST /api/v1/value-calculator/ai-leverage', () => {
    const validInput = {
      potentialTimeSavingsHours: 8,
      averageHourlySalary: 75,
      totalEngineeringStaff: 50,
      activeAIUsers: 35,
      aiToolCostWeekly: 1200
    };

    it('should calculate AI leverage successfully', async () => {
      const response = await request(app)
        .post('/api/v1/value-calculator/ai-leverage')
        .send(validInput)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.calculation).toBeDefined();
      expect(response.body.data.insights).toBeDefined();
      expect(response.body.data.recommendations).toBeDefined();

      // Check calculation values
      expect(response.body.data.calculation.weeklyValue).toBe(21000);
      expect(response.body.data.calculation.weeklyCost).toBe(1200);
      expect(response.body.data.calculation.yearlyValue).toBe(1092000);
    });

    it('should return 400 for invalid input', async () => {
      const invalidInput = {
        ...validInput,
        potentialTimeSavingsHours: -1 // Invalid negative value
      };

      const response = await request(app)
        .post('/api/v1/value-calculator/ai-leverage')
        .send(invalidInput)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when activeAIUsers exceeds totalEngineeringStaff', async () => {
      const invalidInput = {
        ...validInput,
        activeAIUsers: 60,
        totalEngineeringStaff: 50
      };

      const response = await request(app)
        .post('/api/v1/value-calculator/ai-leverage')
        .send(invalidInput)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Active AI users cannot exceed total engineering staff');
    });
  });

  describe('POST /api/v1/value-calculator/engineering-efficiency', () => {
    const validInput = {
      costPerDeployment: 500,
      deploymentFrequencyImprovement: 50,
      timeToMarketReduction: 25,
      incidentCostAvoidance: 5000,
      technicalDebtReduction: 10000,
      securityImprovementValue: 3000,
      velocityImprovement: 30,
      contextSwitchingReduction: 20,
      meetingTimeOptimization: 15
    };

    it('should calculate engineering efficiency successfully', async () => {
      const response = await request(app)
        .post('/api/v1/value-calculator/engineering-efficiency')
        .send(validInput)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.calculation).toBeDefined();
      expect(response.body.data.insights).toBeDefined();
      expect(response.body.data.recommendations).toBeDefined();
      expect(response.body.data.metrics).toBeDefined();

      // Check that we have some efficiency gains
      expect(response.body.data.calculation.totalEfficiencyGain).toBeGreaterThan(0);
      expect(response.body.data.calculation.annualizedValue).toBeGreaterThan(0);
    });

    it('should return 400 for invalid input', async () => {
      const invalidInput = {
        ...validInput,
        costPerDeployment: -100 // Invalid negative value
      };

      const response = await request(app)
        .post('/api/v1/value-calculator/engineering-efficiency')
        .send(invalidInput)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/value-calculator/comprehensive-report', () => {
    const validInput = {
      aiLeverage: {
        potentialTimeSavingsHours: 8,
        averageHourlySalary: 75,
        totalEngineeringStaff: 50,
        activeAIUsers: 35,
        aiToolCostWeekly: 1200
      },
      efficiency: {
        costPerDeployment: 500,
        deploymentFrequencyImprovement: 50,
        timeToMarketReduction: 25,
        incidentCostAvoidance: 5000,
        technicalDebtReduction: 10000,
        securityImprovementValue: 3000,
        velocityImprovement: 30,
        contextSwitchingReduction: 20,
        meetingTimeOptimization: 15
      },
      revenueImpact: {
        fasterFeatureDelivery: {
          averageFeatureRevenue: 50000,
          timeReductionWeeks: 2,
          featuresPerQuarter: 12
        },
        customerRetentionImprovement: {
          incidentReduction: 30,
          customerLifetimeValue: 100000,
          churnRateImprovement: 5
        },
        capacityIncrease: {
          additionalFeatureCapacity: 25,
          revenuePerFeature: 45000
        }
      },
      costSavings: {
        incidentResponseImprovement: {
          averageIncidentCost: 15000,
          incidentReductionPercentage: 40,
          recoveryTimeImprovement: 50
        },
        retentionImprovement: {
          averageRecruitmentCost: 50000,
          turnoverReductionPercentage: 25,
          onboardingCostSavings: 20000
        },
        infrastructureEfficiency: {
          cloudCostReduction: 100000,
          resourceUtilizationImprovement: 30
        }
      }
    };

    it('should generate comprehensive report successfully', async () => {
      const response = await request(app)
        .post('/api/v1/value-calculator/comprehensive-report')
        .send(validInput)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.report).toBeDefined();
      expect(response.body.data.dashboardMetrics).toBeDefined();

      // Check report structure
      const report = response.body.data.report;
      expect(report.executiveSummary).toBeDefined();
      expect(report.detailedAnalysis).toBeDefined();
      expect(report.actionableInsights).toBeDefined();
      expect(report.financialProjections).toBeDefined();

      // Check executive summary
      expect(report.executiveSummary.totalValue).toBeGreaterThan(0);
      expect(report.executiveSummary.roi).toBeGreaterThan(0);
      expect(report.executiveSummary.keyMetrics).toBeInstanceOf(Array);
      expect(report.executiveSummary.recommendations).toBeInstanceOf(Array);

      // Check detailed analysis
      expect(report.detailedAnalysis.aiLeverage).toBeDefined();
      expect(report.detailedAnalysis.efficiency).toBeDefined();
      expect(report.detailedAnalysis.revenueImpact).toBeDefined();
      expect(report.detailedAnalysis.costSavings).toBeDefined();

      // Check dashboard metrics
      const dashboardMetrics = response.body.data.dashboardMetrics;
      expect(dashboardMetrics.executiveKPIs).toBeDefined();
      expect(dashboardMetrics.investmentMetrics).toBeDefined();
      expect(dashboardMetrics.predictiveMetrics).toBeDefined();
    });

    it('should return 400 for invalid input structure', async () => {
      const invalidInput = {
        aiLeverage: {
          // Missing required fields
        }
      };

      const response = await request(app)
        .post('/api/v1/value-calculator/comprehensive-report')
        .send(invalidInput)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/value-dashboard/executive-summary', () => {
    it('should return executive summary dashboard data', async () => {
      const response = await request(app)
        .get('/api/v1/value-dashboard/executive-summary')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalValue).toBeGreaterThan(0);
      expect(response.body.data.roi).toBeGreaterThan(0);
      expect(response.body.data.keyMetrics).toBeInstanceOf(Array);
      expect(response.body.data.recommendations).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/value-dashboard/investment-tracking', () => {
    it('should return investment tracking data', async () => {
      const response = await request(app)
        .get('/api/v1/value-dashboard/investment-tracking')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.toolAndPlatformCosts).toBeDefined();
      expect(response.body.data.trainingAndOnboarding).toBeDefined();
      expect(response.body.data.infrastructureInvestment).toBeDefined();
      expect(response.body.data.timeInvestment).toBeDefined();
      expect(response.body.data.budgetAllocation).toBeDefined();
    });
  });

  describe('GET /api/v1/value-dashboard/predictive-analytics', () => {
    it('should return predictive analytics data', async () => {
      const response = await request(app)
        .get('/api/v1/value-dashboard/predictive-analytics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.projections).toBeInstanceOf(Array);
      expect(response.body.data.scenarios).toBeInstanceOf(Array);
      expect(response.body.data.benchmarks).toBeDefined();
      expect(response.body.data.breakEvenAnalysis).toBeDefined();
      expect(response.body.data.trendAnalysis).toBeDefined();
    });

    it('should support different timeframes', async () => {
      const response = await request(app)
        .get('/api/v1/value-dashboard/predictive-analytics?timeframe=6m')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.projections).toBeInstanceOf(Array);
      expect(response.body.data.projections.length).toBeLessThanOrEqual(2); // 6 months = 2 quarters
    });
  });
});