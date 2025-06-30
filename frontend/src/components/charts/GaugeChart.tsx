import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography, useTheme } from '@mui/material';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  target?: number;
  title: string;
  unit?: string;
  size?: number;
  zones?: {
    good: [number, number];
    warning: [number, number];
    critical: [number, number];
  };
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  target,
  title,
  unit = '',
  size = 200,
  zones
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = size / 2 - 20;
    const centerX = size / 2;
    const centerY = size / 2;

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Scale for the gauge
    const scale = d3.scaleLinear()
      .domain([min, max])
      .range([-Math.PI / 2, Math.PI / 2]);

    // Background arc
    const backgroundArc = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    g.append('path')
      .attr('d', backgroundArc(null as any))
      .attr('fill', theme.palette.grey[200]);

    // Zone colors
    if (zones) {
      const zoneColors = {
        critical: '#f44336',
        warning: '#ff9800', 
        good: '#4caf50'
      };

      Object.entries(zones).forEach(([zoneName, [zoneMin, zoneMax]]) => {
        const zoneArc = d3.arc()
          .innerRadius(radius - 20)
          .outerRadius(radius)
          .startAngle(scale(Math.max(zoneMin, min)))
          .endAngle(scale(Math.min(zoneMax, max)));

        g.append('path')
          .attr('d', zoneArc(null as any))
          .attr('fill', zoneColors[zoneName as keyof typeof zoneColors]);
      });
    }

    // Value arc
    const valueArc = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(scale(Math.min(value, max)));

    g.append('path')
      .attr('d', valueArc(null as any))
      .attr('fill', theme.palette.primary.main)
      .attr('opacity', 0.8);

    // Needle
    const needleAngle = scale(Math.min(Math.max(value, min), max));
    const needleLength = radius - 10;
    
    g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', needleLength * Math.cos(needleAngle))
      .attr('y2', needleLength * Math.sin(needleAngle))
      .attr('stroke', theme.palette.text.primary)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round');

    // Center circle
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 8)
      .attr('fill', theme.palette.text.primary);

    // Target indicator
    if (target !== undefined) {
      const targetAngle = scale(target);
      const targetRadius = radius + 5;
      
      g.append('polygon')
        .attr('points', `0,-5 5,5 -5,5`)
        .attr('transform', `translate(${targetRadius * Math.cos(targetAngle)}, ${targetRadius * Math.sin(targetAngle)}) rotate(${(targetAngle * 180 / Math.PI) + 90})`)
        .attr('fill', theme.palette.secondary.main);
    }

    // Tick marks
    const ticks = scale.ticks(5);
    ticks.forEach(tick => {
      const angle = scale(tick);
      const x1 = (radius - 15) * Math.cos(angle);
      const y1 = (radius - 15) * Math.sin(angle);
      const x2 = (radius - 5) * Math.cos(angle);
      const y2 = (radius - 5) * Math.sin(angle);

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', theme.palette.text.secondary)
        .attr('stroke-width', 1);

      // Tick labels
      const labelX = (radius + 15) * Math.cos(angle);
      const labelY = (radius + 15) * Math.sin(angle);

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .style('fill', theme.palette.text.secondary)
        .text(tick);
    });

  }, [value, min, max, target, size, zones, theme]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <svg ref={svgRef} width={size} height={size} />
      <Typography variant="h4" component="div" sx={{ mt: 1 }}>
        {value.toFixed(1)}{unit}
      </Typography>
      {target !== undefined && (
        <Typography variant="body2" color="text.secondary">
          Target: {target}{unit}
        </Typography>
      )}
    </Box>
  );
};

export default GaugeChart;