import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography, useTheme } from '@mui/material';

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
  metadata?: Record<string, any>;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title: string;
  width?: number;
  height?: number;
  colorRange?: [string, string];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  title,
  width = 600,
  height = 400,
  colorRange = ['#f0f0f0', '#2196F3']
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 50, right: 100, bottom: 50, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Get unique x and y values
    const xLabels = Array.from(new Set(data.map(d => d.x)));
    const yLabels = Array.from(new Set(data.map(d => d.y)));

    // Create scales
    const xScale = d3.scaleBand()
      .domain(xLabels)
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(yLabels)
      .range([0, innerHeight])
      .padding(0.1);

    // Color scale
    const colorScale = d3.scaleLinear<string>()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range(colorRange);

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add rectangles for heatmap
    g.selectAll('.heatmap-rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-rect')
      .attr('x', d => xScale(d.x) || 0)
      .attr('y', d => yScale(d.y) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', theme.palette.background.paper)
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Highlight on hover
        d3.select(this).attr('stroke-width', 2);
        
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
            <strong>${d.x} / ${d.y}</strong><br/>
            Value: ${d.value.toFixed(2)}
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 1);
        d3.selectAll('.tooltip').remove();
      });

    // Add text labels for values (if cells are large enough)
    if (xScale.bandwidth() > 40 && yScale.bandwidth() > 20) {
      g.selectAll('.heatmap-text')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'heatmap-text')
        .attr('x', d => (xScale(d.x) || 0) + xScale.bandwidth() / 2)
        .attr('y', d => (yScale(d.y) || 0) + yScale.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .style('fill', d => {
          // Use contrasting color based on background
          const brightness = d3.color(colorScale(d.value))?.rgb();
          if (brightness) {
            const luminance = (0.299 * brightness.r + 0.587 * brightness.g + 0.114 * brightness.b) / 255;
            return luminance > 0.5 ? '#000' : '#fff';
          }
          return theme.palette.text.primary;
        })
        .text(d => d.value.toFixed(1));
    }

    // Add x-axis labels
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .selectAll('.x-label')
      .data(xLabels)
      .enter()
      .append('text')
      .attr('class', 'x-label')
      .attr('x', d => (xScale(d) || 0) + xScale.bandwidth() / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.secondary)
      .text(d => d);

    // Add y-axis labels
    g.append('g')
      .selectAll('.y-label')
      .data(yLabels)
      .enter()
      .append('text')
      .attr('class', 'y-label')
      .attr('x', -10)
      .attr('y', d => (yScale(d) || 0) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.secondary)
      .text(d => d);

    // Add color legend
    const legendWidth = 20;
    const legendHeight = 100;
    const legendX = innerWidth + 20;
    const legendY = (innerHeight - legendHeight) / 2;

    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale).ticks(5);

    // Legend gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', legendHeight)
      .attr('x2', 0).attr('y2', 0);

    gradient.selectAll('stop')
      .data(colorScale.range())
      .enter().append('stop')
      .attr('offset', (d, i) => i / (colorScale.range().length - 1))
      .attr('stop-color', d => d);

    g.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    g.append('g')
      .attr('transform', `translate(${legendX + legendWidth}, ${legendY})`)
      .call(legendAxis)
      .selectAll('text')
      .style('fill', theme.palette.text.secondary);

  }, [data, width, height, colorRange, theme]);

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

export default HeatmapChart;