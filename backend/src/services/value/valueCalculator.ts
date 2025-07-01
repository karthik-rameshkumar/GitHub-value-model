import {
  AILeverageInput,
  EfficiencyCalculatorInput,
  RevenueImpactInput,
  CostSavingsInput,
  ScenarioModel,
  ValueReport,
  FinancialModelingInput
} from '../../types';

import { AILeverageCalculatorService } from './aiLeverageCalculator';
import { EfficiencyCalculatorService } from './efficiencyCalculator';
import { RevenueImpactCalculatorService } from './revenueImpactCalculator';
import { CostSavingsCalculatorService } from './costSavingsCalculator';
import { FinancialModelingService } from './financialModeling';

export class ValueCalculatorService {
  static generateExecutiveSummary(
    aiLeverageInput: AILeverageInput,
    efficiencyInput: EfficiencyCalculatorInput,
    revenueInput: RevenueImpactInput,
    costSavingsInput: CostSavingsInput
  ): ValueReport['executiveSummary'] {
    // Calculate all components
    const aiResult = AILeverageCalculatorService.calculateAILeverage(aiLeverageInput);
    const efficiencyResult = EfficiencyCalculatorService.calculateEfficiencyGains(efficiencyInput);
    const revenueResult = RevenueImpactCalculatorService.calculateRevenueImpact(revenueInput);
    const costSavingsResult = CostSavingsCalculatorService.calculateCostSavings(costSavingsInput);

    // Calculate total value
    const totalWeeklyValue = 
      aiResult.weeklyValue + 
      efficiencyResult.totalEfficiencyGain + 
      revenueResult.totalRevenueImpact + 
      costSavingsResult.totalCostSavings;

    const totalAnnualValue = totalWeeklyValue * 52;

    // Calculate overall ROI
    const totalWeeklyCost = aiResult.weeklyCost;
    const totalAnnualCost = totalWeeklyCost * 52;
    const roi = totalAnnualCost > 0 ? ((totalAnnualValue - totalAnnualCost) / totalAnnualCost) * 100 : 0;

    // Generate key metrics
    const keyMetrics = [
      `Total Annual Value: $${totalAnnualValue.toLocaleString()}`,
      `ROI: ${roi.toFixed(1)}%`,
      `Weekly Value Generation: $${totalWeeklyValue.toLocaleString()}`,
      `AI Leverage ROI: ${aiResult.yearlyROI.toFixed(1)}%`,
      `Efficiency Gains: $${efficiencyResult.annualizedValue.toLocaleString()}`,
      `Revenue Impact: $${revenueResult.annualProjection.toLocaleString()}`,
      `Cost Savings: $${costSavingsResult.annualizedSavings.toLocaleString()}`
    ];

    // Generate recommendations
    const recommendations = [
      ...this.generateStrategicRecommendations(totalAnnualValue, roi),
      ...this.generateComponentRecommendations(aiResult, efficiencyResult, revenueResult, costSavingsResult)
    ];

    return {
      totalValue: totalAnnualValue,
      roi,
      keyMetrics,
      recommendations
    };
  }

  private static generateStrategicRecommendations(totalValue: number, roi: number): string[] {
    const recommendations: string[] = [];

    if (roi > 500) {
      recommendations.push('Exceptional ROI warrants immediate scaling across organization');
    } else if (roi > 200) {
      recommendations.push('Strong ROI supports expanded investment and team growth');
    } else if (roi > 100) {
      recommendations.push('Positive ROI indicates viable program worth continued investment');
    } else if (roi > 0) {
      recommendations.push('Marginal ROI suggests need for optimization and efficiency improvements');
    } else {
      recommendations.push('Negative ROI requires immediate strategy reassessment');
    }

    if (totalValue > 5000000) {
      recommendations.push('Million-dollar impact justifies executive sponsorship and resources');
    } else if (totalValue > 1000000) {
      recommendations.push('Significant value creation supports dedicated program management');
    }

    return recommendations;
  }

  private static generateComponentRecommendations(
    aiResult: any,
    efficiencyResult: any,
    revenueResult: any,
    costSavingsResult: any
  ): string[] {
    const recommendations: string[] = [];
    const totalValue = aiResult.yearlyValue + efficiencyResult.annualizedValue + 
                      revenueResult.annualProjection + costSavingsResult.annualizedSavings;

    // Identify top performing component
    const components = [
      { name: 'AI Leverage', value: aiResult.yearlyValue },
      { name: 'Efficiency', value: efficiencyResult.annualizedValue },
      { name: 'Revenue', value: revenueResult.annualProjection },
      { name: 'Cost Savings', value: costSavingsResult.annualizedSavings }
    ];

    components.sort((a, b) => b.value - a.value);
    const topComponent = components[0];

    if (topComponent && topComponent.value > totalValue * 0.5) {
      recommendations.push(`${topComponent.name} is the primary value driver - focus on scaling this area`);
    } else {
      recommendations.push('Balanced value creation across multiple areas - maintain diversified approach');
    }

    // Component-specific recommendations
    if (aiResult.weeklyROI < 200) {
      recommendations.push('AI leverage has optimization potential - consider training and adoption initiatives');
    }

    if (efficiencyResult.totalEfficiencyGain < 20000) {
      recommendations.push('Efficiency gains have room for improvement - focus on process optimization');
    }

    return recommendations;
  }

  static generateComprehensiveReport(
    aiLeverageInput: AILeverageInput,
    efficiencyInput: EfficiencyCalculatorInput,
    revenueInput: RevenueImpactInput,
    costSavingsInput: CostSavingsInput,
    financialInput?: FinancialModelingInput
  ): ValueReport {
    // Calculate all components
    const aiLeverage = AILeverageCalculatorService.calculateAILeverage(aiLeverageInput);
    const efficiency = EfficiencyCalculatorService.calculateEfficiencyGains(efficiencyInput);
    const revenueImpact = RevenueImpactCalculatorService.calculateRevenueImpact(revenueInput);
    const costSavings = CostSavingsCalculatorService.calculateCostSavings(costSavingsInput);

    // Generate executive summary
    const executiveSummary = this.generateExecutiveSummary(
      aiLeverageInput, efficiencyInput, revenueInput, costSavingsInput
    );

    // Generate actionable insights
    const actionableInsights = {
      optimizationOpportunities: [
        ...AILeverageCalculatorService.generateInsights(aiLeverage),
        ...EfficiencyCalculatorService.generateInsights(efficiency),
        ...RevenueImpactCalculatorService.generateInsights(revenueImpact),
        ...CostSavingsCalculatorService.generateInsights(costSavings)
      ],
      investmentRecommendations: [
        ...AILeverageCalculatorService.generateRecommendations(aiLeverage, aiLeverageInput),
        ...EfficiencyCalculatorService.generateRecommendations(efficiency, efficiencyInput),
        ...RevenueImpactCalculatorService.generateRecommendations(revenueImpact, revenueInput),
        ...CostSavingsCalculatorService.generateRecommendations(costSavings, costSavingsInput)
      ],
      riskMitigation: this.generateRiskMitigationStrategies(aiLeverage, efficiency, revenueImpact, costSavings)
    };

    // Calculate financial projections
    let financialProjections = {
      npv: 0,
      irr: 0,
      paybackPeriod: 0,
      tco: 0
    };

    if (financialInput) {
      const financialResults = FinancialModelingService.calculateFinancialMetrics(financialInput);
      financialProjections = {
        npv: financialResults.npv,
        irr: financialResults.irr,
        paybackPeriod: financialResults.paybackPeriod,
        tco: FinancialModelingService.calculateTotalCostOfOwnership(
          financialInput.initialInvestment,
          50000, // Estimated operational costs
          25000, // Estimated maintenance costs
          10000, // Estimated training costs
          financialInput.timeHorizonYears,
          financialInput.discountRate
        )
      };
    }

    return {
      executiveSummary,
      detailedAnalysis: {
        aiLeverage,
        efficiency,
        revenueImpact,
        costSavings
      },
      actionableInsights,
      financialProjections
    };
  }

  private static generateRiskMitigationStrategies(
    aiResult: any,
    efficiencyResult: any,
    revenueResult: any,
    costSavingsResult: any
  ): string[] {
    const strategies: string[] = [];

    // AI-specific risks
    if (aiResult.weeklyROI > 1000) {
      strategies.push('High AI ROI may indicate over-optimistic assumptions - validate with pilot programs');
    }

    // Efficiency risks
    if (efficiencyResult.totalEfficiencyGain > 50000) {
      strategies.push('Large efficiency gains require change management and training support');
    }

    // Revenue risks
    if (revenueResult.totalRevenueImpact > 100000) {
      strategies.push('Significant revenue projections require market validation and customer feedback');
    }

    // Cost savings risks
    if (costSavingsResult.totalCostSavings > 25000) {
      strategies.push('Major cost savings may face organizational resistance - plan phased implementation');
    }

    // General risk mitigation
    strategies.push('Implement continuous monitoring and measurement systems');
    strategies.push('Establish baseline metrics before implementing changes');
    strategies.push('Plan for gradual rollout to minimize disruption');
    strategies.push('Create feedback loops for rapid course correction');

    return strategies;
  }

  static createScenarioModel(
    name: string,
    description: string,
    parameters: ScenarioModel['parameters']
  ): ScenarioModel {
    // Calculate projected outcomes based on parameters
    const baseROI = 150; // Base ROI percentage
    const adoptionMultiplier = parameters.aiAdoptionRate / 100;
    const investmentMultiplier = Math.log(parameters.toolingInvestment + parameters.trainingInvestment + 1) / 10;
    const improvementMultiplier = (
      parameters.expectedImprovements.velocityIncrease +
      parameters.expectedImprovements.qualityImprovement +
      parameters.expectedImprovements.satisfactionIncrease
    ) / 300;

    const projectedROI = baseROI * adoptionMultiplier * (1 + investmentMultiplier) * (1 + improvementMultiplier);
    const paybackPeriod = Math.max(1, 24 - (projectedROI / 10)); // Weeks

    // Identify risk factors
    const riskFactors: string[] = [];
    if (parameters.aiAdoptionRate < 50) {
      riskFactors.push('Low adoption rate may limit value realization');
    }
    if (parameters.toolingInvestment < 10000) {
      riskFactors.push('Insufficient tooling investment may impact effectiveness');
    }
    if (parameters.trainingInvestment < 5000) {
      riskFactors.push('Limited training investment may slow adoption');
    }
    if (parameters.expectedImprovements.velocityIncrease < 20) {
      riskFactors.push('Conservative velocity expectations may underestimate benefits');
    }

    return {
      name,
      description,
      parameters,
      projectedOutcomes: {
        roi: projectedROI,
        paybackPeriod,
        riskFactors
      }
    };
  }

  static compareScenarios(scenarios: ScenarioModel[]): {
    bestROI: ScenarioModel;
    fastestPayback: ScenarioModel;
    lowestRisk: ScenarioModel;
    recommended: ScenarioModel;
  } {
    const bestROI = scenarios.reduce((best, current) => 
      current.projectedOutcomes.roi > best.projectedOutcomes.roi ? current : best
    );

    const fastestPayback = scenarios.reduce((fastest, current) => 
      current.projectedOutcomes.paybackPeriod < fastest.projectedOutcomes.paybackPeriod ? current : fastest
    );

    const lowestRisk = scenarios.reduce((lowest, current) => 
      current.projectedOutcomes.riskFactors.length < lowest.projectedOutcomes.riskFactors.length ? current : lowest
    );

    // Recommended scenario balances ROI, payback, and risk
    const recommended = scenarios.reduce((best, current) => {
      const currentScore = (current.projectedOutcomes.roi / 100) - 
                          (current.projectedOutcomes.paybackPeriod / 52) - 
                          (current.projectedOutcomes.riskFactors.length * 0.2);
      const bestScore = (best.projectedOutcomes.roi / 100) - 
                       (best.projectedOutcomes.paybackPeriod / 52) - 
                       (best.projectedOutcomes.riskFactors.length * 0.2);
      return currentScore > bestScore ? current : best;
    });

    return { bestROI, fastestPayback, lowestRisk, recommended };
  }

  static generateDashboardMetrics(report: ValueReport): {
    executiveKPIs: Record<string, number>;
    investmentMetrics: Record<string, number>;
    predictiveMetrics: Record<string, number>;
  } {
    const executiveKPIs = {
      totalAnnualValue: report.executiveSummary.totalValue,
      overallROI: report.executiveSummary.roi,
      weeklyValueGeneration: report.executiveSummary.totalValue / 52,
      paybackPeriod: report.financialProjections.paybackPeriod,
      netPresentValue: report.financialProjections.npv
    };

    const investmentMetrics = {
      aiInvestmentROI: report.detailedAnalysis.aiLeverage.yearlyROI,
      efficiencyGains: report.detailedAnalysis.efficiency.annualizedValue,
      revenueImpact: report.detailedAnalysis.revenueImpact.annualProjection,
      costSavings: report.detailedAnalysis.costSavings.annualizedSavings,
      totalCostOfOwnership: report.financialProjections.tco
    };

    const predictiveMetrics = {
      projectedGrowthRate: Math.min(report.executiveSummary.roi / 10, 100),
      riskScore: Math.max(0, 100 - report.actionableInsights.riskMitigation.length * 10),
      valueAcceleration: report.detailedAnalysis.aiLeverage.weeklyROI / 10,
      sustainabilityIndex: Math.min(report.financialProjections.irr * 100, 100),
      confidenceLevel: 85 // Would be calculated based on data quality and assumptions
    };

    return { executiveKPIs, investmentMetrics, predictiveMetrics };
  }
}