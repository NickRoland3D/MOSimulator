import React, { useState } from 'react';
import { Box, Tabs, Tab, Fade, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';
import PaybackGauge from './PaybackGauge';
import CostBreakdownChart from './CostBreakdownChart';
import ProfitVolumeChart from './ProfitVolumeChart';

// TabPanel component to manage content visibility
const TabPanel = (props) => {
  const { children, value, index, isMobile, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
      {...other}
    >
      <Fade in={value === index} timeout={600}>
        <Box sx={{ 
          pt: isMobile ? 1 : 2, 
          height: isMobile ? '280px' : '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage(); // Get translation function
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
    <Box sx={{ width: '100%', mb: isMobile ? 2 : 4 }}>
      {/* Tab navigation - smaller height on mobile */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="chart tabs"
          variant="fullWidth"
          sx={{ minHeight: isMobile ? '40px' : '48px' }}
          TabIndicatorProps={{
            style: {
              backgroundColor: tabColors[value],
              height: 3
            }
          }}
        >
          <Tab 
            label={t('payback')} 
            {...a11yProps(0)} 
            sx={{ 
              color: value === 0 ? tabColors[0] : 'text.secondary',
              fontWeight: value === 0 ? 700 : 500,
              backgroundColor: value === 0 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              minHeight: isMobile ? '40px' : '48px',
              padding: isMobile ? '6px 12px' : '12px 16px',
              '&:hover': {
                backgroundColor: value === 0 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
          <Tab 
            label={t('cost')} 
            {...a11yProps(1)} 
            sx={{ 
              color: value === 1 ? tabColors[1] : 'text.secondary',
              fontWeight: value === 1 ? 700 : 500,
              backgroundColor: value === 1 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              minHeight: isMobile ? '40px' : '48px',
              padding: isMobile ? '6px 12px' : '12px 16px',
              '&:hover': {
                backgroundColor: value === 1 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
          <Tab 
            label={t('profit')} 
            {...a11yProps(2)} 
            sx={{ 
              color: value === 2 ? tabColors[2] : 'text.secondary',
              fontWeight: value === 2 ? 700 : 500,
              backgroundColor: value === 2 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              minHeight: isMobile ? '40px' : '48px',
              padding: isMobile ? '6px 12px' : '12px 16px',
              '&:hover': {
                backgroundColor: value === 2 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
        </Tabs>
      </Box>
      
      {/* Chart content panels */}
      <TabPanel value={value} index={0} isMobile={isMobile}>
        <PaybackGauge paybackPeriod={results.paybackPeriod} />
      </TabPanel>
      <TabPanel value={value} index={1} isMobile={isMobile}>
        <CostBreakdownChart 
          materialCost={results.materialCostPerUnit}
          inkCost={results.inkCostPerUnit}
          laborCost={results.laborCostPerUnit}
        />
      </TabPanel>
      <TabPanel value={value} index={2} isMobile={isMobile}>
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