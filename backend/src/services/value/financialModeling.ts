import { 
  FinancialModelingInput, 
  FinancialModelingResult 
} from '../../types';

export class FinancialModelingService {
  static calculateFinancialMetrics(input: FinancialModelingInput): FinancialModelingResult {
    const npv = this.calculateNPV(input);
    const irr = this.calculateIRR(input);
    const paybackPeriod = this.calculatePaybackPeriod(input);
    const profitabilityIndex = this.calculateProfitabilityIndex(input);
    const riskAdjustedReturn = this.calculateRiskAdjustedReturn(input);

    return {
      npv,
      irr,
      paybackPeriod,
      profitabilityIndex,
      riskAdjustedReturn
    };
  }

  static calculateNPV(input: FinancialModelingInput): number {
    const { initialInvestment, discountRate, cashFlows } = input;
    
    let npv = -initialInvestment; // Initial investment is a cash outflow
    
    cashFlows.forEach((cashFlow, index) => {
      const period = index + 1;
      const presentValue = cashFlow / Math.pow(1 + discountRate, period);
      npv += presentValue;
    });
    
    return npv;
  }

  static calculateIRR(input: FinancialModelingInput): number {
    const { initialInvestment, cashFlows } = input;
    const allCashFlows = [-initialInvestment, ...cashFlows];
    
    // Use iterative approach to find IRR
    let lowerBound = -0.99;
    let upperBound = 10.0;
    let irr = 0.1; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 1000;
    
    for (let i = 0; i < maxIterations; i++) {
      let npvAtIRR = 0;
      
      allCashFlows.forEach((cashFlow, index) => {
        npvAtIRR += cashFlow / Math.pow(1 + irr, index);
      });
      
      if (Math.abs(npvAtIRR) < tolerance) {
        return irr;
      }
      
      if (npvAtIRR > 0) {
        lowerBound = irr;
      } else {
        upperBound = irr;
      }
      
      irr = (lowerBound + upperBound) / 2;
      
      if (upperBound - lowerBound < tolerance) {
        break;
      }
    }
    
    return irr;
  }

  static calculatePaybackPeriod(input: FinancialModelingInput): number {
    const { initialInvestment, cashFlows } = input;
    
    let cumulativeCashFlow = -initialInvestment;
    
    for (let i = 0; i < cashFlows.length; i++) {
      const currentCashFlow = cashFlows[i];
      if (currentCashFlow === undefined) continue;
      
      cumulativeCashFlow += currentCashFlow;
      
      if (cumulativeCashFlow >= 0) {
        // Linear interpolation for more precise payback period
        const previousCumulative = cumulativeCashFlow - currentCashFlow;
        const fraction = Math.abs(previousCumulative) / currentCashFlow;
        return i + fraction;
      }
    }
    
    return -1; // No payback within the time horizon
  }

  static calculateProfitabilityIndex(input: FinancialModelingInput): number {
    const { initialInvestment, discountRate, cashFlows } = input;
    
    let presentValueOfCashFlows = 0;
    
    cashFlows.forEach((cashFlow, index) => {
      const period = index + 1;
      const presentValue = cashFlow / Math.pow(1 + discountRate, period);
      presentValueOfCashFlows += presentValue;
    });
    
    return initialInvestment > 0 ? presentValueOfCashFlows / initialInvestment : 0;
  }

  static calculateRiskAdjustedReturn(input: FinancialModelingInput): number {
    // Risk-adjusted return using a simple risk premium approach
    const irr = this.calculateIRR(input);
    const riskPremium = 0.03; // 3% risk premium (would be calculated based on project risk factors)
    
    return irr - riskPremium;
  }

  static calculateTotalCostOfOwnership(
    initialInvestment: number,
    operationalCostsPerYear: number,
    maintenanceCostsPerYear: number,
    trainingCostsOneTime: number,
    yearsHorizon: number,
    discountRate: number
  ): number {
    let tco = initialInvestment + trainingCostsOneTime;
    
    for (let year = 1; year <= yearsHorizon; year++) {
      const annualCosts = operationalCostsPerYear + maintenanceCostsPerYear;
      const presentValue = annualCosts / Math.pow(1 + discountRate, year);
      tco += presentValue;
    }
    
    return tco;
  }

  static generateFinancialInsights(result: FinancialModelingResult, input: FinancialModelingInput): string[] {
    const insights: string[] = [];

    // NPV insights
    if (result.npv > 1000000) {
      insights.push('Exceptional NPV exceeding $1M indicates strong investment opportunity');
    } else if (result.npv > 500000) {
      insights.push('Strong positive NPV exceeding $500K indicates good investment value');
    } else if (result.npv > 100000) {
      insights.push('Positive NPV exceeding $100K indicates viable investment');
    } else if (result.npv > 0) {
      insights.push('Positive NPV indicates investment creates value');
    } else {
      insights.push('Negative NPV indicates investment may destroy value');
    }

    // IRR insights
    if (result.irr > 0.5) {
      insights.push('Exceptional IRR above 50% indicates highly attractive investment');
    } else if (result.irr > 0.3) {
      insights.push('Strong IRR above 30% indicates attractive investment returns');
    } else if (result.irr > 0.15) {
      insights.push('Good IRR above 15% indicates solid investment returns');
    } else if (result.irr > input.discountRate) {
      insights.push('IRR exceeds discount rate, indicating positive value creation');
    } else {
      insights.push('IRR below discount rate indicates potential value destruction');
    }

    // Payback period insights
    if (result.paybackPeriod < 1) {
      insights.push('Rapid payback within one year indicates quick value realization');
    } else if (result.paybackPeriod < 2) {
      insights.push('Good payback within two years indicates reasonable investment recovery');
    } else if (result.paybackPeriod < 3) {
      insights.push('Moderate payback within three years requires patience but viable');
    } else if (result.paybackPeriod > 0) {
      insights.push('Extended payback period requires long-term commitment');
    } else {
      insights.push('No payback within time horizon indicates high-risk investment');
    }

    // Profitability index insights
    if (result.profitabilityIndex > 2) {
      insights.push('High profitability index above 2.0 indicates excellent value creation');
    } else if (result.profitabilityIndex > 1.5) {
      insights.push('Strong profitability index above 1.5 indicates good value creation');
    } else if (result.profitabilityIndex > 1) {
      insights.push('Profitability index above 1.0 indicates positive value creation');
    } else {
      insights.push('Profitability index below 1.0 indicates potential value destruction');
    }

    // Risk-adjusted return insights
    if (result.riskAdjustedReturn > 0.2) {
      insights.push('Strong risk-adjusted return above 20% indicates excellent risk-reward profile');
    } else if (result.riskAdjustedReturn > 0.1) {
      insights.push('Good risk-adjusted return above 10% indicates favorable risk-reward profile');
    } else if (result.riskAdjustedReturn > 0) {
      insights.push('Positive risk-adjusted return indicates acceptable risk-reward profile');
    } else {
      insights.push('Negative risk-adjusted return indicates unfavorable risk-reward profile');
    }

    return insights;
  }

  static generateFinancialRecommendations(result: FinancialModelingResult, input: FinancialModelingInput): string[] {
    const recommendations: string[] = [];

    // Investment decision recommendations
    if (result.npv > 0 && result.irr > input.discountRate && result.profitabilityIndex > 1) {
      recommendations.push('Strong financial metrics support investment approval');
      recommendations.push('Consider prioritizing this investment in portfolio allocation');
    } else if (result.npv > 0 || result.irr > input.discountRate) {
      recommendations.push('Mixed financial signals suggest careful evaluation of risk factors');
      recommendations.push('Consider scenario analysis to understand sensitivity to assumptions');
    } else {
      recommendations.push('Weak financial metrics suggest reconsidering investment');
      recommendations.push('Explore alternative approaches or cost reduction opportunities');
    }

    // Timing recommendations
    if (result.paybackPeriod < 2) {
      recommendations.push('Quick payback supports immediate investment execution');
    } else if (result.paybackPeriod < 4) {
      recommendations.push('Moderate payback period supports planned investment with monitoring');
    } else {
      recommendations.push('Extended payback period suggests phased investment approach');
    }

    // Risk management recommendations
    if (result.riskAdjustedReturn < 0.05) {
      recommendations.push('Low risk-adjusted return suggests implementing risk mitigation strategies');
      recommendations.push('Consider diversifying investment approach to reduce risk exposure');
    }

    // Optimization recommendations
    if (result.profitabilityIndex < 1.5) {
      recommendations.push('Explore opportunities to increase cash flow benefits');
      recommendations.push('Consider cost optimization to improve investment attractiveness');
    }

    return recommendations;
  }

  static performSensitivityAnalysis(
    baseInput: FinancialModelingInput,
    variableRanges: {
      discountRateRange: [number, number];
      cashFlowVariation: number; // percentage variation
    }
  ): {
    discountRateSensitivity: { rate: number; npv: number; irr: number }[];
    cashFlowSensitivity: { variation: number; npv: number; irr: number }[];
  } {
    const discountRateSensitivity = [];
    const cashFlowSensitivity = [];

    // Discount rate sensitivity
    const [minRate, maxRate] = variableRanges.discountRateRange;
    for (let rate = minRate; rate <= maxRate; rate += 0.01) {
      const testInput = { ...baseInput, discountRate: rate };
      const npv = this.calculateNPV(testInput);
      const irr = this.calculateIRR(testInput);
      discountRateSensitivity.push({ rate, npv, irr });
    }

    // Cash flow sensitivity
    for (let variation = -variableRanges.cashFlowVariation; variation <= variableRanges.cashFlowVariation; variation += 10) {
      const adjustedCashFlows = baseInput.cashFlows.map(cf => cf * (1 + variation / 100));
      const testInput = { ...baseInput, cashFlows: adjustedCashFlows };
      const npv = this.calculateNPV(testInput);
      const irr = this.calculateIRR(testInput);
      cashFlowSensitivity.push({ variation, npv, irr });
    }

    return { discountRateSensitivity, cashFlowSensitivity };
  }
}