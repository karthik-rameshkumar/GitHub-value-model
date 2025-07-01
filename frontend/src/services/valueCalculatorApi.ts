import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Value Calculator API Service
export class ValueCalculatorApiService {
  private static axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // AI Leverage Calculator
  static async calculateAILeverage(input: {
    potentialTimeSavingsHours: number;
    averageHourlySalary: number;
    totalEngineeringStaff: number;
    activeAIUsers: number;
    aiToolCostWeekly: number;
  }) {
    try {
      const response = await this.axiosInstance.post('/v1/value-calculator/ai-leverage', input);
      return response.data;
    } catch (error) {
      console.error('Error calculating AI leverage:', error);
      throw error;
    }
  }

  // Engineering Efficiency Calculator
  static async calculateEngineeringEfficiency(input: {
    costPerDeployment: number;
    deploymentFrequencyImprovement: number;
    timeToMarketReduction: number;
    incidentCostAvoidance: number;
    technicalDebtReduction: number;
    securityImprovementValue: number;
    velocityImprovement: number;
    contextSwitchingReduction: number;
    meetingTimeOptimization: number;
  }) {
    try {
      const response = await this.axiosInstance.post('/v1/value-calculator/engineering-efficiency', input);
      return response.data;
    } catch (error) {
      console.error('Error calculating engineering efficiency:', error);
      throw error;
    }
  }

  // Revenue Impact Calculator
  static async calculateRevenueImpact(input: {
    fasterFeatureDelivery: {
      averageFeatureRevenue: number;
      timeReductionWeeks: number;
      featuresPerQuarter: number;
    };
    customerRetentionImprovement: {
      incidentReduction: number;
      customerLifetimeValue: number;
      churnRateImprovement: number;
    };
    capacityIncrease: {
      additionalFeatureCapacity: number;
      revenuePerFeature: number;
    };
  }) {
    try {
      const response = await this.axiosInstance.post('/v1/value-calculator/revenue-impact', input);
      return response.data;
    } catch (error) {
      console.error('Error calculating revenue impact:', error);
      throw error;
    }
  }

  // Cost Savings Calculator
  static async calculateCostSavings(input: {
    incidentResponseImprovement: {
      averageIncidentCost: number;
      incidentReductionPercentage: number;
      recoveryTimeImprovement: number;
    };
    retentionImprovement: {
      averageRecruitmentCost: number;
      turnoverReductionPercentage: number;
      onboardingCostSavings: number;
    };
    infrastructureEfficiency: {
      cloudCostReduction: number;
      resourceUtilizationImprovement: number;
    };
  }) {
    try {
      const response = await this.axiosInstance.post('/v1/value-calculator/cost-savings', input);
      return response.data;
    } catch (error) {
      console.error('Error calculating cost savings:', error);
      throw error;
    }
  }

  // Comprehensive Report
  static async generateComprehensiveReport(input: {
    aiLeverage: any;
    efficiency: any;
    revenueImpact: any;
    costSavings: any;
    financialModeling?: any;
  }) {
    try {
      const response = await this.axiosInstance.post('/v1/value-calculator/comprehensive-report', input);
      return response.data;
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      throw error;
    }
  }

  // Dashboard APIs
  static async getExecutiveSummary(teamId?: string) {
    try {
      const params = teamId ? { teamId } : {};
      const response = await this.axiosInstance.get('/v1/value-dashboard/executive-summary', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching executive summary:', error);
      throw error;
    }
  }

  static async getInvestmentTracking() {
    try {
      const response = await this.axiosInstance.get('/v1/value-dashboard/investment-tracking');
      return response.data;
    } catch (error) {
      console.error('Error fetching investment tracking:', error);
      throw error;
    }
  }

  static async getPredictiveAnalytics(timeframe: string = '12m') {
    try {
      const response = await this.axiosInstance.get('/v1/value-dashboard/predictive-analytics', {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching predictive analytics:', error);
      throw error;
    }
  }

  static async getScenarioAnalysis() {
    try {
      const response = await this.axiosInstance.get('/v1/value-dashboard/scenario-analysis');
      return response.data;
    } catch (error) {
      console.error('Error fetching scenario analysis:', error);
      throw error;
    }
  }
}

export default ValueCalculatorApiService;