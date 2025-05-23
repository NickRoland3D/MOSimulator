import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper,
  Fade,
  useMediaQuery,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { lazyLoad } from './utils/code-splitting';
import LanguageToggle from './components/LanguageToggle/LanguageToggle';
import { useLanguage } from './context/LanguageContext';
import useSimulation from './hooks/useSimulation';
import { getPaybackStatus } from './services/calculationService';
import { DEFAULT_INPUTS } from './config/constants';

// Lazy load heavy components
const SimulationForm = lazyLoad(() => import('./features/simulation/SimulationForm'));
const SimulationResults = lazyLoad(() => import('./features/simulation/SimulationResults'));

/**
 * Main application content component
 * Handles layout, simulation state, and error handling
 */
function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage();
  
  // Use our custom hook for simulation logic with default inputs
  const { 
    inputs, 
    results, 
    isValid,
    isCalculating,
    handleInputChange,
    formatCurrencyValue
  } = useSimulation(DEFAULT_INPUTS);
  
  // UI state management
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showAppearAnimation, setShowAppearAnimation] = useState(true);
  const [error, setError] = useState(null);

  // Set calculation flag when results are available
  useEffect(() => {
    if (results) {
      setHasCalculated(true);
    }
  }, [results]);
  
  // Turn off initial animations after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAppearAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Get background color for results panel based on payback period
  const getResultsPanelBgColor = () => {
    if (!results) return theme.palette.background.paper;
    
    const status = getPaybackStatus(results.paybackPeriod);
    switch (status) {
      case 'good':
        return theme.palette.background.resultGood;
      case 'average':
        return theme.palette.background.resultAverage;
      case 'warning':
        return theme.palette.background.resultWarning;
      case 'no-profit':
        return theme.palette.background.resultNoProfit;
      default:
        return theme.palette.background.paper;
    }
  };

  // Error handling
  const handleError = (message) => {
    setError(message);
  };

  const handleCloseError = () => {
    setError(null);
  };

  // To help with the panel width/layout as specified in PRD
  const inputPanelWidth = isMobile ? 12 : 5; // 40-45% on desktop as specified in PRD
  const resultsPanelWidth = isMobile ? 12 : 7; // 55-60% on desktop as specified in PRD

  return (
    <Box className="app-wrapper">
      {/* Error Snackbar */}
      <Snackbar 
        open={error !== null} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        className="app-container"
        sx={{
          px: isSmallMobile ? 1 : 2
        }}
      >
        {/* Language Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: isSmallMobile ? 1 : 2 }}>
          <LanguageToggle />
        </Box>
        
        <Box sx={{ my: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: isSmallMobile ? '1.6rem' : { xs: '2rem', md: '2.5rem' },
              lineHeight: isSmallMobile ? 1.2 : 'inherit',
              wordBreak: 'keep-all',
              mt: { xs: 1, sm: 2 },
              mb: { xs: 1, sm: 2 }
            }}
            className="app-title"
          >
            {t('moSimulatorTitle') || 'MO-180 Sales Simulation Tool'}
          </Typography>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              color: theme.palette.text.secondary, 
              maxWidth: 700, 
              mx: 'auto', 
              mb: { xs: 2, md: 4 },
              fontSize: isSmallMobile ? '0.75rem' : 'inherit',
              animation: showAppearAnimation ? 'fadeIn 1.2s ease-out' : 'none',
              px: isSmallMobile ? 1 : 0,
              whiteSpace: isSmallMobile ? 'nowrap' : 'normal',
              overflow: isSmallMobile ? 'hidden' : 'visible',
              textOverflow: isSmallMobile ? 'ellipsis' : 'clip'
            }}
          >
            {t('evaluateProfitability') || 'Evaluate profitability and ROI for the Roland DG MO-180 UV printer'}
          </Typography>
        </Box>

        <Grid container spacing={isSmallMobile ? 2 : 4}>
          {/* Input Panel */}
          <Grid item xs={12} md={inputPanelWidth}>
            <Box 
              sx={{ 
                animation: showAppearAnimation ? 'cardAppear 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
            >
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  height: '100%',
                  overflow: 'visible',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <SimulationForm 
                  inputs={inputs} 
                  onInputChange={handleInputChange} 
                  onError={handleError}
                />
              </Paper>
            </Box>
          </Grid>
          
          {/* Results Panel */}
          <Grid item xs={12} md={resultsPanelWidth}>
            <Fade in={hasCalculated && isValid} timeout={{ enter: 800, exit: 300 }}>
              <Box
                sx={{ 
                  animation: showAppearAnimation ? 'cardAppear 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                  opacity: isCalculating ? 0.7 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: { xs: 1.5, sm: 2, md: 3 }, 
                    height: '100%',
                    overflow: 'visible',
                    backgroundColor: getResultsPanelBgColor(),
                    transition: 'background-color 0.5s ease-in-out, box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  {results && (
                    <SimulationResults 
                      results={results} 
                      isCalculating={isCalculating}
                      onError={handleError}
                    />
                  )}
                </Paper>
              </Box>
            </Fade>
            
            {/* Validation warning */}
            {!isValid && (
              <Fade in={!isValid} timeout={500}>
                <Alert 
                  severity="warning" 
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  {t('validationWarning') || 'Please check your inputs. Some values are invalid or out of range.'}
                </Alert>
              </Fade>
            )}
          </Grid>
        </Grid>
        
        {/* Footer - removed copyright
        <Box 
          component="footer" 
          sx={{ 
            mt: { xs: 4, md: 8 }, 
            pt: { xs: 2, md: 3 }, 
            pb: { xs: 2, md: 3 }, 
            textAlign: 'center',
            borderTop: `1px solid ${theme.palette.divider}`,
            animation: showAppearAnimation ? 'fadeIn 1.5s ease-out' : 'none',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Roland DG Corporation. {t('allRightsReserved') || 'All rights reserved.'}
          </Typography>
        </Box>
        */}
      </Container>
    </Box>
  );
}

export default AppContent;
