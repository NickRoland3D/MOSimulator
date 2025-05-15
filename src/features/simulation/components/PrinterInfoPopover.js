import React from 'react';
import {
  Popover,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../../context/LanguageContext';
import { PRINTER_SPECIFICATIONS } from '../../../config/constants';
import { formatNumber } from '../../../utils/formatters';

// Close icon as inline SVG for better styling
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * PrinterInfoPopover Component
 * Displays printer specifications and allows editing initial investment
 * Uses Popover on desktop and Dialog on mobile for better UX
 */
const PrinterInfoPopover = ({
  open,
  anchorEl,
  handleClose,
  initialInvestment,
  onInitialInvestmentChange,
  error
}) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Handle input change for initial investment
  const handleInvestmentChange = (event) => {
    const value = event.target.value.replace(/,/g, '');
    const numValue = parseFloat(value);
    
    if (value === '') {
      onInitialInvestmentChange('');
    } else if (!isNaN(numValue) && numValue > 0) {
      onInitialInvestmentChange(numValue);
    }
  };
  
  // Format value for display
  const displayValue = initialInvestment === '' 
    ? '' 
    : Number(initialInvestment).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US');

  // Sample image path - update to actual path
  const sampleImagePath = '/assets/images/lisa.png';

  // Text based on language
  const printerSpecsTitle = language === 'ja' ? 'MO-180 プリンター仕様' : 'MO-180 Printer Specifications';
  const samplePrintTitle = language === 'ja' ? 'サンプル印刷' : 'Sample Print';
  const imageCaption = language === 'ja' 
    ? '全てのシミュレーションは、この画像を基に算出しています'
    : 'Simulations are based on the above image';
  const baseParamsTitle = language === 'ja' ? '基本パラメータ' : 'Base Parameters';
  const initialInvestmentLabel = language === 'ja' ? '初期投資:' : 'Initial Investment:';
  const printableAreaLabel = language === 'ja' ? '印刷領域:' : 'Printable Area:';
  
  // Use appropriate currency symbol based on language
  const currencyLabel = language === 'ja' ? '円' : 'JPY';
  
  // Content to be displayed in both Popover and Dialog
  const content = (
    <>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={500}>
          {printerSpecsTitle}
        </Typography>
      </Box>

      <Divider />
      
      <Box sx={{ p: 2.5 }}>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
          {samplePrintTitle}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 2
        }}>
          <Box 
            component="img" 
            src={sampleImagePath} 
            alt="Sample Print"
            sx={{ 
              maxWidth: isMobile ? '180px' : '220px', 
              height: 'auto',
              borderRadius: 1
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center">
          {imageCaption}
        </Typography>
      </Box>

      <Divider />
      
      <Box sx={{ p: 2.5 }}>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
          {baseParamsTitle}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mr: isMobile ? 0 : 2, 
              mb: isMobile ? 1 : 0,
              minWidth: isMobile ? 'auto' : '90px',
              alignSelf: isMobile ? 'flex-start' : 'center'
            }}
          >
            {initialInvestmentLabel}
          </Typography>
          <TextField
            value={displayValue}
            onChange={handleInvestmentChange}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              // Always use endAdornment for currency symbol
              endAdornment: <InputAdornment position="end">{currencyLabel}</InputAdornment>,
            }}
            error={Boolean(error)}
            helperText={error}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mr: isMobile ? 0 : 2, 
              mb: isMobile ? 1 : 0,
              minWidth: isMobile ? 'auto' : '90px' 
            }}
          >
            {printableAreaLabel}
          </Typography>
          <Typography variant="body1">
            {formatNumber(PRINTER_SPECIFICATIONS.printableArea.width, 0)}mm × {formatNumber(PRINTER_SPECIFICATIONS.printableArea.height, 0)}mm
          </Typography>
        </Box>
      </Box>
    </>
  );

  // For mobile, use Dialog instead of Popover for better UX
  if (isMobile) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            m: 1,
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" fontWeight={500}>
            {printerSpecsTitle}
          </Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ pt: 2.5 }}>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 2, px: 2.5 }}>
              {samplePrintTitle}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2
            }}>
              <Box 
                component="img" 
                src={sampleImagePath} 
                alt="Sample Print"
                sx={{ 
                  maxWidth: '180px', 
                  height: 'auto',
                  borderRadius: 1
                }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ px: 2.5, mb: 2.5 }}>
              {imageCaption}
            </Typography>
          </Box>

          <Divider />
          
          <Box sx={{ p: 2.5 }}>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
              {baseParamsTitle}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {initialInvestmentLabel}
              </Typography>
              <TextField
                value={displayValue}
                onChange={handleInvestmentChange}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  // Always use endAdornment for currency symbol
                  endAdornment: <InputAdornment position="end">{currencyLabel}</InputAdornment>,
                }}
                error={Boolean(error)}
                helperText={error}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {printableAreaLabel}
              </Typography>
              <Typography variant="body1">
                {formatNumber(PRINTER_SPECIFICATIONS.printableArea.width, 0)}mm × {formatNumber(PRINTER_SPECIFICATIONS.printableArea.height, 0)}mm
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop version uses Popover
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
          width: { xs: 320, sm: 400 },
          borderRadius: 2,
          border: '1px solid rgba(150, 170, 200, 0.3)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          p: 0,
          overflow: 'hidden'
        }
      }}
    >
      {content}
    </Popover>
  );
};

export default PrinterInfoPopover;