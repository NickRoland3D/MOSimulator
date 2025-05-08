import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PaybackGauge from './PaybackGauge';
import CostBreakdownChart from './CostBreakdownChart';
import ProfitVolumeChart from './ProfitVolumeChart';

// TabPanel component to manage content visibility
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
      {...other}
    >
      <Fade in={value === index} timeout={600}>
        <Box sx={{ pt: 2, height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Box>
      </Fade>
    </div>
  );
};

// Helper function for a11y props
const a11yProps = (index) => {
  return {
    id: `chart-tab-${index}`,
    'aria-controls': `chart-tabpanel-${index}`,
  };
};

/**
 * ChartTabs Component
 * Displays different chart types in tabs
 */
const ChartTabs = ({ results }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  // CMYK colors for tabs as specified in PRD
  const tabColors = {
    0: theme.palette.cmyk.cyan,      // Payback tab - Cyan
    1: theme.palette.cmyk.magenta,   // Cost tab - Magenta
    2: theme.palette.cmyk.yellow,    // Profit tab - Yellow
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Tab navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="chart tabs"
          variant="fullWidth"
          sx={{ minHeight: '48px' }}
          TabIndicatorProps={{
            style: {
              backgroundColor: tabColors[value],
              height: 3
            }
          }}
        >
          <Tab 
            label="Payback" 
            {...a11yProps(0)} 
            sx={{ 
              color: value === 0 ? tabColors[0] : 'text.secondary',
              fontWeight: value === 0 ? 700 : 500,
              backgroundColor: value === 0 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              '&:hover': {
                backgroundColor: value === 0 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
          <Tab 
            label="Cost" 
            {...a11yProps(1)} 
            sx={{ 
              color: value === 1 ? tabColors[1] : 'text.secondary',
              fontWeight: value === 1 ? 700 : 500,
              backgroundColor: value === 1 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              '&:hover': {
                backgroundColor: value === 1 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
          <Tab 
            label="Profit" 
            {...a11yProps(2)} 
            sx={{ 
              color: value === 2 ? tabColors[2] : 'text.secondary',
              fontWeight: value === 2 ? 700 : 500,
              backgroundColor: value === 2 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              '&:hover': {
                backgroundColor: value === 2 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
        </Tabs>
      </Box>
      
      {/* Chart content panels */}
      <TabPanel value={value} index={0}>
        <PaybackGauge paybackPeriod={results.paybackPeriod} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CostBreakdownChart 
          materialCost={results.materialCostPerUnit}
          inkCost={results.inkCostPerUnit}
          laborCost={results.laborCostPerUnit}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ProfitVolumeChart 
          salesPricePerUnit={results.inputs?.salesPricePerUnit}
          costPerUnit={results.costPerUnit}
          currentVolume={results.inputs?.monthlySalesVolume}
        />
      </TabPanel>
    </Box>
  );
};

export default ChartTabs;
