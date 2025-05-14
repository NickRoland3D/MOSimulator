import React from 'react';
import { 
  Popover, 
  Typography, 
  Box,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  IconButton,
  Button,
  Grid,
  Divider
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
 * Displays printer specifications
 * Uses SwipeableDrawer for mobile devices and Popover for desktop
 */
const PrinterInfoPopover = ({ open, anchorEl, handleClose }) => {
  const { t, language } = useLanguage(); // Get translation function and current language
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Content to be displayed in both Popover and Drawer
  const InfoContent = () => (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 2
          }}>
            <Typography variant="body1" component="span" sx={{ 
              fontWeight: 500, 
              mb: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 2 
            }}>
              {t('initialInvestment')}:
            </Typography>
            <Typography variant="body1" component="span" sx={{ 
              fontWeight: 600,
              wordBreak: 'break-word'
            }}>
              {language === 'ja' ? `3,780,000${t('currency')}` : `${t('currency')} 3,780,000`}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center' 
          }}>
            <Typography variant="body1" component="span" sx={{ 
              fontWeight: 500, 
              mb: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 2 
            }}>
              {t('printableArea')}:
            </Typography>
            <Typography variant="body1" component="span" sx={{ 
              fontWeight: 600,
              wordBreak: 'break-word'
            }}>
              305mm × 458mm
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
  
  // Mobile Drawer version
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            maxHeight: '85vh',
            overflow: 'auto'
          }
        }}
      >
        {/* Handle for swiping */}
        <Box 
          sx={{ 
            width: '40px', 
            height: '4px', 
            backgroundColor: 'rgba(0, 0, 0, 0.2)', 
            borderRadius: '2px',
            margin: '12px auto 8px'
          }}
        />
        
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 3,
          pb: 1,
          pt: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {t('printerSpecifications')}
          </Typography>
          <IconButton onClick={handleClose} sx={{ p: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        {/* Content */}
        <Box sx={{ p: 3, pt: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {t('baseParameters')}
          </Typography>
          
          <InfoContent />
          
          {/* Bottom button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              onClick={handleClose}
              variant="contained"
              fullWidth
              sx={{ 
                borderRadius: '8px',
                py: 1.5,
                fontWeight: 500,
                maxWidth: '250px'
              }}
            >
              {t('close')}
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    );
  }
  
  // Desktop Popover version
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
      
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
        {t('baseParameters')}
      </Typography>
      
      <InfoContent />
    </Popover>
  );
};

export default PrinterInfoPopover;