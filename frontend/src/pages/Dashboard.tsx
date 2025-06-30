import React from 'react';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import { setCurrentZone, Zone } from '../store/slices/dashboardSlice';
import ZoneNavigation from '../components/ZoneNavigation';
import {
  QualityZoneDashboard,
  VelocityZoneDashboard,
  HappinessZoneDashboard,
  BusinessZoneDashboard,
} from '../components/zones';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const currentZone = useSelector((state: RootState) => state.dashboard.currentZone);

  const handleZoneChange = (zone: Zone) => {
    dispatch(setCurrentZone(zone));
  };

  const renderZoneDashboard = () => {
    switch (currentZone) {
      case 'quality':
        return <QualityZoneDashboard />;
      case 'velocity':
        return <VelocityZoneDashboard />;
      case 'happiness':
        return <HappinessZoneDashboard />;
      case 'business':
        return <BusinessZoneDashboard />;
      default:
        return <QualityZoneDashboard />;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          GitHub Engineering System Success Playbook Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Track and visualize your engineering metrics to improve team performance
        </Typography>

        <ZoneNavigation 
          currentZone={currentZone} 
          onZoneChange={handleZoneChange} 
        />

        {renderZoneDashboard()}
      </Box>
    </Container>
  );
};

export default Dashboard;