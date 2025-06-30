import React from 'react';
import { 
  Tabs, 
  Tab, 
  Box,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import {
  Assessment as QualityIcon,
  Speed as VelocityIcon,
  SentimentSatisfied as HappinessIcon,
  BusinessCenter as BusinessIcon
} from '@mui/icons-material';

export type Zone = 'quality' | 'velocity' | 'happiness' | 'business';

interface ZoneNavigationProps {
  currentZone: Zone;
  onZoneChange: (zone: Zone) => void;
}

const zoneConfig = [
  { 
    id: 'quality' as Zone, 
    label: 'Quality', 
    icon: <QualityIcon />,
    color: '#4CAF50' 
  },
  { 
    id: 'velocity' as Zone, 
    label: 'Velocity', 
    icon: <VelocityIcon />,
    color: '#2196F3' 
  },
  { 
    id: 'happiness' as Zone, 
    label: 'Happiness', 
    icon: <HappinessIcon />,
    color: '#FF9800' 
  },
  { 
    id: 'business' as Zone, 
    label: 'Business', 
    icon: <BusinessIcon />,
    color: '#9C27B0' 
  }
];

const ZoneNavigation: React.FC<ZoneNavigationProps> = ({ currentZone, onZoneChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (_: React.SyntheticEvent, newZone: Zone) => {
    onZoneChange(newZone);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={currentZone}
        onChange={handleChange}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            minHeight: 72,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }
        }}
      >
        {zoneConfig.map((zone) => (
          <Tab
            key={zone.id}
            value={zone.id}
            icon={zone.icon}
            label={zone.label}
            iconPosition="start"
            sx={{
              color: 'text.secondary',
              '&.Mui-selected': {
                color: zone.color,
              },
              '& .MuiTab-iconWrapper': {
                color: currentZone === zone.id ? zone.color : 'inherit',
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ZoneNavigation;