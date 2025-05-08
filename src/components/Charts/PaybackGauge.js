import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * PaybackGauge Component
 * Modern minimal gauge with rounded lines and pastel colors
 */
const PaybackGauge = ({ paybackPeriod }) => {
  const canvasRef = useRef(null);
  
  // Handle "no profit" case
  const noProfitCase = paybackPeriod === '-';
  
  // Define pastel colors for the gauge segments (matching the reference)
  const colors = useMemo(() => ({
    good: '#c8e6c9',      // Light pastel green for 0-12 months
    average: '#fff3e0',   // Light pastel peach for 12-24 months
    warning: '#ffebee',   // Light pastel pink for 24-60 months
    noProfit: '#f5f5f5'   // Light gray for no profit
  }), []);
  
  // Get the needle and value color based on the gauge section
  const getValueColor = useCallback(() => {
    if (noProfitCase) return '#9e9e9e';
    if (paybackPeriod <= 12) return '#78b47d'; // Green
    if (paybackPeriod <= 24) return '#f5b040'; // Orange/peach
    return '#e57373'; // Red/pink
  }, [noProfitCase, paybackPeriod]);
  
  // Draw the gauge using canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Center of the gauge
    const centerX = width / 2;
    const centerY = height * 0.55; // Position gauge in the middle
    
    // Gauge radius
    const radius = Math.min(centerX, centerY) * 0.85;
    
    // Gauge angles
    const startAngle = Math.PI;        // 180 degrees (left)
    const endAngle = 2 * Math.PI;      // 360 degrees (right)
    const totalAngle = endAngle - startAngle;
    
    // Gauge thickness
    const thickness = radius * 0.2;
    
    // Draw a light gray circle border around the gauge
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, startAngle, endAngle);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw the gauge background (3 colored segments with rounded ends)
    const drawGaugeSegment = (startPercent, endPercent, color) => {
      const segmentStartAngle = startAngle + (startPercent * totalAngle);
      const segmentEndAngle = startAngle + (endPercent * totalAngle);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, segmentStartAngle, segmentEndAngle);
      ctx.arc(centerX, centerY, radius - thickness, segmentEndAngle, segmentStartAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
    
    // Draw three colored segments
    drawGaugeSegment(0, 0.2, colors.good);     // Green (0-12 months)
    drawGaugeSegment(0.2, 0.4, colors.average); // Peach (12-24 months)
    drawGaugeSegment(0.4, 1, colors.warning);  // Pink (24-60 months)
    
    // Draw minimal labels
    ctx.fillStyle = '#757575';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Only draw labels for 0, 12, 24, 60
    const majorTicks = [0, 12, 24, 60];
    const labelColors = {
      0: '#757575',
      12: '#78b47d', // Green
      24: '#f5b040', // Orange/peach
      60: '#757575'
    };
    
    for (let i of majorTicks) {
      const percent = i / 60; // Now based on max value of 60
      const angle = startAngle + (percent * totalAngle);
      
      // Draw label
      const labelX = centerX + (radius + 15) * Math.cos(angle);
      const labelY = centerY + (radius + 15) * Math.sin(angle);
      
      // Set label color
      ctx.fillStyle = labelColors[i];
      ctx.fillText(i.toString(), labelX, labelY);
    }
    
    // Calculate needle position based on payback period
    let needleValue = noProfitCase ? 60 : Math.min(paybackPeriod, 60);
    const needlePercent = needleValue / 60; // Now based on max value of 60
    const needleAngle = startAngle + (needlePercent * totalAngle);
    
    // Draw thick colored needle
    const needleLength = radius * 0.85;
    const needleColor = getValueColor();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + needleLength * Math.cos(needleAngle),
      centerY + needleLength * Math.sin(needleAngle)
    );
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = needleColor;
    ctx.stroke();
    
    // Draw blue circular pivot point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#64b5f6'; // Light blue
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    
  }, [paybackPeriod, noProfitCase, colors, getValueColor]);
  
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      py: 2
    }}>
      <Typography variant="h6" align="center" gutterBottom>
        Investment Payback Period
      </Typography>
      
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '200px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <canvas ref={canvasRef} width={400} height={250} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Box>
      
      {/* Value display - large, colored, and centered */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: getValueColor(),
          mt: -2,
          mb: 1
        }}
      >
        {noProfitCase ? '-' : `${paybackPeriod.toFixed(1)} months`}
      </Typography>
      
      <Typography 
        variant="body1" 
        align="center" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {noProfitCase 
          ? 'No profit with current parameters' 
          : paybackPeriod <= 12 
            ? 'Excellent payback period' 
            : paybackPeriod <= 24 
              ? 'Good payback period' 
              : 'Extended payback period'}
      </Typography>
    </Box>
  );
};

export default PaybackGauge;
