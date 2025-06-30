import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          GitHub Engineering System Success Playbook Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Track and visualize your engineering metrics to improve team performance
        </Typography>

        <Grid container spacing={3}>
          {/* Metrics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardHeader
                avatar={<DashboardIcon color="primary" />}
                title="Deployment Frequency"
                subheader="Daily deployments"
              />
              <CardContent>
                <Typography variant="h4" component="div">
                  --
                </Typography>
                <Typography color="text.secondary">
                  Coming soon
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardHeader
                avatar={<TrendingUpIcon color="primary" />}
                title="Lead Time"
                subheader="Commit to production"
              />
              <CardContent>
                <Typography variant="h4" component="div">
                  --
                </Typography>
                <Typography color="text.secondary">
                  Coming soon
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardHeader
                avatar={<GroupIcon color="primary" />}
                title="Team Velocity"
                subheader="Stories per sprint"
              />
              <CardContent>
                <Typography variant="h4" component="div">
                  --
                </Typography>
                <Typography color="text.secondary">
                  Coming soon
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardHeader
                avatar={<AssessmentIcon color="primary" />}
                title="Quality Metrics"
                subheader="Test coverage & bugs"
              />
              <CardContent>
                <Typography variant="h4" component="div">
                  --
                </Typography>
                <Typography color="text.secondary">
                  Coming soon
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Chart Area */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, minHeight: 400 }}>
              <Typography variant="h5" gutterBottom>
                Engineering Metrics Overview
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  backgroundColor: 'grey.50',
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Charts and visualizations will appear here
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;