import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * ProfitVolumeChart Component
 * Displays a line chart showing profit vs sales volume with grid layout
 * Updated to match the reference screenshot
 */
const ProfitVolumeChart = ({ salesPricePerUnit, costPerUnit, currentVolume }) => {
  const theme = useTheme();
  const canvasRef = useRef(null);
  
  // Calculate profit per unit
  const profitPerUnit = salesPricePerUnit - costPerUnit;
  
  // Format currency with thousands separators and K/M suffixes
  const formatCurrency = (amount, short = false) => {
    if (short) {
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M JPY`;
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K JPY`;
      }
      return `${Math.round(amount)} JPY`;
    }
    return `${Math.round(amount).toLocaleString()} JPY`;
  };
  
  // Draw the line chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !salesPricePerUnit || !costPerUnit) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = { left: 80, right: 20, top: 40, bottom: 60 };
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart area dimensions
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // X-axis: Sales Volume (0-1000)
    const maxVolume = 1000;
    
    // Y-axis: Monthly Profit (0 to max value based on volume and profit per unit)
    const maxProfit = maxVolume * profitPerUnit;
    
    // Function to convert data points to canvas coordinates
    const toCanvasX = (volume) => padding.left + (volume / maxVolume) * chartWidth;
    const toCanvasY = (profit) => height - padding.bottom - (profit / maxProfit) * chartHeight;
    
    // Draw the light green background
    ctx.fillStyle = '#f2f7f2'; // Light green background like in reference
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#dcdcdc'; // Light gray grid lines
    ctx.lineWidth = 1;
    
    // Draw vertical grid lines every 100 units
    for (let i = 0; i <= 1000; i += 100) {
      const x = toCanvasX(i);
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
    }
    
    // Calculate appropriate step size for Y-axis based on maxProfit
    let yStep;
    let yLabelMultiplier = 1;
    let yLabelSuffix = '';
    
    if (maxProfit > 2000000) {
      yStep = 500000;
      yLabelMultiplier = 1/1000000;
      yLabelSuffix = 'M JPY';
    } else if (maxProfit > 500000) {
      yStep = 250000;
      yLabelMultiplier = 1/1000000;
      yLabelSuffix = 'M JPY';
    } else {
      yStep = 100000;
      yLabelMultiplier = 1/1000;
      yLabelSuffix = 'K JPY';
    }
    
    // Draw horizontal grid lines
    for (let i = 0; i <= maxProfit; i += yStep) {
      const y = toCanvasY(i);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
    }
    ctx.stroke();
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#aaaaaa'; // Darker gray for axes
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    
    // Y-axis
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#666666';
    ctx.font = '11px sans-serif';
    
    for (let i = 0; i <= maxProfit; i += yStep) {
      const y = toCanvasY(i);
      const label = `${(i * yLabelMultiplier).toFixed(1)}${yLabelSuffix}`;
      
      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(padding.left - 5, y);
      ctx.lineTo(padding.left, y);
      ctx.stroke();
      
      // Draw label
      ctx.fillText(label, padding.left - 10, y);
    }
    
    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let i = 0; i <= 1000; i += 100) {
      const x = toCanvasX(i);
      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(x, height - padding.bottom);
      ctx.lineTo(x, height - padding.bottom + 5);
      ctx.stroke();
      
      // Draw label
      ctx.fillText(i.toString(), x, height - padding.bottom + 10);
    }
    
    // Axis titles
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#444444';
    
    // X-axis title
    ctx.textAlign = 'center';
    ctx.fillText('Monthly Sales Volume (units)', width / 2, height - 15);
    
    // Y-axis title
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Monthly Profit (JPY)', 0, 0);
    ctx.restore();
    
    // Draw the profit line from origin to maxVolume
    ctx.beginPath();
    ctx.strokeStyle = theme.palette.cmyk.yellow; // Yellow line
    ctx.lineWidth = 2;
    
    // Start point at origin (0,0)
    ctx.moveTo(toCanvasX(0), toCanvasY(0));
    
    // Create data points every 100 units
    for (let volume = 100; volume <= 1000; volume += 100) {
      const profit = volume * profitPerUnit;
      ctx.lineTo(toCanvasX(volume), toCanvasY(profit));
    }
    
    // Stroke the line
    ctx.stroke();
    
    // Mark current volume point
    if (currentVolume) {
      const pointX = toCanvasX(currentVolume);
      const pointY = toCanvasY(currentVolume * profitPerUnit);
      
      // Calculate tooltip position (placing it above the point)
      const tooltipX = pointX;
      const tooltipY = pointY - 40; // Position above the point
      
      // Draw vertical line to the current point
      ctx.beginPath();
      ctx.strokeStyle = '#999999';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.moveTo(pointX, height - padding.bottom);
      ctx.lineTo(pointX, pointY);
      ctx.stroke();
      
      // Reset dash
      ctx.setLineDash([]);
      
      // Draw the point
      ctx.beginPath();
      ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#666666';
      ctx.fill();
      
      // Draw tooltip background
      const tooltipWidth = 180;
      const tooltipHeight = 40;
      const tooltipLeft = Math.min(Math.max(tooltipX - tooltipWidth / 2, padding.left), width - padding.right - tooltipWidth); // Ensure stays within chart area
      
      ctx.fillStyle = 'rgba(80, 80, 80, 0.8)';
      ctx.fillRect(tooltipLeft, tooltipY - tooltipHeight / 2, tooltipWidth, tooltipHeight);
      
      // Draw tooltip text
      const tooltipText = `Volume: ${currentVolume}, Profit: ${formatCurrency(currentVolume * profitPerUnit)}`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(tooltipText, tooltipLeft + tooltipWidth / 2, tooltipY);
    }
    
  }, [salesPricePerUnit, costPerUnit, currentVolume, profitPerUnit, theme]);
  
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Profit vs. Sales Volume
      </Typography>
      
      {/* Canvas for line chart */}
      <Box sx={{ position: 'relative', width: '100%', height: '220px', display: 'flex', justifyContent: 'center' }}>
        <canvas ref={canvasRef} width={600} height={350} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Box>
      
      {/* Current profit info */}
      <Box sx={{ mt: 2, textAlign: 'center', bgcolor: '#f5f5f5', py: 1, px: 2, borderRadius: 1, width: 'auto' }}>
        <Typography variant="body1" fontWeight="600" color="text.primary">
          Profit per unit: <span style={{ color: theme.palette.primary.main }}>{formatCurrency(profitPerUnit)}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfitVolumeChart;
