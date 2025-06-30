import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime?: number;
  checks?: {
    api: { status: string };
    database: { status: string; error?: string };
    redis: { status: string; error?: string };
  };
}

const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/health/all`);
      const data = await response.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'unhealthy':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon />;
      case 'unhealthy':
        return <ErrorIcon />;
      default:
        return <CircularProgress size={20} />;
    }
  };

  if (loading && !health) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        System Health Check
      </Typography>

      {health && (
        <>
          <Box mb={3}>
            <Chip
              icon={getStatusIcon(health.status)}
              label={`Overall Status: ${health.status.toUpperCase()}`}
              color={getStatusColor(health.status) as any}
              size="large"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Last updated: {new Date(health.timestamp).toLocaleString()}
            </Typography>
            {health.uptime && (
              <Typography variant="body2" color="text.secondary">
                Uptime: {Math.floor(health.uptime)} seconds
              </Typography>
            )}
          </Box>

          {health.checks && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(health.checks.api.status)}
                      <Typography variant="h6">API</Typography>
                    </Box>
                    <Chip
                      label={health.checks.api.status}
                      color={getStatusColor(health.checks.api.status) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(health.checks.database.status)}
                      <Typography variant="h6">Database</Typography>
                    </Box>
                    <Chip
                      label={health.checks.database.status}
                      color={getStatusColor(health.checks.database.status) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    {health.checks.database.error && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {health.checks.database.error}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(health.checks.redis.status)}
                      <Typography variant="h6">Redis</Typography>
                    </Box>
                    <Chip
                      label={health.checks.redis.status}
                      color={getStatusColor(health.checks.redis.status) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    {health.checks.redis.error && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {health.checks.redis.error}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default HealthCheck;