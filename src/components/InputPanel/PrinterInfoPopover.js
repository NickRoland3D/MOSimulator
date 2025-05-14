import React from 'react';
import { 
  Popover, 
  Typography, 
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button
} from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';

// Simple close icon component
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
  </svg>
);

/**
 * PrinterInfoPopover Component
 * Displays printer specifications in a popover when info icon is clicked
 * Uses Dialog for mobile devices and Popover for desktop
 */
const PrinterInfoPopover = ({ open, anchorEl, handleClose }) => {
  const { t, language } = useLanguage(); // Get translation function and current language
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Content to be displayed in both Popover and Dialog
  const InfoContent = () => (
    <>
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
    </>
  );
  
  // Mobile Dialog version
  if (isMobile) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        sx={{
          '& .MuiDialog-paper': {
            margin: '16px',
            width: 'calc(100% - 32px)',
            maxWidth: 'calc(100% - 32px)',
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            pb: 1 
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('printerSpecifications')}
          </Typography>
          <IconButton 
            edge="end" 
            onClick={handleClose} 
            aria-label="close" 
            size="small"
            sx={{ 
              color: 'text.secondary'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <InfoContent />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleClose} 
              variant="contained" 
              color="primary" 
              size="small"
              sx={{ fontWeight: 500 }}
            >
              {t('close') || 'Close'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Desktop Popover version (existing implementation)
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
      
      <InfoContent />
    </Popover>
  );
};

export default PrinterInfoPopover;