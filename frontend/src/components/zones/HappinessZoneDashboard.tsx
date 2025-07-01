import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { TimeSeriesChart, GaugeChart, HeatmapChart, MetricPoint, HeatmapData } from '../charts';

// Mock data generation for Happiness Zone
const generateMockTimeSeriesData = (days: number, baseValue: number, variance: number): MetricPoint[] => {
  const data: MetricPoint[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      timestamp: date,
      value: Math.max(0, Math.min(10, value)) // Keep happiness scale 0-10
    });
  }
  
  return data;
};

const generateHappinessHeatmapData = (): HeatmapData[] => {
  const teams = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Data'];
  const categories = ['Flow State', 'Tool Satisfaction', 'Work-Life Balance', 'Learning Opportunities'];
  const data: HeatmapData[] = [];
  
  teams.forEach(team => {
    categories.forEach(category => {
      data.push({
        x: team,
        y: category,
        value: Math.random() * 10 // 0-10 scale
      });
    });
  });
  
  return data;
};

const HappinessZoneDashboard: React.FC = () => {
  // Mock data
  const flowStateData = generateMockTimeSeriesData(30, 7.2, 2);
  const toolSatisfactionData = generateMockTimeSeriesData(30, 6.8, 1.5);
  const copilotAdoptionData = generateMockTimeSeriesData(30, 85, 15); // percentage

  const currentFlowState = 7.4;
  const currentToolSatisfaction = 6.9;
  const currentCopilotSatisfaction = 8.2;
  const copilotAdoption = 78;

  const happinessHeatmapData = generateHappinessHeatmapData();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#FF9800', mb: 3 }}>
        Developer Happiness Zone Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Flow State Experience */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <TimeSeriesChart
              data={flowStateData}
              title="Flow State Experience (Daily Survey)"
              yAxisLabel="Happiness Score (1-10)"
              color="#FF9800"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Current Flow State Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentFlowState}
              min={0}
              max={10}
              target={8}
              title="Current Flow State"
              unit="/10"
              size={280}
              zones={{
                critical: [0, 4],
                warning: [4, 7],
                good: [7, 10]
              }}
            />
          </Paper>
        </Grid>

        {/* Engineering Tool Satisfaction */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <TimeSeriesChart
              data={toolSatisfactionData}
              title="Engineering Tool Satisfaction Trends"
              yAxisLabel="Satisfaction Score (1-10)"
              color="#FFA726"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Current Tool Satisfaction Gauge */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentToolSatisfaction}
              min={0}
              max={10}
              target={7.5}
              title="Tool Satisfaction"
              unit="/10"
              size={280}
              zones={{
                critical: [0, 4],
                warning: [4, 7],
                good: [7, 10]
              }}
            />
          </Paper>
        </Grid>

        {/* Copilot Adoption Timeline */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350 }}>
            <TimeSeriesChart
              data={copilotAdoptionData}
              title="GitHub Copilot Adoption"
              yAxisLabel="Adoption Rate (%)"
              color="#FF8A65"
              height={270}
              width={450}
            />
          </Paper>
        </Grid>

        {/* Copilot Satisfaction Gauge */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GaugeChart
              value={currentCopilotSatisfaction}
              min={0}
              max={10}
              target={8}
              title="Copilot Satisfaction"
              unit="/10"
              size={250}
              zones={{
                critical: [0, 4],
                warning: [4, 7],
                good: [7, 10]
              }}
            />
          </Paper>
        </Grid>

        {/* Team Happiness Heatmap */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <HeatmapChart
              data={happinessHeatmapData}
              title="Team Happiness Metrics Breakdown"
              width={800}
              height={320}
              colorRange={['#ffecb3', '#FF9800']}
            />
          </Paper>
        </Grid>

        {/* Happiness Metrics Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Developer Happiness Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentFlowState}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Flow State Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentToolSatisfaction}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tool Satisfaction
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {copilotAdoption}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Copilot Adoption
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentCopilotSatisfaction}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Copilot Satisfaction
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

export default HappinessZoneDashboard;