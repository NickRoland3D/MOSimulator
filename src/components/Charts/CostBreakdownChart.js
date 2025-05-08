import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * CostBreakdownChart Component
 * Displays a donut chart showing the breakdown of costs using CMYK colors
 */
const CostBreakdownChart = ({ materialCost, inkCost, laborCost }) => {
  const theme = useTheme();
  const canvasRef = useRef(null);
  
  // Calculate total cost and percentages
  const totalCost = materialCost + inkCost + laborCost;
  const materialPercentage = (materialCost / totalCost) * 100;
  const inkPercentage = (inkCost / totalCost) * 100;
  const laborPercentage = (laborCost / totalCost) * 100;
  
  // Format currency with thousands separators
  const formatCurrency = (amount) => `JPY ${Math.round(amount).toLocaleString()}`;
  
  // CMYK-inspired colors for the chart segments as specified in PRD
  const colors = {
    material: theme.palette.cmyk.cyan,      // Material = Cyan
    ink: theme.palette.cmyk.magenta,        // Ink = Magenta
    labor: theme.palette.cmyk.yellow        // Labor = Yellow
  };
  
  // Draw the donut chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = radius * 0.6; // Donut hole size
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw donut segments with enhanced styling
    const drawSegment = (startAngle, endAngle, color) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      
      // Add highlight effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    
    // Convert percentages to radians
    const materialAngle = (materialPercentage / 100) * Math.PI * 2;
    const inkAngle = (inkPercentage / 100) * Math.PI * 2;
    const laborAngle = (laborPercentage / 100) * Math.PI * 2;
    
    // Starting angle (top of circle)
    let startAngle = -Math.PI / 2;
    
    // Draw segments
    drawSegment(startAngle, startAngle + materialAngle, colors.material);
    startAngle += materialAngle;
    
    drawSegment(startAngle, startAngle + inkAngle, colors.ink);
    startAngle += inkAngle;
    
    drawSegment(startAngle, startAngle + laborAngle, colors.labor);
    
    // Draw center circle for donut hole with shadow
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = theme.palette.background.paper;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // Draw total cost in center with enhanced styling
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = 'bold 16px ' + theme.typography.fontFamily;
    ctx.fillText(formatCurrency(totalCost), centerX, centerY - 10);
    
    ctx.font = '12px ' + theme.typography.fontFamily;
    ctx.fillStyle = theme.palette.text.secondary;
    ctx.fillText('Total Cost per Unit', centerX, centerY + 15);
    
    // Add 3D effect to segments (subtle shadow)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    // Redraw segments with shadow for 3D effect
    startAngle = -Math.PI / 2;
    ctx.globalAlpha = 0.1;
    
    drawSegment(startAngle, startAngle + materialAngle, 'rgba(0, 0, 0, 0.2)');
    startAngle += materialAngle;
    
    drawSegment(startAngle, startAngle + inkAngle, 'rgba(0, 0, 0, 0.2)');
    startAngle += inkAngle;
    
    drawSegment(startAngle, startAngle + laborAngle, 'rgba(0, 0, 0, 0.2)');
    
    // Reset settings
    ctx.globalAlpha = 1;
    ctx.shadowColor = 'transparent';
    
  }, [materialCost, inkCost, laborCost, theme]);
  
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Cost Breakdown per Unit
      </Typography>
      
      {/* Canvas for donut chart */}
      <Box sx={{ position: 'relative', width: '100%', height: '220px', display: 'flex', justifyContent: 'center' }}>
        <canvas ref={canvasRef} width={300} height={300} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Box>
      
      {/* Legend with enhanced styling */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            bgcolor: colors.material, 
            mr: 1,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
          }} />
          <Typography variant="body2" fontWeight={500}>
            Material: {formatCurrency(materialCost)} ({Math.round(materialPercentage)}%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            bgcolor: colors.ink, 
            mr: 1,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
          }} />
          <Typography variant="body2" fontWeight={500}>
            Ink: {formatCurrency(inkCost)} ({Math.round(inkPercentage)}%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            bgcolor: colors.labor, 
            mr: 1,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
          }} />
          <Typography variant="body2" fontWeight={500}>
            Labor: {formatCurrency(laborCost)} ({Math.round(laborPercentage)}%)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CostBreakdownChart;
