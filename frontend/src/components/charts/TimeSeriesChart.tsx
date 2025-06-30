import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography, useTheme } from '@mui/material';

export interface MetricPoint {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}

interface TimeSeriesChartProps {
  data: MetricPoint[];
  title: string;
  yAxisLabel: string;
  color?: string;
  height?: number;
  width?: number;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title,
  yAxisLabel,
  color = '#2196F3',
  height = 300,
  width = 600
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3
      .line<MetricPoint>()
      .x(d => xScale(d.timestamp))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m/%d') as any))
      .selectAll('text')
      .style('fill', theme.palette.text.secondary);

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('fill', theme.palette.text.secondary);

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', theme.palette.text.secondary)
      .style('font-size', '12px')
      .text(yAxisLabel);

    // Add the line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots for data points
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.timestamp))
      .attr('cy', d => yScale(d.value))
      .attr('r', 3)
      .attr('fill', color)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Simple tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('padding', '8px')
          .style('background', theme.palette.background.paper)
          .style('border', `1px solid ${theme.palette.divider}`)
          .style('border-radius', '4px')
          .style('box-shadow', theme.shadows[3])
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('opacity', 0);

        tooltip.html(`
          <div style="color: ${theme.palette.text.primary}">
            <strong>Value: ${d.value}</strong><br/>
            Date: ${d.timestamp.toLocaleDateString()}
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.selectAll('.tooltip').remove();
      });

  }, [data, color, height, width, yAxisLabel, theme]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} width={width} height={height} />
      </Box>
    </Box>
  );
};

export default TimeSeriesChart;