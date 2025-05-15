import React, { useEffect, useRef } from 'react';
import { Box, Typography, useMediaQuery, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';

/**
 * CostBreakdownChart Component
 * Displays a donut chart showing the breakdown of costs using CMYK colors
 * Completely redesigned for better mobile display
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
    
    // Set the canvas size explicitly for mobile
    if (isMobile) {
      canvas.width = 240;
      canvas.height = 240;
    } else {
      canvas.width = 300;
      canvas.height = 300;
    }
    
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
    
    // Draw center circle for donut hole
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = theme.palette.background.paper;
    ctx.fill();
    
    // Format the total cost text with correct currency format
    let displayText;
    if (language === 'ja') {
      displayText = `${Math.round(totalCost).toLocaleString()}${t('currency')}`;
    } else {
      displayText = `${t('currency')} ${Math.round(totalCost).toLocaleString()}`;
    }
    
    // Draw total cost in center with optimized styling for mobile
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.palette.text.primary;
    
    // Adjust font size based on screen size
    const fontSize = isMobile ? 13 : 16;
    ctx.font = `bold ${fontSize}px ${theme.typography.fontFamily}`;
    ctx.fillText(displayText, centerX, centerY - 8);
    
    const subFontSize = isMobile ? 9 : 12;
    ctx.font = `${subFontSize}px ${theme.typography.fontFamily}`;
    ctx.fillStyle = theme.palette.text.secondary;
    ctx.fillText(t('totalCostPerUnit'), centerX, centerY + 8);
    
  }, [materialCost, inkCost, laborCost, theme, materialPercentage, inkPercentage, laborPercentage, colors.material, colors.ink, colors.labor, totalCost, language, t, isMobile]);
  
  // Use a different layout for mobile vs desktop
  if (isMobile) {
    return (
      <Box sx={{ width: '100%', p: 1 }}>
        <Typography variant="subtitle1" align="center" sx={{ fontSize: '0.9rem', mb: 1 }}>
          {t('costBreakdownPerUnit')}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start', 
          justifyContent: 'space-between',
          width: '100%',
          mb: 1
        }}>
          {/* Chart on the left */}
          <Box sx={{ 
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <canvas 
              ref={canvasRef} 
              style={{ 
                width: '120px', 
                height: '120px',
                maxWidth: '100%'
              }} 
            />
          </Box>
          
          {/* Legend on the right */}
          <Stack 
            spacing={0.8} 
            sx={{ 
              width: '50%',
              pl: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: colors.material, 
                mr: 1
              }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', lineHeight: 1.1, fontWeight: 500 }}>
                {t('material')}: {formatCurrency(materialCost)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', pl: 3, lineHeight: 1, color: 'text.secondary' }}>
              ({Math.round(materialPercentage)}%)
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Box sx={{ 
                width: 8, 
                height: 8,  
                borderRadius: '50%', 
                bgcolor: colors.ink, 
                mr: 1
              }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', lineHeight: 1.1, fontWeight: 500 }}>
                {t('ink')}: {formatCurrency(inkCost, true)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', pl: 3, lineHeight: 1, color: 'text.secondary' }}>
              ({Math.round(inkPercentage)}%)
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Box sx={{ 
                width: 8, 
                height: 8,  
                borderRadius: '50%', 
                bgcolor: colors.labor, 
                mr: 1
              }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', lineHeight: 1.1, fontWeight: 500 }}>
                {t('labor')}: {formatCurrency(laborCost, true)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', pl: 3, lineHeight: 1, color: 'text.secondary' }}>
              ({Math.round(laborPercentage)}%)
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  }
  
  // Desktop layout
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" align="center" gutterBottom>
        {t('costBreakdownPerUnit')}
      </Typography>
      
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '220px', 
        display: 'flex', 
        justifyContent: 'center'
      }}>
        <canvas 
          ref={canvasRef}
          style={{ maxWidth: '100%', maxHeight: '100%' }} 
        />
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        gap: 3, 
        mt: 2,
        width: '100%',
        maxWidth: '500px'
      }}>
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
            {t('material')}: {formatCurrency(materialCost)} ({Math.round(materialPercentage)}%)
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
            {t('ink')}: {formatCurrency(inkCost)} ({Math.round(inkPercentage)}%)
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
            {t('labor')}: {formatCurrency(laborCost)} ({Math.round(laborPercentage)}%)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CostBreakdownChart;