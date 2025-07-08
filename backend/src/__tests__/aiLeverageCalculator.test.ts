import { AILeverageCalculatorService, AILeverageCalculator } from '../services/value/aiLeverageCalculator';
import { AILeverageInput } from '../types';

describe('AILeverageCalculatorService', () => {
  const mockInput: AILeverageInput = {
    potentialTimeSavingsHours: 8,
    averageHourlySalary: 75,
    totalEngineeringStaff: 50,
    activeAIUsers: 35,
    aiToolCostWeekly: 1200
  };

  describe('calculateAILeverage', () => {
    it('should calculate AI leverage correctly with valid input', () => {
      const result = AILeverageCalculatorService.calculateAILeverage(mockInput);

      expect(result).toBeDefined();
      expect(result.weeklyValue).toBe(21000); // 8 * 75 * 35
      expect(result.weeklyCost).toBe(1200);
      expect(result.weeklyROI).toBeCloseTo(1650, 0); // ((21000 - 1200) / 1200) * 100
      expect(result.yearlyValue).toBe(1092000); // 21000 * 52
      expect(result.breakEvenWeeks).toBeCloseTo(0.061, 2); // Very quick payback
    });

    it('should throw error when activeAIUsers exceeds totalEngineeringStaff', () => {
      const invalidInput: AILeverageInput = {
        ...mockInput,
        activeAIUsers: 60, // More than totalEngineeringStaff (50)
        totalEngineeringStaff: 50
      };

      expect(() => {
        AILeverageCalculatorService.calculateAILeverage(invalidInput);
      }).toThrow('Active AI users cannot exceed total engineering staff');
    });

    it('should handle zero cost scenario', () => {
      const zeroCostInput: AILeverageInput = {
        ...mockInput,
        aiToolCostWeekly: 0
      };

      const result = AILeverageCalculatorService.calculateAILeverage(zeroCostInput);
      expect(result.weeklyROI).toBe(0);
      expect(result.breakEvenWeeks).toBe(0);
    });

    it('should handle zero active users', () => {
      const noUsersInput: AILeverageInput = {
        ...mockInput,
        activeAIUsers: 0
      };

      const result = AILeverageCalculatorService.calculateAILeverage(noUsersInput);
      expect(result.weeklyValue).toBe(0);
      expect(result.valuePerDeveloper).toBe(0);
    });
  });

  describe('generateInsights', () => {
    it('should generate positive insights for high ROI', () => {
      const result = AILeverageCalculatorService.calculateAILeverage(mockInput);
      const insights = AILeverageCalculatorService.generateInsights(result);

      expect(insights).toContain('Exceptional ROI indicates strong AI leverage opportunity');
      expect(insights).toContain('Rapid payback period indicates quick value realization');
    });

    it('should generate appropriate insights for low ROI', () => {
      const lowROIInput: AILeverageInput = {
        ...mockInput,
        potentialTimeSavingsHours: 1,
        aiToolCostWeekly: 5000
      };

      const result = AILeverageCalculatorService.calculateAILeverage(lowROIInput);
      const insights = AILeverageCalculatorService.generateInsights(result);

      expect(insights.some(insight => insight.includes('Negative ROI'))).toBe(true);
    });
  });

  describe('generateRecommendations', () => {
    it('should recommend increasing adoption for low adoption rate', () => {
      const lowAdoptionInput: AILeverageInput = {
        ...mockInput,
        activeAIUsers: 20 // 40% adoption rate
      };

      const result = AILeverageCalculatorService.calculateAILeverage(lowAdoptionInput);
      const recommendations = AILeverageCalculatorService.generateRecommendations(result, lowAdoptionInput);

      expect(recommendations).toContain('Increase AI tool adoption to enhance value realization');
    });

    it('should recommend expanding program for high value', () => {
      const result = AILeverageCalculatorService.calculateAILeverage(mockInput);
      const recommendations = AILeverageCalculatorService.generateRecommendations(result, mockInput);

      expect(recommendations).toContain('Consider expanding AI program to additional teams');
    });
  });

  describe('AILeverageCalculator class', () => {
    it('should create calculator from input', () => {
      const calculator = AILeverageCalculator.fromInput(mockInput);
      
      expect(calculator.potentialTimeSavingsHours).toBe(mockInput.potentialTimeSavingsHours);
      expect(calculator.averageHourlySalary).toBe(mockInput.averageHourlySalary);
      expect(calculator.totalEngineeringStaff).toBe(mockInput.totalEngineeringStaff);
      expect(calculator.activeAIUsers).toBe(mockInput.activeAIUsers);
      expect(calculator.aiToolCostWeekly).toBe(mockInput.aiToolCostWeekly);
    });

    it('should calculate weekly value correctly', () => {
      const calculator = AILeverageCalculator.fromInput(mockInput);
      const weeklyValue = calculator.calculateWeeklyValue();
      
      expect(weeklyValue).toBe(21000);
    });

    it('should calculate monthly ROI correctly', () => {
      const calculator = AILeverageCalculator.fromInput(mockInput);
      const monthlyROI = calculator.calculateMonthlyROI();
      
      // Monthly value: 21000 * 4.33 = 90930
      // Monthly cost: 1200 * 4.33 = 5196
      // ROI: ((90930 - 5196) / 5196) * 100 ≈ 1650%
      expect(monthlyROI).toBeCloseTo(1650, 0);
    });

    it('should calculate yearly projection correctly', () => {
      const calculator = AILeverageCalculator.fromInput(mockInput);
      const yearlyProjection = calculator.calculateYearlyProjection();
      
      expect(yearlyProjection).toBe(1092000); // 21000 * 52
    });
  });
});