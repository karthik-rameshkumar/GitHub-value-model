import { useState, useEffect } from 'react';
import ValueCalculatorApiService from '../services/valueCalculatorApi';

interface ExecutiveSummaryData {
  totalValue: number;
  roi: number;
  keyMetrics: string[];
  recommendations: string[];
}

interface InvestmentTrackingData {
  toolAndPlatformCosts: any;
  trainingAndOnboarding: any;
  infrastructureInvestment: any;
  timeInvestment: any;
  budgetAllocation: any;
}

interface PredictiveAnalyticsData {
  projections: any[];
  scenarios: any[];
  benchmarks: any;
  breakEvenAnalysis: any;
  trendAnalysis: any;
}

export const useExecutiveSummary = (teamId?: string) => {
  const [data, setData] = useState<ExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ValueCalculatorApiService.getExecutiveSummary(teamId);
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to fetch executive summary');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching executive summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutiveSummary();
  }, [teamId]);

  const refetch = () => {
    const refetch = () => {
      fetchExecutiveSummary();
    };
  };

  return { data, loading, error, refetch };
};

export const useInvestmentTracking = () => {
  const [data, setData] = useState<InvestmentTrackingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ValueCalculatorApiService.getInvestmentTracking();
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to fetch investment tracking');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching investment tracking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const usePredictiveAnalytics = (timeframe: string = '12m') => {
  const [data, setData] = useState<PredictiveAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ValueCalculatorApiService.getPredictiveAnalytics(timeframe);
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to fetch predictive analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching predictive analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  return { data, loading, error };
};

export const useValueCalculator = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateAILeverage = async (input: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ValueCalculatorApiService.calculateAILeverage(input);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateComprehensiveReport = async (input: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ValueCalculatorApiService.generateComprehensiveReport(input);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    calculateAILeverage,
    calculateComprehensiveReport,
    loading,
    error
  };
};