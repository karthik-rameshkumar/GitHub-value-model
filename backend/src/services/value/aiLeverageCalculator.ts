import { 
  AILeverageInput, 
  AILeverageResult,
  AILeverageCalculator as IAILeverageCalculator 
} from '../../types';

export class AILeverageCalculator implements IAILeverageCalculator {
  constructor(
    public potentialTimeSavingsHours: number,
    public averageHourlySalary: number,
    public totalEngineeringStaff: number,
    public activeAIUsers: number,
    public aiToolCostWeekly: number
  ) {}

  static fromInput(input: AILeverageInput): AILeverageCalculator {
    return new AILeverageCalculator(
      input.potentialTimeSavingsHours,
      input.averageHourlySalary,
      input.totalEngineeringStaff,
      input.activeAIUsers,
      input.aiToolCostWeekly
    );
  }

  public calculateWeeklyValue(): number {
    return this.potentialTimeSavingsHours * this.averageHourlySalary * this.activeAIUsers;
  }

  public calculateMonthlyROI(): number {
    const weeklyValue = this.calculateWeeklyValue();
    const monthlyValue = weeklyValue * 4.33; // Average weeks per month
    const monthlyCost = this.aiToolCostWeekly * 4.33;
    
    return monthlyCost > 0 ? ((monthlyValue - monthlyCost) / monthlyCost) * 100 : 0;
  }

  public calculateYearlyProjection(): number {
    return this.calculateWeeklyValue() * 52; // 52 weeks per year
  }

  public calculateBreakEvenPoint(): number {
    const weeklyValue = this.calculateWeeklyValue();
    return this.aiToolCostWeekly > 0 && weeklyValue > this.aiToolCostWeekly 
      ? this.aiToolCostWeekly / (weeklyValue - this.aiToolCostWeekly) 
      : 0;
  }

  public calculate(): AILeverageResult {
    const weeklyValue = this.calculateWeeklyValue();
    const weeklyROI = this.aiToolCostWeekly > 0 
      ? ((weeklyValue - this.aiToolCostWeekly) / this.aiToolCostWeekly) * 100 
      : 0;
    const monthlyROI = this.calculateMonthlyROI();
    const yearlyValue = this.calculateYearlyProjection();
    const yearlyROI = this.aiToolCostWeekly > 0 
      ? ((yearlyValue - (this.aiToolCostWeekly * 52)) / (this.aiToolCostWeekly * 52)) * 100 
      : 0;
    const breakEvenWeeks = this.calculateBreakEvenPoint();
    const costPerDeveloper = this.activeAIUsers > 0 
      ? this.aiToolCostWeekly / this.activeAIUsers 
      : 0;
    const valuePerDeveloper = this.activeAIUsers > 0 
      ? weeklyValue / this.activeAIUsers 
      : 0;

    return {
      weeklyValue,
      weeklyCost: this.aiToolCostWeekly,
      weeklyROI,
      monthlyROI,
      yearlyValue,
      yearlyROI,
      breakEvenWeeks,
      costPerDeveloper,
      valuePerDeveloper
    };
  }
}

export class AILeverageCalculatorService {
  static calculateAILeverage(input: AILeverageInput): AILeverageResult {
    // Validate that activeAIUsers doesn't exceed totalEngineeringStaff
    if (input.activeAIUsers > input.totalEngineeringStaff) {
      throw new Error('Active AI users cannot exceed total engineering staff');
    }

    const calculator = AILeverageCalculator.fromInput(input);
    return calculator.calculate();
  }

  static generateInsights(result: AILeverageResult): string[] {
    const insights: string[] = [];

    if (result.weeklyROI > 1000) {
      insights.push('Exceptional ROI indicates strong AI leverage opportunity');
    } else if (result.weeklyROI > 500) {
      insights.push('Strong ROI suggests effective AI implementation');
    } else if (result.weeklyROI > 100) {
      insights.push('Positive ROI indicates viable AI investment');
    } else if (result.weeklyROI > 0) {
      insights.push('Marginal ROI suggests optimization opportunities');
    } else {
      insights.push('Negative ROI indicates need for strategy reassessment');
    }

    if (result.breakEvenWeeks < 4) {
      insights.push('Rapid payback period indicates quick value realization');
    } else if (result.breakEvenWeeks < 13) {
      insights.push('Reasonable payback period for quarterly planning');
    } else if (result.breakEvenWeeks < 52) {
      insights.push('Annual payback period requires long-term commitment');
    } else {
      insights.push('Extended payback period requires careful consideration');
    }

    if (result.valuePerDeveloper > result.costPerDeveloper * 10) {
      insights.push('High value-to-cost ratio per developer');
    } else if (result.valuePerDeveloper > result.costPerDeveloper * 5) {
      insights.push('Good value-to-cost ratio per developer');
    } else if (result.valuePerDeveloper > result.costPerDeveloper) {
      insights.push('Positive value-to-cost ratio per developer');
    } else {
      insights.push('Cost exceeds value per developer - review implementation');
    }

    return insights;
  }

  static generateRecommendations(result: AILeverageResult, input: AILeverageInput): string[] {
    const recommendations: string[] = [];
    const adoptionRate = input.activeAIUsers / input.totalEngineeringStaff;

    if (adoptionRate < 0.5) {
      recommendations.push('Increase AI tool adoption to enhance value realization');
    }

    if (result.weeklyROI < 200) {
      recommendations.push('Consider additional training to improve AI tool utilization');
      recommendations.push('Review tool configuration and integration opportunities');
    }

    if (input.potentialTimeSavingsHours < 4) {
      recommendations.push('Identify additional use cases for AI-assisted development');
    }

    if (result.costPerDeveloper > 100) {
      recommendations.push('Evaluate tool licensing options for cost optimization');
    }

    if (result.yearlyValue > 100000) {
      recommendations.push('Consider expanding AI program to additional teams');
    }

    return recommendations;
  }
}