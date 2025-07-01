// Value Calculator Services
export { AILeverageCalculatorService, AILeverageCalculator } from './aiLeverageCalculator';
export { EfficiencyCalculatorService } from './efficiencyCalculator';
export { RevenueImpactCalculatorService } from './revenueImpactCalculator';
export { CostSavingsCalculatorService } from './costSavingsCalculator';
export { FinancialModelingService } from './financialModeling';
export { ValueCalculatorService } from './valueCalculator';

// Import the classes to create instances
import { AILeverageCalculatorService } from './aiLeverageCalculator';
import { EfficiencyCalculatorService } from './efficiencyCalculator';
import { RevenueImpactCalculatorService } from './revenueImpactCalculator';
import { CostSavingsCalculatorService } from './costSavingsCalculator';
import { FinancialModelingService } from './financialModeling';
import { ValueCalculatorService } from './valueCalculator';

// Create service instances
export const aiLeverageService = AILeverageCalculatorService;
export const efficiencyService = EfficiencyCalculatorService;
export const revenueImpactService = RevenueImpactCalculatorService;
export const costSavingsService = CostSavingsCalculatorService;
export const financialModelingService = FinancialModelingService;
export const valueCalculatorService = ValueCalculatorService;