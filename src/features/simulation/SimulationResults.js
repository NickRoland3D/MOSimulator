import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button,
  Fade,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';
import { getPaybackStatus } from '../../services/calculationService';
import { lazyLoad } from '../../utils/code-splitting';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import { printResults } from '../../utils/pdf/generatePDF';
import { PRINTER_SPECIFICATIONS } from '../../config/constants';

// Lazy load the charts for better performance
const ChartTabs = lazyLoad(() => import('../visualization/ChartTabs'));

/**
 * SimulationResults Component
 * Displays the calculated results with enhanced styling and charts
 */
const SimulationResults = ({ results, isCalculating = false, onError }) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const [isPrinting, setIsPrinting] = useState(false);
  
  // Add inputs to results for charts
  const enhancedResults = {
    ...results,
    language,
    inputs: {
      ...results.inputs,
      salesPricePerUnit: results.monthlySales / results.inputs?.monthlySalesVolume || 0,
      monthlySalesVolume: results.inputs?.monthlySalesVolume || 0
    },
    // Ensure initialInvestment is included - either from results or config
    initialInvestment: results.initialInvestment || PRINTER_SPECIFICATIONS.initialInvestment
  };
  
  // Determine the background color based on payback period
  const paybackStatus = getPaybackStatus(results.paybackPeriod);
  
  // Status tag content and colors with enhanced styling
  const getStatusInfo = () => {
    switch(paybackStatus) {
      case 'good':
        return {
          title: t('excellentInvestment'),
          color: '#FFFFFF',
          backgroundColor: theme.palette.success.main,
          icon: '✓'
        };
      case 'average':
        return {
          title: t('goodInvestment'),
          color: '#FFFFFF',
          backgroundColor: theme.palette.warning.main,
          icon: '!'
        };
      case 'warning':
        return {
          title: t('considerCarefully'),
          color: '#FFFFFF',
          backgroundColor: theme.palette.error.main,
          icon: '⚠'
        };
      case 'no-profit':
        return {
          title: t('notProfitable'),
          color: '#FFFFFF',
          backgroundColor: '#757575',
          icon: '×'
        };
      default:
        return {
          title: t('simulationResults'),
          color: '#FFFFFF',
          backgroundColor: theme.palette.primary.main,
          icon: 'i'
        };
    }
  };
  
  const statusInfo = getStatusInfo();

  // Custom result card component with animations
  const ResultCard = ({ title, value, large = false }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant={large ? "h4" : "h5"}
        component="div"
        fontWeight="bold"
        color="text.primary"
        sx={{ 
          wordBreak: "break-word",
          transition: "all 0.3s ease-in-out",
        }}
        className="animate-number"
      >
        {value}
      </Typography>
    </Box>
  );
  
  // Small stat component with animations
  const SmallStat = ({ title, value }) => (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        fontWeight="bold"
        className="animate-number"
      >
        {value}
      </Typography>
    </Box>
  );

  // Handler for print-to-PDF function
  const handlePrintResults = async () => {
    try {
      setIsPrinting(true);
      await printResults(enhancedResults, t);
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (onError) {
        onError(t('pdfGenerationError') || 'Error generating PDF. Please check if popups are allowed.');
      }
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          {t('simulationResults')}
        </Typography>
        <Fade in={true}>
          <Chip
            icon={<Box component="span" sx={{ fontSize: '1rem', mr: 0.5, fontWeight: 'bold' }}>{statusInfo.icon}</Box>}
            label={statusInfo.title}
            sx={{
              fontWeight: 600,
              bgcolor: statusInfo.backgroundColor,
              color: statusInfo.color,
              px: 2,
              py: 1,
              borderRadius: '24px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: '0.95rem',
              border: '2px solid',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
              }
            }}
          />
        </Fade>
      </Box>

      {/* Loading indicator */}
      {isCalculating && (
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <CircularProgress size={40} />
          <Typography variant="caption" sx={{ mt: 1 }}>
            {t('calculating')}
          </Typography>
        </Box>
      )}

      {/* Main financial metrics with enhanced animations */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={400}>
            <Box>
              <ResultCard 
                title={t('monthlySales')} 
                value={formatCurrency(results.monthlySales, language, t('currency'))} 
                large={true}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={500}>
            <Box>
              <ResultCard 
                title={t('monthlyGrossProfit')} 
                value={formatCurrency(results.monthlyGrossProfit, language, t('currency'))} 
                large={true}
              />
            </Box>
          </Fade>
        </Grid>
      </Grid>

      {/* Key metrics with staggered animations */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={600}>
            <Box>
              <ResultCard 
                title={t('grossProfitMargin')} 
                value={formatPercent(results.grossProfitMargin)}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={700}>
            <Box>
              <ResultCard 
                title={t('investmentPaybackPeriod')} 
                value={results.paybackPeriod === '-' ? 'N/A' : `${formatNumber(results.paybackPeriod, 1)} ${t('months')}`}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={800}>
            <Box>
              <ResultCard 
                title={t('costPerUnit')} 
                value={formatCurrency(results.costPerUnit, language, t('currency'))}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={900}>
            <Box>
              <ResultCard 
                title={t('operatingHours')} 
                value={`${formatNumber(results.operatingHours, 1)} ${t('hours')}`}
              />
            </Box>
          </Fade>
        </Grid>
      </Grid>

      {/* Chart Area */}
      <Fade in={true} timeout={800}>
        <Card sx={{ 
          mb: 4, 
          overflow: 'visible',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}>
          <CardContent>
            <ChartTabs results={enhancedResults} />
          </CardContent>
        </Card>
      </Fade>

      {/* Production details */}
      <Fade in={true} timeout={900}>
        <Card sx={{ 
          mb: 3, 
          overflow: 'visible',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('productionDetails')}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <SmallStat 
                  title={t('itemsPerPrintJob')} 
                  value={`${formatNumber(results.itemsPerPrintJob)} ${t('units')}`}
                />
              </Grid>
              <Grid item xs={6}>
                <SmallStat 
                  title={t('monthlyPrintJobs')} 
                  value={`${formatNumber(results.monthlyPrintJobs)} ${t('jobs')}`}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Ink usage details */}
      <Fade in={true} timeout={1000}>
        <Card sx={{ 
          mb: 4, 
          overflow: 'visible',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('inkUsagePerItem')}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <SmallStat 
                  title={t('white')} 
                  value={`${formatNumber(results.inkUsage.white, 2)} ${t('cc')}`}
                />
              </Grid>
              <Grid item xs={4}>
                <SmallStat 
                  title={t('cmyk')} 
                  value={`${formatNumber(results.inkUsage.cmyk, 2)} ${t('cc')}`}
                />
              </Grid>
              <Grid item xs={4}>
                <SmallStat 
                  title={t('primer')} 
                  value={`${formatNumber(results.inkUsage.primer, 2)} ${t('cc')}`}
                />
              </Grid>
            </Grid>
            
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('inkCostPerUnit')}: {formatCurrency(results.inkCostPerUnit, language, t('currency'), language === 'ja')}
            </Typography>
            
            {language === 'ja' && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {t('inkCostApproximate')}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Fade>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title={isPrinting ? t('generatingPDF') : ''}>
          <span>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ 
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
              onClick={handlePrintResults}
              disabled={isPrinting}
              startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isPrinting ? t('generatingPDF') : t('downloadPDF')}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SimulationResults;
