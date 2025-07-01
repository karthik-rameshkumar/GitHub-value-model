import { 
  EfficiencyCalculatorInput, 
  EfficiencyCalculatorResult 
} from '../../types';

export class EfficiencyCalculatorService {
  static calculateEfficiencyGains(input: EfficiencyCalculatorInput): EfficiencyCalculatorResult {
    // Calculate deployment savings
    const deploymentSavings = this.calculateDeploymentSavings(input);
    
    // Calculate quality-related savings
    const qualitySavings = this.calculateQualitySavings(input);
    
    // Calculate productivity savings
    const productivitySavings = this.calculateProductivitySavings(input);
    
    const totalEfficiencyGain = deploymentSavings + qualitySavings + productivitySavings;
    const annualizedValue = totalEfficiencyGain * 52; // Weekly to annual conversion

    return {
      totalEfficiencyGain,
      deploymentSavings,
      qualitySavings,
      productivitySavings,
      annualizedValue
    };
  }

  private static calculateDeploymentSavings(input: EfficiencyCalculatorInput): number {
    // Calculate savings from improved deployment frequency and reduced time to market
    const deploymentFrequencySavings = (input.deploymentFrequencyImprovement / 100) * input.costPerDeployment;
    const timeToMarketSavings = (input.timeToMarketReduction / 100) * 10000; // Estimated weekly value
    
    return deploymentFrequencySavings + timeToMarketSavings;
  }

  private static calculateQualitySavings(input: EfficiencyCalculatorInput): number {
    // Direct quality improvements translate to weekly savings
    return input.incidentCostAvoidance + input.technicalDebtReduction + input.securityImprovementValue;
  }

  private static calculateProductivitySavings(input: EfficiencyCalculatorInput): number {
    // Calculate savings from improved developer productivity
    const velocitySavings = (input.velocityImprovement / 100) * 15000; // Estimated weekly team value
    const contextSwitchingSavings = (input.contextSwitchingReduction / 100) * 5000; // Estimated weekly savings
    const meetingSavings = (input.meetingTimeOptimization / 100) * 3000; // Estimated weekly savings
    
    return velocitySavings + contextSwitchingSavings + meetingSavings;
  }

  static generateInsights(result: EfficiencyCalculatorResult): string[] {
    const insights: string[] = [];

    // Overall efficiency insights
    if (result.totalEfficiencyGain > 50000) {
      insights.push('Exceptional efficiency gains detected across multiple areas');
    } else if (result.totalEfficiencyGain > 25000) {
      insights.push('Strong efficiency improvements with significant impact');
    } else if (result.totalEfficiencyGain > 10000) {
      insights.push('Moderate efficiency gains with positive business impact');
    } else {
      insights.push('Limited efficiency gains - consider targeted improvements');
    }

    // Area-specific insights
    const totalGain = result.totalEfficiencyGain;
    if (totalGain > 0) {
      const deploymentPercentage = (result.deploymentSavings / totalGain) * 100;
      const qualityPercentage = (result.qualitySavings / totalGain) * 100;
      const productivityPercentage = (result.productivitySavings / totalGain) * 100;

      if (deploymentPercentage > 50) {
        insights.push('Deployment efficiency is the primary value driver');
      } else if (qualityPercentage > 50) {
        insights.push('Quality improvements are the primary value driver');
      } else if (productivityPercentage > 50) {
        insights.push('Developer productivity is the primary value driver');
      } else {
        insights.push('Balanced efficiency gains across all areas');
      }
    }

    // Annual projection insights
    if (result.annualizedValue > 1000000) {
      insights.push('Million-dollar annual efficiency value potential');
    } else if (result.annualizedValue > 500000) {
      insights.push('Substantial annual efficiency value opportunity');
    } else if (result.annualizedValue > 100000) {
      insights.push('Significant annual efficiency value available');
    }

    return insights;
  }

  static generateRecommendations(result: EfficiencyCalculatorResult, input: EfficiencyCalculatorInput): string[] {
    const recommendations: string[] = [];

    // Deployment-focused recommendations
    if (result.deploymentSavings < result.totalEfficiencyGain * 0.3) {
      recommendations.push('Focus on improving deployment automation and frequency');
      recommendations.push('Invest in CI/CD pipeline optimization');
    }

    // Quality-focused recommendations
    if (result.qualitySavings < result.totalEfficiencyGain * 0.3) {
      recommendations.push('Implement proactive quality measures and automated testing');
      recommendations.push('Invest in security tooling and technical debt reduction');
    }

    // Productivity-focused recommendations
    if (result.productivitySavings < result.totalEfficiencyGain * 0.3) {
      recommendations.push('Optimize developer workflows and reduce context switching');
      recommendations.push('Implement meeting optimization and async communication practices');
    }

    // Specific improvement recommendations
    if (input.velocityImprovement < 20) {
      recommendations.push('Identify bottlenecks in development velocity');
    }

    if (input.incidentCostAvoidance < 5000) {
      recommendations.push('Implement proactive monitoring and incident prevention');
    }

    if (input.technicalDebtReduction < 10000) {
      recommendations.push('Establish dedicated technical debt reduction initiatives');
    }

    return recommendations;
  }

  static calculateEfficiencyMetrics(input: EfficiencyCalculatorInput): {
    deploymentEfficiency: number;
    qualityEfficiency: number;
    productivityEfficiency: number;
    overallEfficiency: number;
  } {
    const result = this.calculateEfficiencyGains(input);
    const maxPossibleGain = 100000; // Theoretical maximum weekly efficiency gain

    return {
      deploymentEfficiency: Math.min((result.deploymentSavings / (maxPossibleGain * 0.4)) * 100, 100),
      qualityEfficiency: Math.min((result.qualitySavings / (maxPossibleGain * 0.3)) * 100, 100),
      productivityEfficiency: Math.min((result.productivitySavings / (maxPossibleGain * 0.3)) * 100, 100),
      overallEfficiency: Math.min((result.totalEfficiencyGain / maxPossibleGain) * 100, 100)
    };
  }
}