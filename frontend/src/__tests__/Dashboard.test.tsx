import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../pages/Dashboard';

test('renders dashboard title', () => {
  render(<Dashboard />);
  const titleElement = screen.getByText(/GitHub Engineering System Success Playbook Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders metric cards', () => {
  render(<Dashboard />);
  
  // Check for metric cards
  expect(screen.getByText(/Deployment Frequency/i)).toBeInTheDocument();
  expect(screen.getByText(/Lead Time/i)).toBeInTheDocument();
  expect(screen.getByText(/Team Velocity/i)).toBeInTheDocument();
  expect(screen.getByText(/Quality Metrics/i)).toBeInTheDocument();
});

test('renders chart placeholder', () => {
  render(<Dashboard />);
  const chartPlaceholder = screen.getByText(/Charts and visualizations will appear here/i);
  expect(chartPlaceholder).toBeInTheDocument();
});