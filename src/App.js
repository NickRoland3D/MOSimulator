import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper,
  Fade,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InputPanel from './components/InputPanel/InputPanel';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { calculateAll, getPaybackStatus } from './utils/calculations';
import './App.css';

// Default values from PRD
const defaultInputs = {
  shortEdge: 90,
  longEdge: 90,
  salesPricePerUnit: 2500,
  monthlySalesVolume: 300,
  materialCostPerUnit: 200,
  laborCostPerHour: 2000,
  inkPricePerCC: 18
};

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for inputs and results
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showAppearAnimation, setShowAppearAnimation] = useState(true);

  // Calculate results whenever inputs change
  useEffect(() => {
    const calculatedResults = calculateAll(inputs);
    setResults(calculatedResults.results);
    setHasCalculated(true);
  }, [inputs]);
  
  // Turn off initial animations after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAppearAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle input changes
  const handleInputChange = (name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  // To help with the panel width/layout as specified in PRD
  const inputPanelWidth = isMobile ? 12 : 5; // 40-45% on desktop as specified in PRD
  const resultsPanelWidth = isMobile ? 12 : 7; // 55-60% on desktop as specified in PRD

  return (
    <Box className="app-wrapper">
      {/* Main Content */}
      <Container maxWidth="lg" className="app-container">
        <Box sx={{ my: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: 'bold' }}
            className="app-title"
          >
            MO-180 Sales Simulation Tool
          </Typography>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              color: theme.palette.text.secondary, 
              maxWidth: 700, 
              mx: 'auto', 
              mb: 4,
              animation: showAppearAnimation ? 'fadeIn 1.2s ease-out' : 'none',
            }}
          >
            Evaluate profitability and ROI for the Roland DG MO-180 UV printer
          </Typography>
        </Box>

        <Grid container spacing={4}>
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
                  p: { xs: 2, sm: 3 }, 
                  height: '100%',
                  overflow: 'visible',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <InputPanel 
                  inputs={inputs} 
                  onInputChange={handleInputChange} 
                />
              </Paper>
            </Box>
          </Grid>
          
          {/* Results Panel */}
          <Grid item xs={12} md={resultsPanelWidth}>
            <Fade in={hasCalculated} timeout={{ enter: 800, exit: 300 }}>
              <Box
                sx={{ 
                  animation: showAppearAnimation ? 'cardAppear 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                }}
              >
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: { xs: 2, sm: 3 }, 
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
                    <ResultsPanel results={results} />
                  )}
                </Paper>
              </Box>
            </Fade>
          </Grid>
        </Grid>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            mt: 8, 
            pt: 3, 
            pb: 3, 
            textAlign: 'center',
            borderTop: `1px solid ${theme.palette.divider}`,
            animation: showAppearAnimation ? 'fadeIn 1.5s ease-out' : 'none',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Roland DG Corporation. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
