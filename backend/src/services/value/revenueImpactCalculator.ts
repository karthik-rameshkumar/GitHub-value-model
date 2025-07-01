import { 
  RevenueImpactInput, 
  RevenueImpactResult 
} from '../../types';

export class RevenueImpactCalculatorService {
  static calculateRevenueImpact(input: RevenueImpactInput): RevenueImpactResult {
    // Calculate time-to-market revenue impact
    const timeToMarketRevenue = this.calculateTimeToMarketRevenue(input.fasterFeatureDelivery);
    
    // Calculate customer retention revenue impact
    const retentionRevenue = this.calculateRetentionRevenue(input.customerRetentionImprovement);
    
    // Calculate capacity increase revenue impact
    const capacityRevenue = this.calculateCapacityRevenue(input.capacityIncrease);
    
    const totalRevenueImpact = timeToMarketRevenue + retentionRevenue + capacityRevenue;
    const quarterlyProjection = totalRevenueImpact * 13; // 13 weeks per quarter
    const annualProjection = totalRevenueImpact * 52; // 52 weeks per year

    return {
      timeToMarketRevenue,
      retentionRevenue,
      capacityRevenue,
      totalRevenueImpact,
      quarterlyProjection,
      annualProjection
    };
  }

  private static calculateTimeToMarketRevenue(fasterFeatureDelivery: RevenueImpactInput['fasterFeatureDelivery']): number {
    const { averageFeatureRevenue, timeReductionWeeks, featuresPerQuarter } = fasterFeatureDelivery;
    
    // Calculate weekly feature delivery rate
    const weeklyFeatureRate = featuresPerQuarter / 13; // 13 weeks per quarter
    
    // Calculate revenue from accelerated delivery
    // Time reduction allows for earlier revenue realization
    const acceleratedRevenue = weeklyFeatureRate * averageFeatureRevenue * (timeReductionWeeks / 13);
    
    return acceleratedRevenue;
  }

  private static calculateRetentionRevenue(customerRetentionImprovement: RevenueImpactInput['customerRetentionImprovement']): number {
    const { incidentReduction, customerLifetimeValue, churnRateImprovement } = customerRetentionImprovement;
    
    // Estimate customer base affected (simplified model)
    const estimatedCustomerBase = 1000; // This would come from actual data in production
    
    // Calculate revenue from reduced churn
    const churnReductionRevenue = (churnRateImprovement / 100) * (estimatedCustomerBase * customerLifetimeValue / 52);
    
    // Calculate revenue from incident reduction (customer satisfaction impact)
    const incidentImpactRevenue = (incidentReduction / 100) * (customerLifetimeValue * 0.05); // 5% CLV impact per week
    
    return churnReductionRevenue + incidentImpactRevenue;
  }

  private static calculateCapacityRevenue(capacityIncrease: RevenueImpactInput['capacityIncrease']): number {
    const { additionalFeatureCapacity, revenuePerFeature } = capacityIncrease;
    
    // Calculate weekly feature capacity baseline (assumed)
    const baselineWeeklyFeatures = 1; // This would come from actual metrics
    
    // Calculate additional weekly revenue from increased capacity
    const additionalWeeklyFeatures = baselineWeeklyFeatures * (additionalFeatureCapacity / 100);
    const additionalRevenue = additionalWeeklyFeatures * revenuePerFeature;
    
    return additionalRevenue;
  }

  static generateInsights(result: RevenueImpactResult): string[] {
    const insights: string[] = [];

    // Overall revenue impact insights
    if (result.annualProjection > 5000000) {
      insights.push('Exceptional annual revenue impact exceeding $5M');
    } else if (result.annualProjection > 1000000) {
      insights.push('Significant annual revenue impact exceeding $1M');
    } else if (result.annualProjection > 500000) {
      insights.push('Substantial annual revenue impact exceeding $500K');
    } else if (result.annualProjection > 100000) {
      insights.push('Meaningful annual revenue impact exceeding $100K');
    } else {
      insights.push('Limited revenue impact - consider strategy optimization');
    }

    // Revenue source analysis
    const total = result.totalRevenueImpact;
    if (total > 0) {
      const timeToMarketPercentage = (result.timeToMarketRevenue / total) * 100;
      const retentionPercentage = (result.retentionRevenue / total) * 100;
      const capacityPercentage = (result.capacityRevenue / total) * 100;

      if (timeToMarketPercentage > 50) {
        insights.push('Time-to-market improvements are the primary revenue driver');
      } else if (retentionPercentage > 50) {
        insights.push('Customer retention improvements are the primary revenue driver');
      } else if (capacityPercentage > 50) {
        insights.push('Increased development capacity is the primary revenue driver');
      } else {
        insights.push('Balanced revenue impact across all improvement areas');
      }
    }

    // Quarterly performance insights
    if (result.quarterlyProjection > 1000000) {
      insights.push('Strong quarterly revenue potential exceeding $1M');
    } else if (result.quarterlyProjection > 250000) {
      insights.push('Good quarterly revenue potential exceeding $250K');
    }

    return insights;
  }

  static generateRecommendations(result: RevenueImpactResult, input: RevenueImpactInput): string[] {
    const recommendations: string[] = [];

    // Time-to-market recommendations
    if (result.timeToMarketRevenue < result.totalRevenueImpact * 0.3) {
      recommendations.push('Focus on reducing feature delivery time through process optimization');
      recommendations.push('Implement continuous delivery practices to accelerate time-to-market');
    }

    // Customer retention recommendations
    if (result.retentionRevenue < result.totalRevenueImpact * 0.3) {
      recommendations.push('Invest in quality improvements to enhance customer satisfaction');
      recommendations.push('Implement proactive monitoring to prevent customer-impacting incidents');
    }

    // Capacity recommendations
    if (result.capacityRevenue < result.totalRevenueImpact * 0.3) {
      recommendations.push('Optimize development processes to increase feature delivery capacity');
      recommendations.push('Consider team expansion or productivity tooling investments');
    }

    // Specific improvement recommendations
    if (input.fasterFeatureDelivery.timeReductionWeeks < 2) {
      recommendations.push('Identify opportunities for greater time-to-market acceleration');
    }

    if (input.customerRetentionImprovement.churnRateImprovement < 5) {
      recommendations.push('Develop targeted customer retention strategies');
    }

    if (input.capacityIncrease.additionalFeatureCapacity < 20) {
      recommendations.push('Explore automation opportunities to increase development capacity');
    }

    // Investment prioritization
    if (result.annualProjection > 1000000) {
      recommendations.push('Consider scaling successful improvements across additional teams');
      recommendations.push('Allocate resources to sustain and amplify revenue-generating improvements');
    }

    return recommendations;
  }

  static calculateRevenueMetrics(input: RevenueImpactInput): {
    timeToMarketEffectiveness: number;
    retentionEffectiveness: number;
    capacityEffectiveness: number;
    overallEffectiveness: number;
  } {
    const result = this.calculateRevenueImpact(input);
    const maxPossibleWeeklyRevenue = 100000; // Theoretical maximum weekly revenue impact

    return {
      timeToMarketEffectiveness: Math.min((result.timeToMarketRevenue / (maxPossibleWeeklyRevenue * 0.4)) * 100, 100),
      retentionEffectiveness: Math.min((result.retentionRevenue / (maxPossibleWeeklyRevenue * 0.3)) * 100, 100),
      capacityEffectiveness: Math.min((result.capacityRevenue / (maxPossibleWeeklyRevenue * 0.3)) * 100, 100),
      overallEffectiveness: Math.min((result.totalRevenueImpact / maxPossibleWeeklyRevenue) * 100, 100)
    };
  }
}