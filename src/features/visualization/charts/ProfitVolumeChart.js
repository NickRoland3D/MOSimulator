import React, { useEffect, useRef, useCallback } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../../context/LanguageContext';

const ProfitVolumeChart = ({ salesPricePerUnit, costPerUnit, currentVolume }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, language } = useLanguage();
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef({ 
    ctx: null, 
    width: 0, 
    height: 0, 
    // Adjusted padding for mobile view
    padding: { 
      left: 0, 
      right: 0, 
      top: 0, 
      bottom: 0 
    }, 
    maxVolume: 1000,
    niceMaxProfit: 0,
    yStep: 0,
    profitPerUnit: 0,
    currentHoverData: null // To store data for the current hover position
  });

  const profitPerUnit = salesPricePerUnit - costPerUnit;
  chartInstanceRef.current.profitPerUnit = profitPerUnit; // Store for use in draw functions

  // Update padding based on screen size
  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (isMobile) {
      chart.padding = { left: 70, right: 20, top: 50, bottom: 65 };
    } else {
      chart.padding = { left: 100, right: 30, top: 60, bottom: 70 };
    }
  }, [isMobile]);

  const formatCurrency = useCallback((amount, short = false) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    const currencySymbol = t('currency');
    
    if (short) {
      if (Math.abs(amount) >= 1000000) {
        const value = (amount / 1000000).toFixed(1);
        return language === 'ja' ? `${value}百万${currencySymbol}` : `${currencySymbol} ${value}M`;
      } else if (Math.abs(amount) >= 1000) {
        const value = (amount / 1000).toFixed(0); // No decimal for K to avoid clutter
        return language === 'ja' ? `${value}千${currencySymbol}` : `${currencySymbol} ${value}K`;
      }
      return language === 'ja' ? `${Math.round(amount)}${currencySymbol}` : `${currencySymbol} ${Math.round(amount)}`;
    }
    return language === 'ja' ? `${Math.round(amount).toLocaleString('ja-JP')}${currencySymbol}` : `${currencySymbol} ${Math.round(amount).toLocaleString('en-US')}`;
  }, [t, language]);

  const calculateNiceStep = (maxValue, targetSteps = 5) => {
    if (maxValue <= 0) return 10000; // Default step if no profit or negative
    const rawStep = maxValue / targetSteps;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const mantissa = rawStep / magnitude;
    let niceStep;
    if (mantissa < 1.5) niceStep = 1;
    else if (mantissa < 3) niceStep = 2;
    else if (mantissa < 7) niceStep = 5;
    else niceStep = 10;
    return Math.max(1, niceStep * magnitude); // Ensure step is at least 1
  };

  const toCanvasX = useCallback((volume) => {
    const chart = chartInstanceRef.current;
    return chart.padding.left + (volume / chart.maxVolume) * (chart.width - chart.padding.left - chart.padding.right);
  }, []);

  const toCanvasY = useCallback((profit) => {
    const chart = chartInstanceRef.current;
    // Handle case where niceMaxProfit might be 0 or negative
    const effectiveMaxProfit = chart.niceMaxProfit <= 0 ? 1 : chart.niceMaxProfit;
    const chartHeight = chart.height - chart.padding.top - chart.padding.bottom;
    // Adjust for Y-axis starting at 0 or a negative value
    const zeroY = chart.niceMinProfit >= 0 ? 0 : chart.niceMinProfit;
    const totalYRange = effectiveMaxProfit - zeroY;
    if (totalYRange <= 0) return chart.height - chart.padding.bottom; // Avoid division by zero

    return chart.height - chart.padding.bottom - ((profit - zeroY) / totalYRange) * chartHeight;
  }, []);


  // --- Drawing Functions ---
  const drawBackground = useCallback(() => {
    const chart = chartInstanceRef.current;
    const { ctx, width, height } = chart;
    ctx.fillStyle = '#f7f9f7'; // Very light green/grayish background
    ctx.fillRect(0, 0, width, height);
    
    // Draw chart title at the top
    ctx.font = `bold ${isMobile ? '12px' : '14px'} sans-serif`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const chartTitle = language === 'ja' ? '利益と販売量の関係' : 'Profit vs. Sales Volume';
    ctx.fillText(chartTitle, width / 2, isMobile ? 10 : 20);
  }, [language, isMobile]);

  const drawGridAndAxes = useCallback(() => {
    const chart = chartInstanceRef.current;
    const { ctx, width, height, padding, niceMaxProfit, niceMinProfit, yStep, maxVolume } = chart;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical grid lines (reduce frequency on mobile)
    const xStep = isMobile ? 200 : 100;
    for (let i = 0; i <= maxVolume; i += xStep) {
      const x = toCanvasX(i);
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
    }

    // Horizontal grid lines
    for (let i = niceMinProfit; i <= niceMaxProfit; i += yStep) {
      // Ensure we don't draw too many lines if yStep is very small relative to range
      if ((niceMaxProfit - niceMinProfit) / yStep > 20 && i !== 0 && i !== niceMinProfit && i !== niceMaxProfit) {
          if (i % (yStep * 2) !== 0 && i !== 0) continue; // Skip some lines if too dense
      }
      const y = toCanvasY(i);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
    }
    ctx.stroke();

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 1.5;
    ctx.moveTo(padding.left, height - padding.bottom); // X-axis
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.moveTo(padding.left, padding.top); // Y-axis
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
  }, [toCanvasX, toCanvasY, isMobile]);

  const drawLabelsAndTitles = useCallback(() => {
    const chart = chartInstanceRef.current;
    const { ctx, width, height, padding, niceMaxProfit, niceMinProfit, yStep, maxVolume } = chart;

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#555555'; // Darker for better readability
    ctx.font = `${isMobile ? '10px' : '11px'} sans-serif`;

    // Use fewer labels on mobile
    const yLabelStep = isMobile ? yStep * 2 : yStep;
    
    for (let i = niceMinProfit; i <= niceMaxProfit; i += yLabelStep) {
       if ((niceMaxProfit - niceMinProfit) / yLabelStep > 20 && i !== 0 && i !== niceMinProfit && i !== niceMaxProfit) {
          if (i % (yLabelStep * 2) !== 0 && i !== 0) continue;
      }
      const y = toCanvasY(i);
      ctx.fillText(formatCurrency(i, true), padding.left - 10, y);
    }

    // X-axis labels - fewer labels on mobile
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xLabelStep = isMobile ? (maxVolume >= 500 ? 200 : 100) : (maxVolume >= 500 ? 100 : 50);
    
    for (let i = 0; i <= maxVolume; i += xLabelStep) {
      const x = toCanvasX(i);
      ctx.fillText(i.toString(), x, height - padding.bottom + 8);
    }

    // Axis titles
    ctx.font = `bold ${isMobile ? '10px' : '12px'} sans-serif`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    
    // X-axis title - Use default text if translation key fails
    const xAxisTitle = language === 'ja' ? '月間販売量 (個)' : 'Monthly Sales Volume (units)';
    ctx.fillText(xAxisTitle, 
                 padding.left + (width - padding.left - padding.right) / 2, 
                 height - padding.bottom + (isMobile ? 22 : 30));

    // Y-axis title - Use default text if translation key fails
    const yAxisTitle = language === 'ja' ? '月間利益 (円)' : 'Monthly Profit (JPY)';
    ctx.save();
    // Moved position further left to avoid overlap with Y-axis labels
    // Position at 15 pixels from the left edge of the canvas
    ctx.translate(isMobile ? 10 : 15, padding.top + (height - padding.top - padding.bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(yAxisTitle, 0, 0);
    ctx.restore();
  }, [toCanvasX, toCanvasY, formatCurrency, language, isMobile]);

  const drawProfitLine = useCallback(() => {
    const chart = chartInstanceRef.current;
    const { ctx, profitPerUnit, maxVolume } = chart;

    ctx.beginPath();
    // Use theme color, ensure theme.palette.cmyk.yellow is defined
    ctx.strokeStyle = theme.palette.cmyk?.yellow || '#FFD700'; 
    ctx.lineWidth = 2.5;
    
    ctx.moveTo(toCanvasX(0), toCanvasY(0)); // Start at 0,0
    for (let volume = 0; volume <= maxVolume; volume += 10) { // Plot points for the line
      const profit = volume * profitPerUnit;
      ctx.lineTo(toCanvasX(volume), toCanvasY(profit));
    }
    ctx.stroke();
  }, [toCanvasX, toCanvasY, theme.palette.cmyk?.yellow]);

  const drawTooltipAndPoint = useCallback((volume, profit) => {
    const chart = chartInstanceRef.current;
    const { ctx, height, padding, profitPerUnit } = chart;
    if (!ctx) return;

    const pointX = toCanvasX(volume);
    const pointY = toCanvasY(profit);

    // Dashed line
    ctx.beginPath();
    ctx.strokeStyle = '#888888';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.moveTo(pointX, height - padding.bottom);
    ctx.lineTo(pointX, pointY);
    ctx.moveTo(padding.left, pointY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Point
    ctx.beginPath();
    ctx.arc(pointX, pointY, isMobile ? 4 : 5, 0, Math.PI * 2);
    ctx.fillStyle = theme.palette.cmyk?.yellow || '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tooltip - simplified for mobile
    const volumeLabel = language === 'ja' ? '販売量' : 'Volume';
    const profitLabel = language === 'ja' ? '利益' : 'Profit';
    const tooltipText = `${volumeLabel}: ${volume}, ${profitLabel}: ${formatCurrency(profit)}`;

    // Smaller font on mobile
    ctx.font = `bold ${isMobile ? '10px' : '11px'} sans-serif`;
    const textWidth = ctx.measureText(tooltipText).width;
    const tooltipWidth = Math.max(textWidth) + 20;
    const tooltipHeight = isMobile ? 24 : 30; // Smaller height on mobile
    
    let tooltipX = pointX + 15;
    let tooltipY = pointY - 15 - tooltipHeight;

    // Adjust tooltip position to stay within canvas
    if (tooltipX + tooltipWidth > chart.width - chart.padding.right) {
      tooltipX = pointX - 15 - tooltipWidth;
    }
    if (tooltipY < chart.padding.top) {
      tooltipY = pointY + 15;
    }

    // If tooltip still goes out of bounds on mobile, position it at the top right corner
    if (isMobile && (tooltipX < 0 || tooltipX + tooltipWidth > chart.width || tooltipY < 0 || tooltipY + tooltipHeight > chart.height)) {
      tooltipX = chart.width - tooltipWidth - 10; 
      tooltipY = chart.padding.top + 10;
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5); // Using roundRect
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(tooltipText, tooltipX + 10, tooltipY + tooltipHeight / 2);

  }, [toCanvasX, toCanvasY, formatCurrency, theme.palette.cmyk?.yellow, language, isMobile]);


  // Main drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof salesPricePerUnit !== 'number' || typeof costPerUnit !== 'number') {
      // Clear canvas if data is invalid or not present
      if(canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }
    
    const chart = chartInstanceRef.current;
    chart.ctx = canvas.getContext('2d');
    chart.width = canvas.width;
    chart.height = canvas.height;
    chart.profitPerUnit = salesPricePerUnit - costPerUnit;

    // Calculate Y-axis scale
    const maxPossibleProfit = chart.maxVolume * chart.profitPerUnit;
    const minPossibleProfit = 0 * chart.profitPerUnit; // Could be negative if profitPerUnit is negative

    if (chart.profitPerUnit > 0) {
        chart.niceMinProfit = 0;
        chart.niceMaxProfit = Math.ceil((maxPossibleProfit * 1.1) / calculateNiceStep(maxPossibleProfit * 1.1)) * calculateNiceStep(maxPossibleProfit * 1.1);
        if (chart.niceMaxProfit <=0) chart.niceMaxProfit = calculateNiceStep(100000); // Default if profit is tiny
    } else { // Handles zero or negative profit per unit
        chart.niceMaxProfit = calculateNiceStep(100000); // A small positive default max
        chart.niceMinProfit = Math.floor((minPossibleProfit * 1.1) / calculateNiceStep(Math.abs(minPossibleProfit * 1.1))) * calculateNiceStep(Math.abs(minPossibleProfit * 1.1));
        if (chart.niceMinProfit >=0 && minPossibleProfit < 0) chart.niceMinProfit = -calculateNiceStep(100000); // Default negative if profit is tiny negative
        if (chart.profitPerUnit === 0) chart.niceMinProfit = 0;
    }
    // Ensure niceMaxProfit is always greater than niceMinProfit
    if (chart.niceMaxProfit <= chart.niceMinProfit) {
        chart.niceMaxProfit = chart.niceMinProfit + calculateNiceStep(Math.abs(chart.niceMinProfit) || 100000);
    }

    chart.yStep = calculateNiceStep(chart.niceMaxProfit - chart.niceMinProfit, isMobile ? 3 : 5);
    if (chart.yStep === 0) chart.yStep = (chart.niceMaxProfit - chart.niceMinProfit) / (isMobile ? 3 : 5) || 1;


    // --- Main Draw Function (Static Elements) ---
    const drawStaticChart = () => {
        chart.ctx.clearRect(0, 0, chart.width, chart.height);
        drawBackground();
        drawGridAndAxes();
        drawLabelsAndTitles();
        drawProfitLine();
    };

    drawStaticChart(); // Initial draw of static elements

    // Draw the point for currentVolume (if provided) on top of the static chart
    if (typeof currentVolume === 'number') {
        const currentProfit = currentVolume * chart.profitPerUnit;
        // Store it for potential redraw on hover end
        chart.currentHoverData = { volume: currentVolume, profit: currentProfit, isCurrentVolumePoint: true };
        drawTooltipAndPoint(currentVolume, currentProfit);
    } else {
        chart.currentHoverData = null;
    }

    // --- Mouse Move Handler for Tooltips (More Efficient) ---
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const { padding, width, height, maxVolume, profitPerUnit } = chartInstanceRef.current;

      if (mouseX >= padding.left && mouseX <= width - padding.right &&
          mouseY >= padding.top && mouseY <= height - padding.bottom) {
        
        const volume = Math.max(0, Math.min(maxVolume, Math.round(((mouseX - padding.left) / (width - padding.left - padding.right)) * maxVolume)));
        const profit = volume * profitPerUnit;

        // Redraw static parts, then the new hover point
        drawStaticChart(); 
        chartInstanceRef.current.currentHoverData = { volume, profit, isCurrentVolumePoint: false };
        drawTooltipAndPoint(volume, profit);

      } else {
        // If mouse moves out, redraw static chart and the original currentVolume point if it exists
        if (chartInstanceRef.current.currentHoverData && !chartInstanceRef.current.currentHoverData.isCurrentVolumePoint) {
            drawStaticChart();
            if (typeof currentVolume === 'number') {
                const cvProfit = currentVolume * chartInstanceRef.current.profitPerUnit;
                chartInstanceRef.current.currentHoverData = { volume: currentVolume, profit: cvProfit, isCurrentVolumePoint: true };
                drawTooltipAndPoint(currentVolume, cvProfit);
            } else {
                chartInstanceRef.current.currentHoverData = null;
            }
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    // Optional: Add a mouseleave listener to clear the hover tooltip and redraw the currentVolume point
    const handleMouseLeave = () => {
        drawStaticChart();
        if (typeof currentVolume === 'number') {
            const cvProfit = currentVolume * chartInstanceRef.current.profitPerUnit;
            chartInstanceRef.current.currentHoverData = { volume: currentVolume, profit: cvProfit, isCurrentVolumePoint: true };
            drawTooltipAndPoint(currentVolume, cvProfit);
        } else {
            chartInstanceRef.current.currentHoverData = null;
        }
    };
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Touch handler for mobile
    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        const { padding, width, height, maxVolume, profitPerUnit } = chartInstanceRef.current;

        if (touchX >= padding.left && touchX <= width - padding.right &&
            touchY >= padding.top && touchY <= height - padding.bottom) {
          
          const volume = Math.max(0, Math.min(maxVolume, Math.round(((touchX - padding.left) / (width - padding.left - padding.right)) * maxVolume)));
          const profit = volume * profitPerUnit;

          // Redraw static parts, then the new touch point
          drawStaticChart();
          chartInstanceRef.current.currentHoverData = { volume, profit, isCurrentVolumePoint: false };
          drawTooltipAndPoint(volume, profit);
          
          // Prevent scrolling while interacting with the chart
          e.preventDefault();
        }
      }
    };

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });

    // Remove touch listeners on cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
    };

  }, [
    salesPricePerUnit, 
    costPerUnit, 
    currentVolume, 
    theme, // theme.palette.cmyk.yellow is used
    language, t, // For localization in formatCurrency and titles
    formatCurrency, calculateNiceStep, toCanvasX, toCanvasY, // Memoized helpers
    drawBackground, drawGridAndAxes, drawLabelsAndTitles, drawProfitLine, drawTooltipAndPoint, // Memoized draw functions
    isMobile // Added isMobile dependency
  ]);
  
  // Dynamic aspect ratio for mobile
  const aspectRatio = isMobile ? '4 / 3' : '16 / 9';
  
  return (
    <Box sx={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: isMobile ? '100%' : '600px', 
        aspectRatio: aspectRatio, 
        mb: 2 
      }}> 
        <canvas 
            ref={canvasRef} 
            width={600}  /* Base width */
            height={isMobile ? 450 : 337.5} /* Adjusted height for mobile */
            style={{ display: 'block', width: '100%', height: '100%'}} 
        />
      </Box>
    </Box>
  );
};

export default ProfitVolumeChart;