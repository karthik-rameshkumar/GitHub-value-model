import { Router } from 'express';
import { Request, Response } from 'express';
import { 
  AILeverageInputSchema,
  EfficiencyCalculatorInputSchema,
  RevenueImpactInputSchema,
  CostSavingsInputSchema,
  FinancialModelingInputSchema,
  ScenarioModelSchema
} from '../../schemas';
import {
  aiLeverageService,
  efficiencyService,
  revenueImpactService,
  costSavingsService,
  financialModelingService,
  valueCalculatorService
} from '../../services/value';

const router = Router();

// AI Leverage Calculator endpoint
router.post('/ai-leverage', async (req: Request, res: Response) => {
  try {
    const validatedInput = AILeverageInputSchema.parse(req.body);
    const result = aiLeverageService.calculateAILeverage(validatedInput);
    const insights = aiLeverageService.generateInsights(result);
    const recommendations = aiLeverageService.generateRecommendations(result, validatedInput);

    res.json({
      success: true,
      data: {
        calculation: result,
        insights,
        recommendations
      }
    });
  } catch (error) {
    console.error('Error calculating AI leverage:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate AI leverage'
    });
  }
});

// Engineering Efficiency Calculator endpoint
router.post('/engineering-efficiency', async (req: Request, res: Response) => {
  try {
    const validatedInput = EfficiencyCalculatorInputSchema.parse(req.body);
    const result = efficiencyService.calculateEfficiencyGains(validatedInput);
    const insights = efficiencyService.generateInsights(result);
    const recommendations = efficiencyService.generateRecommendations(result, validatedInput);
    const metrics = efficiencyService.calculateEfficiencyMetrics(validatedInput);

    res.json({
      success: true,
      data: {
        calculation: result,
        insights,
        recommendations,
        metrics
      }
    });
  } catch (error) {
    console.error('Error calculating engineering efficiency:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate engineering efficiency'
    });
  }
});

// Revenue Impact Calculator endpoint
router.post('/revenue-impact', async (req: Request, res: Response) => {
  try {
    const validatedInput = RevenueImpactInputSchema.parse(req.body);
    const result = revenueImpactService.calculateRevenueImpact(validatedInput);
    const insights = revenueImpactService.generateInsights(result);
    const recommendations = revenueImpactService.generateRecommendations(result, validatedInput);
    const metrics = revenueImpactService.calculateRevenueMetrics(validatedInput);

    res.json({
      success: true,
      data: {
        calculation: result,
        insights,
        recommendations,
        metrics
      }
    });
  } catch (error) {
    console.error('Error calculating revenue impact:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate revenue impact'
    });
  }
});

// Cost Savings Calculator endpoint
router.post('/cost-savings', async (req: Request, res: Response) => {
  try {
    const validatedInput = CostSavingsInputSchema.parse(req.body);
    const result = costSavingsService.calculateCostSavings(validatedInput);
    const insights = costSavingsService.generateInsights(result);
    const recommendations = costSavingsService.generateRecommendations(result, validatedInput);
    const metrics = costSavingsService.calculateSavingsMetrics(validatedInput);

    res.json({
      success: true,
      data: {
        calculation: result,
        insights,
        recommendations,
        metrics
      }
    });
  } catch (error) {
    console.error('Error calculating cost savings:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate cost savings'
    });
  }
});

// Financial Modeling endpoint
router.post('/financial-modeling', async (req: Request, res: Response) => {
  try {
    const validatedInput = FinancialModelingInputSchema.parse(req.body);
    const result = financialModelingService.calculateFinancialMetrics(validatedInput);
    const insights = financialModelingService.generateFinancialInsights(result, validatedInput);
    const recommendations = financialModelingService.generateFinancialRecommendations(result, validatedInput);

    // Calculate TCO
    const tco = financialModelingService.calculateTotalCostOfOwnership(
      validatedInput.initialInvestment,
      50000, // Annual operational costs
      25000, // Annual maintenance costs
      10000, // One-time training costs
      validatedInput.timeHorizonYears,
      validatedInput.discountRate
    );

    // Perform sensitivity analysis
    const sensitivityAnalysis = financialModelingService.performSensitivityAnalysis(
      validatedInput,
      {
        discountRateRange: [0.05, 0.20],
        cashFlowVariation: 30
      }
    );

    res.json({
      success: true,
      data: {
        calculation: result,
        totalCostOfOwnership: tco,
        insights,
        recommendations,
        sensitivityAnalysis
      }
    });
  } catch (error) {
    console.error('Error calculating financial metrics:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate financial metrics'
    });
  }
});

// Comprehensive Value Report endpoint
router.post('/comprehensive-report', async (req: Request, res: Response) => {
  try {
    const { aiLeverage, efficiency, revenueImpact, costSavings, financialModeling } = req.body;

    // Validate inputs
    const validatedAILeverage = AILeverageInputSchema.parse(aiLeverage);
    const validatedEfficiency = EfficiencyCalculatorInputSchema.parse(efficiency);
    const validatedRevenueImpact = RevenueImpactInputSchema.parse(revenueImpact);
    const validatedCostSavings = CostSavingsInputSchema.parse(costSavings);

    let validatedFinancialModeling;
    if (financialModeling) {
      validatedFinancialModeling = FinancialModelingInputSchema.parse(financialModeling);
    }

    const report = valueCalculatorService.generateComprehensiveReport(
      validatedAILeverage,
      validatedEfficiency,
      validatedRevenueImpact,
      validatedCostSavings,
      validatedFinancialModeling
    );

    const dashboardMetrics = valueCalculatorService.generateDashboardMetrics(report);

    res.json({
      success: true,
      data: {
        report,
        dashboardMetrics
      }
    });
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate comprehensive report'
    });
  }
});

// Scenario Modeling endpoint
router.post('/scenario-modeling', async (req: Request, res: Response) => {
  try {
    const { scenarios } = req.body;

    if (!Array.isArray(scenarios) || scenarios.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Scenarios array is required and must not be empty'
      });
    }

    // Validate and create scenario models
    const validatedScenarios = scenarios.map((scenario: any) => {
      const validated = ScenarioModelSchema.parse(scenario);
      return valueCalculatorService.createScenarioModel(
        validated.name,
        validated.description,
        validated.parameters
      );
    });

    // Compare scenarios
    const comparison = valueCalculatorService.compareScenarios(validatedScenarios);

    res.json({
      success: true,
      data: {
        scenarios: validatedScenarios,
        comparison
      }
    });
  } catch (error) {
    console.error('Error processing scenario modeling:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process scenario modeling'
    });
  }
});

export default router;