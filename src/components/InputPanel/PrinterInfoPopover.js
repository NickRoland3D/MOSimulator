import React from 'react';
import { 
  Popover, 
  Typography, 
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';

/**
 * PrinterInfoPopover Component
 * Displays printer specifications in a popover when info icon is clicked
 */
const PrinterInfoPopover = ({ open, anchorEl, handleClose }) => {
  const { t, language } = useLanguage(); // Get translation function and current language
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: isMobile ? 'center' : 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: isMobile ? 'center' : 'right',
      }}
      PaperProps={{
        sx: { 
          width: isMobile ? '90vw' : 'auto', 
          minWidth: isMobile ? 'auto' : 450, 
          maxWidth: isMobile ? '90vw' : 500, 
          p: isMobile ? 2 : 3,
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
          <Typography variant="body2" sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: isMobile ? 1 : 0
          }}>
            <span style={{ fontWeight: 500 }}>{t('initialInvestment')}:</span> 
            <span style={{ fontWeight: 600 }}>{language === 'ja' ? `3,780,000${t('currency')}` : `${t('currency')} 3,780,000`}</span>
          </Typography>
          <Typography variant="body2" sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center'
          }}>
            <span style={{ fontWeight: 500 }}>{t('printableArea')}:</span> 
            <span style={{ fontWeight: 600 }}>305mm × 458mm</span>
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
};

export default PrinterInfoPopover;