import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { TimeSeriesChart, GaugeChart, MetricPoint } from '../charts';

// Mock data generation for Business Zone
const generateMockTimeSeriesData = (days: number, baseValue: number, variance: number): MetricPoint[] => {
  const data: MetricPoint[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      timestamp: date,
      value: Math.max(0, value)
    });
  }
  
  return data;
};

const BusinessZoneDashboard: React.FC = () => {
  // Mock data
  const aiLeverageData = generateMockTimeSeriesData(30, 68, 15); // percentage
  const engineeringExpensesData = generateMockTimeSeriesData(30, 32, 8); // percentage
  const featureVelocityData = generateMockTimeSeriesData(30, 12, 5); // features per month
  
  const currentAILeverage = 72;
  const currentExpenseRatio = 28;
  const currentROI = 145; // percentage
  const predictedGrowth = 23; // percentage

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#9C27B0', mb: 3 }}>
        Business Outcomes Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* AI Leverage Timeline */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <TimeSeriesChart
              data={aiLeverageData}
              title="AI Leverage Percentage Trend"
              yAxisLabel="AI Leverage (%)"
              color="#9C27B0"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Current AI Leverage Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentAILeverage}
              min={0}
              max={100}
              target={80}
              title="Current AI Leverage"
              unit="%"
              size={280}
              zones={{
                critical: [0, 30],
                warning: [30, 60],
                good: [60, 100]
              }}
            />
          </Paper>
        </Grid>

        {/* Engineering Expenses Ratio */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <TimeSeriesChart
              data={engineeringExpensesData}
              title="Engineering Expenses Ratio"
              yAxisLabel="Expenses Ratio (%)"
              color="#7B1FA2"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Current Expense Ratio Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentExpenseRatio}
              min={0}
              max={50}
              target={25}
              title="Expense Ratio"
              unit="%"
              size={280}
              zones={{
                good: [0, 20],
                warning: [20, 35],
                critical: [35, 50]
              }}
            />
          </Paper>
        </Grid>

        {/* Feature Development Velocity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350 }}>
            <TimeSeriesChart
              data={featureVelocityData}
              title="Feature Development Velocity"
              yAxisLabel="Features per Month"
              color="#AB47BC"
              height={270}
              width={450}
            />
          </Paper>
        </Grid>

        {/* ROI Calculator Gauge */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentROI}
              min={0}
              max={200}
              target={150}
              title="Engineering ROI"
              unit="%"
              size={250}
              zones={{
                critical: [0, 50],
                warning: [50, 100],
                good: [100, 200]
              }}
            />
          </Paper>
        </Grid>

        {/* Cost-Benefit Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Cost-Benefit Analysis
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Monthly Engineering Cost
                </Typography>
                <Typography variant="h5" color="primary">
                  $485K
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Value Generated
                </Typography>
                <Typography variant="h5" color="success.main">
                  $702K
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Cost per Feature
                </Typography>
                <Typography variant="h5" color="primary">
                  $40K
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Efficiency Gain
                </Typography>
                <Typography variant="h5" color="success.main">
                  +{predictedGrowth}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Feature Allocation Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Feature Development Allocation
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  New Features
                </Typography>
                <Typography variant="h5" color="primary">
                  65%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Technical Debt
                </Typography>
                <Typography variant="h5" color="warning.main">
                  20%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Bug Fixes
                </Typography>
                <Typography variant="h5" color="error.main">
                  10%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Infrastructure
                </Typography>
                <Typography variant="h5" color="info.main">
                  5%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Business Metrics Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Business Outcomes Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentAILeverage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI Leverage
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentExpenseRatio}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expense Ratio
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentROI}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Engineering ROI
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {featureVelocityData[featureVelocityData.length - 1]?.value.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Features/Month
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessZoneDashboard;