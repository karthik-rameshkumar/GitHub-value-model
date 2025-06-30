import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../pages/Dashboard';
import dashboardReducer from '../store/slices/dashboardSlice';

// Mock the chart components instead of D3.js directly
jest.mock('../components/charts', () => ({
  TimeSeriesChart: ({ title }: { title: string }) => <div data-testid="time-series-chart">{title}</div>,
  GaugeChart: ({ title }: { title: string }) => <div data-testid="gauge-chart">{title}</div>,
  HeatmapChart: ({ title }: { title: string }) => <div data-testid="heatmap-chart">{title}</div>
}));

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
    },
  });
};

const renderWithRedux = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

test('renders dashboard title', () => {
  renderWithRedux(<Dashboard />);
  const titleElement = screen.getByText(/GitHub Engineering System Success Playbook Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders zone navigation', () => {
  renderWithRedux(<Dashboard />);
  
  // Check for zone navigation tabs using role
  const tabs = screen.getAllByRole('tab');
  expect(tabs).toHaveLength(4);
  
  // Check for specific tab labels
  expect(screen.getByRole('tab', { name: /quality/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /velocity/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /happiness/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /business/i })).toBeInTheDocument();
});

test('renders quality zone dashboard by default', () => {
  renderWithRedux(<Dashboard />);
  const qualityTitle = screen.getByText(/Quality Zone Dashboard/i);
  expect(qualityTitle).toBeInTheDocument();
});