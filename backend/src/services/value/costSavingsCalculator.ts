import { 
  CostSavingsInput, 
  CostSavingsResult 
} from '../../types';

export class CostSavingsCalculatorService {
  static calculateCostSavings(input: CostSavingsInput): CostSavingsResult {
    // Calculate incident response savings
    const incidentSavings = this.calculateIncidentSavings(input.incidentResponseImprovement);
    
    // Calculate retention/recruitment savings
    const retentionSavings = this.calculateRetentionSavings(input.retentionImprovement);
    
    // Calculate infrastructure savings
    const infrastructureSavings = this.calculateInfrastructureSavings(input.infrastructureEfficiency);
    
    const totalCostSavings = incidentSavings + retentionSavings + infrastructureSavings;
    const monthlyRecurringSavings = totalCostSavings * 4.33; // Weekly to monthly
    const annualizedSavings = totalCostSavings * 52; // Weekly to annual

    return {
      incidentSavings,
      retentionSavings,
      infrastructureSavings,
      totalCostSavings,
      monthlyRecurringSavings,
      annualizedSavings
    };
  }

  private static calculateIncidentSavings(incidentResponseImprovement: CostSavingsInput['incidentResponseImprovement']): number {
    const { averageIncidentCost, incidentReductionPercentage, recoveryTimeImprovement } = incidentResponseImprovement;
    
    // Estimate weekly incident frequency (would come from actual data in production)
    const averageWeeklyIncidents = 2;
    
    // Calculate savings from reduced incidents
    const incidentReductionSavings = averageWeeklyIncidents * averageIncidentCost * (incidentReductionPercentage / 100);
    
    // Calculate savings from faster recovery times
    const recoveryTimeSavings = averageWeeklyIncidents * averageIncidentCost * 0.3 * (recoveryTimeImprovement / 100);
    
    return incidentReductionSavings + recoveryTimeSavings;
  }

  private static calculateRetentionSavings(retentionImprovement: CostSavingsInput['retentionImprovement']): number {
    const { averageRecruitmentCost, turnoverReductionPercentage, onboardingCostSavings } = retentionImprovement;
    
    // Estimate baseline turnover rate (would come from actual data)
    const baselineWeeklyTurnover = 0.25; // Approximately 13% annual turnover
    
    // Calculate recruitment savings from reduced turnover
    const recruitmentSavings = baselineWeeklyTurnover * averageRecruitmentCost * (turnoverReductionPercentage / 100);
    
    // Add direct onboarding savings
    const weeklyOnboardingSavings = onboardingCostSavings / 52; // Annualized to weekly
    
    return recruitmentSavings + weeklyOnboardingSavings;
  }

  private static calculateInfrastructureSavings(infrastructureEfficiency: CostSavingsInput['infrastructureEfficiency']): number {
    const { cloudCostReduction, resourceUtilizationImprovement } = infrastructureEfficiency;
    
    // Direct cloud cost reduction (already calculated as weekly savings)
    const directCloudSavings = cloudCostReduction / 52; // Assume input is annual, convert to weekly
    
    // Estimate savings from improved resource utilization
    const utilizationSavings = resourceUtilizationImprovement * 100; // Simplified calculation
    
    return directCloudSavings + utilizationSavings;
  }

  static generateInsights(result: CostSavingsResult): string[] {
    const insights: string[] = [];

    // Overall cost savings insights
    if (result.annualizedSavings > 2000000) {
      insights.push('Exceptional annual cost savings exceeding $2M');
    } else if (result.annualizedSavings > 1000000) {
      insights.push('Significant annual cost savings exceeding $1M');
    } else if (result.annualizedSavings > 500000) {
      insights.push('Substantial annual cost savings exceeding $500K');
    } else if (result.annualizedSavings > 100000) {
      insights.push('Meaningful annual cost savings exceeding $100K');
    } else {
      insights.push('Limited cost savings - consider strategy optimization');
    }

    // Savings source analysis
    const total = result.totalCostSavings;
    if (total > 0) {
      const incidentPercentage = (result.incidentSavings / total) * 100;
      const retentionPercentage = (result.retentionSavings / total) * 100;
      const infrastructurePercentage = (result.infrastructureSavings / total) * 100;

      if (incidentPercentage > 50) {
        insights.push('Incident response improvements are the primary cost savings driver');
      } else if (retentionPercentage > 50) {
        insights.push('Employee retention improvements are the primary cost savings driver');
      } else if (infrastructurePercentage > 50) {
        insights.push('Infrastructure optimization is the primary cost savings driver');
      } else {
        insights.push('Balanced cost savings across all improvement areas');
      }
    }

    // Monthly recurring savings insights
    if (result.monthlyRecurringSavings > 100000) {
      insights.push('Strong monthly recurring savings exceeding $100K');
    } else if (result.monthlyRecurringSavings > 50000) {
      insights.push('Good monthly recurring savings exceeding $50K');
    } else if (result.monthlyRecurringSavings > 25000) {
      insights.push('Moderate monthly recurring savings exceeding $25K');
    }

    return insights;
  }

  static generateRecommendations(result: CostSavingsResult, input: CostSavingsInput): string[] {
    const recommendations: string[] = [];

    // Incident response recommendations
    if (result.incidentSavings < result.totalCostSavings * 0.3) {
      recommendations.push('Implement proactive monitoring and incident prevention measures');
      recommendations.push('Invest in automated incident response and recovery systems');
    }

    // Retention recommendations
    if (result.retentionSavings < result.totalCostSavings * 0.3) {
      recommendations.push('Develop comprehensive employee satisfaction and retention programs');
      recommendations.push('Optimize onboarding processes to reduce time-to-productivity');
    }

    // Infrastructure recommendations
    if (result.infrastructureSavings < result.totalCostSavings * 0.3) {
      recommendations.push('Implement cloud cost optimization and resource rightsizing');
      recommendations.push('Deploy infrastructure monitoring and automated scaling solutions');
    }

    // Specific improvement recommendations
    if (input.incidentResponseImprovement.incidentReductionPercentage < 25) {
      recommendations.push('Focus on root cause analysis to prevent recurring incidents');
    }

    if (input.retentionImprovement.turnoverReductionPercentage < 20) {
      recommendations.push('Conduct employee satisfaction surveys to identify retention issues');
    }

    if (input.infrastructureEfficiency.resourceUtilizationImprovement < 30) {
      recommendations.push('Implement infrastructure optimization tools and practices');
    }

    // Investment prioritization
    if (result.annualizedSavings > 500000) {
      recommendations.push('Prioritize high-impact cost reduction initiatives');
      recommendations.push('Consider scaling successful cost optimization practices');
    }

    return recommendations;
  }

  static calculateSavingsMetrics(input: CostSavingsInput): {
    incidentEfficiency: number;
    retentionEfficiency: number;
    infrastructureEfficiency: number;
    overallEfficiency: number;
  } {
    const result = this.calculateCostSavings(input);
    const maxPossibleWeeklySavings = 50000; // Theoretical maximum weekly cost savings

    return {
      incidentEfficiency: Math.min((result.incidentSavings / (maxPossibleWeeklySavings * 0.4)) * 100, 100),
      retentionEfficiency: Math.min((result.retentionSavings / (maxPossibleWeeklySavings * 0.3)) * 100, 100),
      infrastructureEfficiency: Math.min((result.infrastructureSavings / (maxPossibleWeeklySavings * 0.3)) * 100, 100),
      overallEfficiency: Math.min((result.totalCostSavings / maxPossibleWeeklySavings) * 100, 100)
    };
  }

  static calculatePaybackPeriod(totalInvestment: number, result: CostSavingsResult): number {
    if (result.totalCostSavings <= 0) {
      return Infinity;
    }
    return totalInvestment / result.totalCostSavings; // Payback period in weeks
  }

  static calculateBreakEvenAnalysis(
    initialInvestment: number,
    ongoingCosts: number,
    result: CostSavingsResult
  ): {
    breakEvenWeeks: number;
    netSavingsFirstYear: number;
    cumulativeSavingsThreeYears: number;
  } {
    const weeklyNetSavings = result.totalCostSavings - (ongoingCosts / 52);
    const breakEvenWeeks = weeklyNetSavings > 0 ? initialInvestment / weeklyNetSavings : Infinity;
    const netSavingsFirstYear = (weeklyNetSavings * 52) - initialInvestment;
    const cumulativeSavingsThreeYears = (weeklyNetSavings * 52 * 3) - initialInvestment - (ongoingCosts * 3);

    return {
      breakEvenWeeks,
      netSavingsFirstYear,
      cumulativeSavingsThreeYears
    };
  }
}