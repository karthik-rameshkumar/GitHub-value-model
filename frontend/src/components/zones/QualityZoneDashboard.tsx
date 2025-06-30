import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { TimeSeriesChart, GaugeChart, HeatmapChart, MetricPoint, HeatmapData } from '../charts';

// Mock data for Quality Zone
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

const generateMockHeatmapData = (): HeatmapData[] => {
  const teams = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Data'];
  const metrics = ['Test Coverage', 'Code Quality', 'Security Score', 'Maintainability'];
  const data: HeatmapData[] = [];
  
  teams.forEach(team => {
    metrics.forEach(metric => {
      data.push({
        x: team,
        y: metric,
        value: Math.random() * 100
      });
    });
  });
  
  return data;
};

const QualityZoneDashboard: React.FC = () => {
  // Mock data
  const changeFailureRateData = generateMockTimeSeriesData(30, 5, 3);
  const recoveryTimeValue = 2.4; // hours
  const securityScore = 78.5;
  const teamQualityData = generateMockHeatmapData();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50', mb: 3 }}>
        Quality Zone Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Change Failure Rate Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <TimeSeriesChart
              data={changeFailureRateData}
              title="Change Failure Rate Trend"
              yAxisLabel="Failure Rate (%)"
              color="#4CAF50"
              height={320}
              width={undefined}
            />
          </Paper>
        </Grid>

        {/* Recovery Time Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={recoveryTimeValue}
              min={0}
              max={24}
              target={4}
              title="Failed Deployment Recovery Time"
              unit=" hrs"
              size={280}
              zones={{
                good: [0, 2],
                warning: [2, 8],
                critical: [8, 24]
              }}
            />
          </Paper>
        </Grid>

        {/* Security Score Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={securityScore}
              min={0}
              max={100}
              target={90}
              title="Security Score"
              unit="%"
              size={250}
              zones={{
                critical: [0, 50],
                warning: [50, 80],
                good: [80, 100]
              }}
            />
          </Paper>
        </Grid>

        {/* Team Quality Metrics Heatmap */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 350 }}>
            <HeatmapChart
              data={teamQualityData}
              title="Team Quality Metrics Comparison"
              width={550}
              height={280}
              colorRange={['#ffebee', '#4CAF50']}
            />
          </Paper>
        </Grid>

        {/* Quality Metrics Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quality Metrics Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {changeFailureRateData[changeFailureRateData.length - 1]?.value.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Change Failure Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {recoveryTimeValue}hrs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mean Recovery Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {securityScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Security Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    87%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Test Coverage
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

export default QualityZoneDashboard;