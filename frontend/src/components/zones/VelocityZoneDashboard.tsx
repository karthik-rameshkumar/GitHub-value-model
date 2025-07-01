import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { TimeSeriesChart, GaugeChart, MetricPoint } from '../charts';

// Mock data generation for Velocity Zone
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

const VelocityZoneDashboard: React.FC = () => {
  // Mock data
  const leadTimeData = generateMockTimeSeriesData(30, 18, 12); // hours
  const deploymentFrequencyData = generateMockTimeSeriesData(30, 2.5, 1.5); // per day
  const prMergedData = generateMockTimeSeriesData(30, 8, 4); // PRs per day
  
  const currentLeadTime = 16.5; // hours
  const currentDeploymentFreq = 2.8; // per day
  const currentVelocity = 42; // story points

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#2196F3', mb: 3 }}>
        Velocity Zone Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Lead Time Distribution */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <TimeSeriesChart
              data={leadTimeData}
              title="Lead Time for Changes"
              yAxisLabel="Hours"
              color="#2196F3"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Current Lead Time Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentLeadTime}
              min={0}
              max={72}
              target={24}
              title="Current Lead Time"
              unit=" hrs"
              size={280}
              zones={{
                good: [0, 24],
                warning: [24, 48],
                critical: [48, 72]
              }}
            />
          </Paper>
        </Grid>

        {/* Deployment Frequency Timeline */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <TimeSeriesChart
              data={deploymentFrequencyData}
              title="Deployment Frequency"
              yAxisLabel="Deployments per Day"
              color="#1976D2"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Current Deployment Frequency Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentDeploymentFreq}
              min={0}
              max={10}
              target={3}
              title="Deployment Frequency"
              unit="/day"
              size={280}
              zones={{
                critical: [0, 1],
                warning: [1, 2],
                good: [2, 10]
              }}
            />
          </Paper>
        </Grid>

        {/* PRs Merged Timeline */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350 }}>
            <TimeSeriesChart
              data={prMergedData}
              title="Pull Requests Merged"
              yAxisLabel="PRs per Day"
              color="#42A5F5"
              height={270}
              width={450}
            />
          </Paper>
        </Grid>

        {/* Team Velocity Gauge */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentVelocity}
              min={0}
              max={100}
              target={50}
              title="Team Velocity"
              unit=" pts"
              size={250}
              zones={{
                critical: [0, 20],
                warning: [20, 40],
                good: [40, 100]
              }}
            />
          </Paper>
        </Grid>

        {/* Velocity Metrics Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Velocity Metrics Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentLeadTime}hrs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Lead Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentDeploymentFreq}/day
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deployment Frequency
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {prMergedData[prMergedData.length - 1]?.value.toFixed(0)}/day
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PRs Merged
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentVelocity}pts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sprint Velocity
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

export default VelocityZoneDashboard;