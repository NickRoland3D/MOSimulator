import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';

/**
 * PaybackGauge Component
 * Modern minimal gauge with rounded lines and pastel colors
 */
const PaybackGauge = ({ paybackPeriod }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage(); // Get translation function
  const canvasRef = useRef(null);
  
  // Handle "no profit" case
  const noProfitCase = paybackPeriod === '-';
  
  // Define solid colors for the gauge segments (matching the reference)
  const colors = useMemo(() => ({
    good: '#4CAF50',      // Solid green for 0-12 months
    average: '#FF9800',   // Solid orange for 12-24 months
    warning: '#F44336',   // Solid red for 24-60 months
    noProfit: '#9E9E9E'   // Solid gray for no profit
  }), []);
  
  // Get the needle and value color based on the gauge section
  const getValueColor = useCallback(() => {
    if (noProfitCase) return '#9E9E9E'; // Gray
    if (paybackPeriod <= 12) return '#4CAF50'; // Green
    if (paybackPeriod <= 24) return '#FF9800'; // Orange
    return '#F44336'; // Red
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
    
    // Gauge radius - smaller on mobile
    const radius = Math.min(centerX, centerY) * (isMobile ? 0.8 : 0.85);
    
    // Gauge angles
    const startAngle = Math.PI;        // 180 degrees (left)
    const endAngle = 2 * Math.PI;      // 360 degrees (right)
    const totalAngle = endAngle - startAngle;
    
    // Gauge thickness
    const thickness = radius * (isMobile ? 0.25 : 0.2);
    
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
    
    // Draw minimal labels - smaller for mobile
    ctx.fillStyle = '#757575';
    ctx.font = isMobile ? '10px Arial' : '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Only draw labels for 0, 12, 24, 60
    const majorTicks = [0, 12, 24, 60];
    const labelColors = {
      0: '#757575',
      12: '#4CAF50', // Green
      24: '#FF9800', // Orange
      60: '#757575'
    };
    
    for (let i of majorTicks) {
      const percent = i / 60; // Now based on max value of 60
      const angle = startAngle + (percent * totalAngle);
      
      // Draw label
      const labelX = centerX + (radius + (isMobile ? 10 : 15)) * Math.cos(angle);
      const labelY = centerY + (radius + (isMobile ? 10 : 15)) * Math.sin(angle);
      
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
    ctx.lineWidth = isMobile ? 6 : 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = needleColor;
    ctx.stroke();
    
    // Draw blue circular pivot point
    ctx.beginPath();
    ctx.arc(centerX, centerY, isMobile ? 6 : 8, 0, Math.PI * 2);
    ctx.fillStyle = '#64b5f6'; // Light blue
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    
  }, [paybackPeriod, noProfitCase, colors, getValueColor, isMobile]);
  
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      py: isMobile ? 1 : 2
    }}>
      <Typography variant={isMobile ? "subtitle1" : "h6"} align="center" gutterBottom>
        {t('investmentPaybackPeriod')}
      </Typography>
      
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: isMobile ? '160px' : '200px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <canvas ref={canvasRef} width={400} height={250} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Box>
      
      {/* Value display - large, colored, and centered */}
      <Typography
        variant={isMobile ? "h4" : "h3"}
        align="center"
        sx={{
          fontWeight: 'bold',
          color: getValueColor(),
          mt: isMobile ? -1 : -2,
          mb: isMobile ? 0.5 : 1
        }}
      >
        {noProfitCase ? '-' : `${paybackPeriod.toFixed(1)} ${t('months')}`}
      </Typography>
      
      <Typography 
        variant={isMobile ? "body2" : "body1"}
        align="center" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {noProfitCase 
          ? t('noProfitWithCurrentParameters') 
          : paybackPeriod <= 12 
            ? t('excellentPaybackPeriod') 
            : paybackPeriod <= 24 
              ? t('goodPaybackPeriod') 
              : t('extendedPaybackPeriod')}
      </Typography>
    </Box>
  );
};

export default PaybackGauge;