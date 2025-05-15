import React, { useState } from 'react';
import { Box, Tabs, Tab, Fade, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';
import PaybackGauge from './charts/PaybackGauge';
import CostBreakdownChart from './charts/CostBreakdownChart';
import ProfitVolumeChart from './charts/ProfitVolumeChart';

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
          pt: 2, 
          height: isMobile ? '250px' : '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
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
 * Displays different chart types in tabs with improved mobile responsiveness
 */
const ChartTabs = ({ results }) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const [value, setValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  // CMYK colors for tabs as specified in PRD
  const tabColors = {
    0: theme.palette.cmyk?.cyan || '#00AEEF',      // Payback tab - Cyan
    1: theme.palette.cmyk?.magenta || '#EC008C',   // Cost tab - Magenta
    2: theme.palette.cmyk?.yellow || '#FFF200',    // Profit tab - Yellow
  };

  // Adjusted tab labels for mobile
  const getTabLabel = (index) => {
    const labels = {
      0: t('payback'),
      1: t('cost'),
      2: t('profit')
    };
    
    // For Japanese on mobile, make the labels shorter
    if (isMobile && language === 'ja') {
      return {
        0: '回収期間',
        1: 'コスト',
        2: '利益'
      }[index];
    }
    
    return labels[index];
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
          sx={{ minHeight: isMobile ? '40px' : '48px' }}
          TabIndicatorProps={{
            style: {
              backgroundColor: tabColors[value],
              height: 3
            }
          }}
        >
          <Tab 
            label={getTabLabel(0)} 
            {...a11yProps(0)} 
            sx={{ 
              color: value === 0 ? tabColors[0] : 'text.secondary',
              fontWeight: value === 0 ? 700 : 500,
              backgroundColor: value === 0 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '0.875rem' : '0.95rem',
              minHeight: isMobile ? '40px' : '48px',
              padding: isMobile ? '6px 8px' : '12px 16px',
              '&:hover': {
                backgroundColor: value === 0 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
          <Tab 
            label={getTabLabel(1)} 
            {...a11yProps(1)} 
            sx={{ 
              color: value === 1 ? tabColors[1] : 'text.secondary',
              fontWeight: value === 1 ? 700 : 500,
              backgroundColor: value === 1 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '0.875rem' : '0.95rem',
              minHeight: isMobile ? '40px' : '48px',
              padding: isMobile ? '6px 8px' : '12px 16px',
              '&:hover': {
                backgroundColor: value === 1 ? 'background.activeTab' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
          <Tab 
            label={getTabLabel(2)} 
            {...a11yProps(2)} 
            sx={{ 
              color: value === 2 ? tabColors[2] : 'text.secondary',
              fontWeight: value === 2 ? 700 : 500,
              backgroundColor: value === 2 ? 'background.activeTab' : 'transparent',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '0.875rem' : '0.95rem',
              minHeight: isMobile ? '40px' : '48px',
              padding: isMobile ? '6px 8px' : '12px 16px',
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
