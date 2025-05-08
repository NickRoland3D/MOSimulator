import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button,
  Fade,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getPaybackStatus } from '../../utils/calculations';
import ChartTabs from '../Charts/ChartTabs';

// Helper function to format numbers with commas as thousands separators
const formatNumber = (num, decimals = 0) => {
  if (typeof num === 'string') return num;
  return num.toLocaleString(undefined, { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Helper function to format JPY currency
const formatCurrency = (amount) => {
  return `JPY ${formatNumber(Math.round(amount))}`;
};

// Helper function to format percentage
const formatPercent = (value) => {
  return `${value.toFixed(2)}%`;
};

/**
 * ResultsPanel Component
 * Displays the calculated results with enhanced styling and charts
 */
const ResultsPanel = ({ results }) => {
  const theme = useTheme();
  
  // Add inputs to results for charts
  const enhancedResults = {
    ...results,
    inputs: {
      salesPricePerUnit: results.monthlySales / results.inputs?.monthlySalesVolume || 0,
      monthlySalesVolume: results.inputs?.monthlySalesVolume || 0
    }
  };
  
  // Determine the background color based on payback period
  const paybackStatus = getPaybackStatus(results.paybackPeriod);
  
  // Status tag content and colors with enhanced styling
  const getStatusInfo = () => {
    switch(paybackStatus) {
      case 'good':
        return {
          title: 'Excellent Investment',
          color: theme.palette.success.main,
          backgroundColor: theme.palette.success.light,
          icon: '✓'
        };
      case 'average':
        return {
          title: 'Good Investment',
          color: theme.palette.warning.main,
          backgroundColor: theme.palette.warning.light,
          icon: '!'
        };
      case 'warning':
        return {
          title: 'Consider Carefully',
          color: theme.palette.error.main,
          backgroundColor: theme.palette.error.light,
          icon: '⚠'
        };
      case 'no-profit':
        return {
          title: 'Not Profitable',
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.grey[200],
          icon: '×'
        };
      default:
        return {
          title: 'Results',
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Simulation Results
        </Typography>
        <Fade in={true}>
          <Chip
            icon={<Box component="span" sx={{ fontSize: '1rem', mr: 0.5 }}>{statusInfo.icon}</Box>}
            label={statusInfo.title}
            sx={{
              fontWeight: 600,
              bgcolor: statusInfo.backgroundColor,
              color: statusInfo.color,
              px: 1,
              borderRadius: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
              }
            }}
          />
        </Fade>
      </Box>

      {/* Main financial metrics with enhanced animations */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={400}>
            <Box>
              <ResultCard 
                title="Monthly Sales" 
                value={formatCurrency(results.monthlySales)} 
                large={true}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={500}>
            <Box>
              <ResultCard 
                title="Monthly Gross Profit" 
                value={formatCurrency(results.monthlyGrossProfit)} 
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
                title="Gross Profit Margin" 
                value={formatPercent(results.grossProfitMargin)}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={700}>
            <Box>
              <ResultCard 
                title="Investment Payback Period" 
                value={results.paybackPeriod === '-' ? 'N/A' : `${results.paybackPeriod.toFixed(1)} months`}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={800}>
            <Box>
              <ResultCard 
                title="Cost per Unit" 
                value={formatCurrency(results.costPerUnit)}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={true} timeout={900}>
            <Box>
              <ResultCard 
                title="Operating Hours (monthly)" 
                value={`${results.operatingHours.toFixed(1)} hours`}
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
              Production Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <SmallStat 
                  title="Items per Print Job" 
                  value={`${formatNumber(results.itemsPerPrintJob)} units`}
                />
              </Grid>
              <Grid item xs={6}>
                <SmallStat 
                  title="Monthly Print Jobs" 
                  value={`${formatNumber(results.monthlyPrintJobs)} jobs`}
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
              Ink Usage per Item
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <SmallStat 
                  title="White" 
                  value={`${results.inkUsage.white} cc`}
                />
              </Grid>
              <Grid item xs={4}>
                <SmallStat 
                  title="CMYK" 
                  value={`${results.inkUsage.cmyk} cc`}
                />
              </Grid>
              <Grid item xs={4}>
                <SmallStat 
                  title="Primer" 
                  value={`${results.inkUsage.primer} cc`}
                />
              </Grid>
            </Grid>
            
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Ink Cost per Unit: {formatCurrency(results.inkCostPerUnit)}
            </Typography>
          </CardContent>
        </Card>
      </Fade>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
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
          disabled={true} // Will be enabled in Phase 2
        >
          DOWNLOAD PDF
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsPanel;
