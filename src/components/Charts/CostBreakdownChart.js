import React, { useEffect, useRef } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';

/**
 * CostBreakdownChart Component
 * Displays a donut chart showing the breakdown of costs using CMYK colors
 */
const CostBreakdownChart = ({ materialCost, inkCost, laborCost }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, language } = useLanguage(); // Get translation function and language
  const canvasRef = useRef(null);
  
  // Calculate total cost and percentages
  const totalCost = materialCost + inkCost + laborCost;
  const materialPercentage = (materialCost / totalCost) * 100;
  const inkPercentage = (inkCost / totalCost) * 100;
  const laborPercentage = (laborCost / totalCost) * 100;
  
  // Format currency with thousands separators - updated for Japanese format and estimates
  const formatCurrency = (amount, isEstimate = false) => {
    if (language === 'ja') {
      return isEstimate 
        ? `約${Math.round(amount).toLocaleString()}${t('currency')}` 
        : `${Math.round(amount).toLocaleString()}${t('currency')}`;
    }
    return `${t('currency')} ${Math.round(amount).toLocaleString()}`;
  };
  
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
    const radius = Math.min(centerX, centerY) * (isMobile ? 0.75 : 0.8);
    const innerRadius = radius * (isMobile ? 0.55 : 0.6); // Donut hole size
    
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
    
    // Format the total cost text with correct currency format
    let displayText;
    if (language === 'ja') {
      displayText = `${Math.round(totalCost).toLocaleString()}${t('currency')}`;
    } else {
      displayText = `${t('currency')} ${Math.round(totalCost).toLocaleString()}`;
    }
    
    // Draw total cost in center with enhanced styling - smaller font on mobile
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = `bold ${isMobile ? '12px' : '16px'} ${theme.typography.fontFamily}`;
    ctx.fillText(displayText, centerX, centerY - (isMobile ? 6 : 10));
    
    ctx.font = `${isMobile ? '9px' : '12px'} ${theme.typography.fontFamily}`;
    ctx.fillStyle = theme.palette.text.secondary;
    ctx.fillText(t('totalCostPerUnit'), centerX, centerY + (isMobile ? 10 : 15));
    
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
    
  }, [materialCost, inkCost, laborCost, theme, materialPercentage, inkPercentage, laborPercentage, colors.material, colors.ink, colors.labor, totalCost, language, t, isMobile]);
  
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant={isMobile ? "subtitle1" : "h6"} align="center" gutterBottom>
        {t('costBreakdownPerUnit')}
      </Typography>
      
      {/* Canvas for donut chart */}
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: isMobile ? '150px' : '220px', 
        display: 'flex', 
        justifyContent: 'center',
        mb: 1
      }}>
        <canvas ref={canvasRef} width={300} height={300} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Box>
      
      {/* Legend with enhanced styling - more compact on mobile */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start', 
        gap: 0.5, 
        mt: isMobile ? 1 : 2,
        px: isMobile ? 2 : 0,
        width: '100%',
        maxWidth: '100%',
        '& > div': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 0.5 : 0 }}>
          <Box sx={{ 
            width: isMobile ? 8 : 12, 
            height: isMobile ? 8 : 12, 
            borderRadius: '50%', 
            bgcolor: colors.material, 
            mr: 1,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
          }} />
          <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
            {t('material')}: {formatCurrency(materialCost)} ({Math.round(materialPercentage)}%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 0.5 : 0 }}>
          <Box sx={{ 
            width: isMobile ? 8 : 12, 
            height: isMobile ? 8 : 12, 
            borderRadius: '50%', 
            bgcolor: colors.ink, 
            mr: 1,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
          }} />
          <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
            {t('ink')}: {language === 'ja' ? formatCurrency(inkCost, true) : formatCurrency(inkCost)} ({Math.round(inkPercentage)}%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 0.5 : 0 }}>
          <Box sx={{ 
            width: isMobile ? 8 : 12, 
            height: isMobile ? 8 : 12,  
            borderRadius: '50%', 
            bgcolor: colors.labor, 
            mr: 1,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
          }} />
          <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
            {t('labor')}: {language === 'ja' ? formatCurrency(laborCost, true) : formatCurrency(laborCost)} ({Math.round(laborPercentage)}%)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CostBreakdownChart;