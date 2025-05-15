import React, { useState } from 'react';
import {
  Popover,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close'; // Using MUI's Close icon
import { useLanguage } from '../../../context/LanguageContext';
import LisaImage from '../../../assets/images/lisa.png'; // Ensure this path is correct

/**
 * PrinterInfoPopover Component
 * Displays printer specifications.
 * Uses Material UI Dialog for mobile and Popover for desktop.
 * Includes editable Initial Investment and sample image display.
 */
const PrinterInfoPopover = ({
  open,
  anchorEl,
  handleClose,
  initialInvestment,
  onInitialInvestmentChange
}) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tempValue, setTempValue] = useState(initialInvestment);

  // Update tempValue if initialInvestment prop changes
  React.useEffect(() => {
    setTempValue(initialInvestment);
  }, [initialInvestment]);

  const handleInputChange = (event) => {
    const rawValue = event.target.value.replace(/,/g, '');
    // Allow empty string for clearing the field, otherwise parse as number
    if (rawValue === '') {
      setTempValue('');
    } else {
      const value = parseInt(rawValue, 10);
      setTempValue(isNaN(value) ? '' : value);
    }
  };

  const applyInvestmentChange = () => {
    if (tempValue === '' || isNaN(tempValue) || Number(tempValue) <= 0) {
      // If invalid or empty, revert to the original initialInvestment
      setTempValue(initialInvestment);
      // Optionally call onInitialInvestmentChange with the original value if a reset is desired
      // onInitialInvestmentChange(initialInvestment);
    } else {
      onInitialInvestmentChange(Number(tempValue));
    }
  };

  const handleBlur = () => {
    applyInvestmentChange();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      applyInvestmentChange();
      event.target.blur(); // Optional: close popover or blur input
    }
  };

  const content = (
    <>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, borderBottom: '1px solid rgba(0, 0, 0, 0.1)', pb: 1, mb: 2, display: isMobile ? 'none' : 'block' }}>
        {t('printerSpecifications')}
      </Typography>

      {/* Sample Image Section */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          {language === 'ja' ? 'サンプル印刷' : 'Sample Print'}
        </Typography>
        <Box sx={{ ml: 1 }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              mb: 1.5
            }}
          >
            <img
              src={LisaImage}
              alt="Lisa"
              style={{
                maxWidth: '100%',
                maxHeight: isMobile ? '150px' : '200px', // Adjust image size for mobile dialog
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              textAlign: 'center',
              mb: 1
            }}
          >
            {language === 'ja'
              ? '全てのシミュレーションは、この画像を基に算出しています'
              : 'Simulations are based on the above image'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Base Parameters Section */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          {t('baseParameters')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, ml: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, flexShrink: 0, mr: 2 }}>
              {t('initialInvestment')}:
            </Typography>
            <TextField
              value={tempValue === '' ? '' : Number(tempValue).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              size="small"
              type="text" // Use text to allow commas, parse to number on change/blur
              InputProps={{
                // Always use endAdornment for currency symbol
                endAdornment: <InputAdornment position="end">{t('currency')}</InputAdornment>,
                sx: { fontWeight: 600 }
              }}
              sx={{
                width: '200px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{t('printableArea')}:</span>
            <span style={{ fontWeight: 600 }}>305mm × 458mm</span>
          </Typography>
        </Box>
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="printer-info-dialog-title"
      >
        <DialogTitle id="printer-info-dialog-title" sx={{ py: 1.5, px: 2}}>
          {t('printerSpecifications')}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {content}
        </DialogContent>
        <DialogActions sx={{p:2}}>
          <Button onClick={handleClose} variant="outlined" color="primary" fullWidth>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

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
          minWidth: 400, // Adjusted minWidth
          maxWidth: 450, // Adjusted maxWidth
          p: 2.5,      // Adjusted padding
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {content}
    </Popover>
  );
};

export default PrinterInfoPopover;