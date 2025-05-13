import React, { useState } from 'react';
import { 
  Popover, 
  Typography, 
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * PrinterInfoPopover Component
 * Displays printer specifications in a popover when info icon is clicked
 * Now with directly editable Initial Investment parameter
 */
const PrinterInfoPopover = ({ open, anchorEl, handleClose, initialInvestment, onInitialInvestmentChange }) => {
  const { t, language } = useLanguage(); // Get translation function and current language
  
  // State for input value
  const [tempValue, setTempValue] = useState(initialInvestment);
  
  // Format number with commas for display
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Handle input change
  const handleInputChange = (event) => {
    // Remove commas and convert to number
    const value = parseInt(event.target.value.replace(/,/g, ''), 10);
    setTempValue(isNaN(value) ? '' : value);
  };
  
  // Handle blur to save value
  const handleBlur = () => {
    if (!isNaN(tempValue) && tempValue > 0) {
      onInitialInvestmentChange(tempValue);
    } else {
      // Reset to current value if invalid
      setTempValue(initialInvestment);
    }
  };
  
  // Handle key press events
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (!isNaN(tempValue) && tempValue > 0) {
        onInitialInvestmentChange(tempValue);
      } else {
        // Reset to current value if invalid
        setTempValue(initialInvestment);
      }
      event.target.blur();
    }
  };
  
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { 
          width: 'auto', 
          minWidth: 450, 
          maxWidth: 500, 
          p: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, borderBottom: '1px solid rgba(0, 0, 0, 0.1)', pb: 1, mb: 2 }}>
        {t('printerSpecifications')}
      </Typography>
      
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          {t('baseParameters')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('initialInvestment')}:
            </Typography>
            <TextField
              value={tempValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              size="small"
              type="text"
              InputProps={{
                startAdornment: language !== 'ja' && <InputAdornment position="start">{t('currency')}</InputAdornment>,
                endAdornment: language === 'ja' && <InputAdornment position="end">{t('currency')}</InputAdornment>,
                sx: { fontWeight: 600 }
              }}
              sx={{
                width: '200px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                // Remove inner arrows from number inputs
                '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield'
                }
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{t('printableArea')}:</span> 
            <span style={{ fontWeight: 600 }}>305mm × 458mm</span>
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
};

export default PrinterInfoPopover;
