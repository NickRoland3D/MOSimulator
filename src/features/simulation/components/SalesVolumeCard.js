import React from 'react';
import { 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Typography, 
  Slider, 
  TextField, 
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SectionHeader from './SectionHeader';
import StepperInput from './StepperInput';
import { VolumeIcon } from './Icons';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * SalesVolumeCard Component
 * Card for monthly sales volume and sales price inputs
 */
const SalesVolumeCard = ({ 
  inputs, 
  errors, 
  focusedInput,
  onInputChange,
  onInputFocus,
  onInputBlur
}) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Volume slider change handler
  const handleSliderChange = (_, value) => {
    onInputChange('monthlySalesVolume', value);
  };
  
  // Volume direct input change handler
  const handleVolumeInputChange = (e) => {
    const rawValue = e.target.value.toString().replace(/,/g, '');
    
    if (rawValue === '') {
      onInputChange('monthlySalesVolume', '');
      return;
    }
    
    const numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      // Apply min/max constraints
      if (numValue < 0) {
        onInputChange('monthlySalesVolume', 0);
      } else if (numValue > 1000) {
        onInputChange('monthlySalesVolume', 1000);
      } else {
        onInputChange('monthlySalesVolume', numValue);
      }
    }
  };

  // Icon SVG for sales volume (chart-like icon)
  const VolumeIndicatorIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 18L8 14L12 16L20 6" stroke="#2471CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 6H20V8" stroke="#2471CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Determine currency symbol placement based on language
  const currencySymbol = t('currency');
  
  return (
    <Card
      sx={{
        mb: 3,
        overflow: 'visible',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <CardContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
        <SectionHeader 
          icon={<VolumeIcon />} 
          title={t('monthlySalesTarget')}
          isMobile={isSmallMobile} 
        />
        <Box sx={{ px: { xs: 0, sm: 2 }, mt: 2 }}>
          {/* Mobile optimized layout */}
          {isMobile && (
            <>
              <TextField
                value={inputs.monthlySalesVolume === '' ? '' : Number(inputs.monthlySalesVolume).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}
                onChange={handleVolumeInputChange}
                onFocus={() => onInputFocus('monthlySalesVolume')}
                onBlur={() => onInputBlur('monthlySalesVolume')}
                fullWidth
                variant="outlined"
                size="medium"
                error={Boolean(errors.monthlySalesVolume)}
                helperText={errors.monthlySalesVolume}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VolumeIndicatorIcon />
                    </InputAdornment>
                  ),
                  endAdornment: language === 'ja' ? <InputAdornment position="end">個</InputAdornment> : null,
                }}
                inputProps={{
                  min: 0,
                  max: 1000,
                  style: { 
                    textAlign: 'center', 
                    fontWeight: '500', 
                    fontSize: '1.25rem',
                    padding: '10px 0' 
                  }
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    fontWeight: 600,
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: errors.monthlySalesVolume ? 'error.main' : '#2471CC',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
              
              <Box sx={{ 
                mb: 2, 
                pt: 1,
                px: 1
              }}>
                <Slider
                  value={typeof inputs.monthlySalesVolume === 'number' ? inputs.monthlySalesVolume : 0}
                  onChange={handleSliderChange}
                  min={0}
                  max={1000}
                  step={10}
                  color="primary"
                  valueLabelDisplay="auto"
                  aria-labelledby="monthly-sales-volume-slider"
                  sx={{
                    height: 8,
                    padding: '15px 0',
                    width: '100%',
                    '& .MuiSlider-rail': {
                      opacity: 1,
                      backgroundColor: errors.monthlySalesVolume ? theme.palette.error.light : '#e0e0e0',
                      height: 8,
                      borderRadius: 4,
                    },
                    '& .MuiSlider-track': {
                      opacity: 1,
                      height: 8,
                      border: 'none',
                      borderRadius: 4,
                      backgroundColor: errors.monthlySalesVolume ? theme.palette.error.main : '#2471CC',
                    },
                    '& .MuiSlider-thumb': {
                      height: 24,
                      width: 24,
                      backgroundColor: '#fff',
                      border: `2px solid ${errors.monthlySalesVolume ? theme.palette.error.main : '#2471CC'}`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:focus, &:hover, &.Mui-active': {
                        boxShadow: `0 0 0 8px ${errors.monthlySalesVolume ? 'rgba(244, 67, 54, 0.16)' : 'rgba(36, 113, 204, 0.2)'}`,
                      },
                      '&:before': {
                        display: 'none',
                      },
                    },
                    '& .MuiSlider-valueLabel': {
                      lineHeight: 1.2,
                      fontSize: 12,
                      background: 'unset',
                      padding: 0,
                      width: 32,
                      height: 32,
                      backgroundColor: errors.monthlySalesVolume ? theme.palette.error.main : '#2471CC',
                      '&:before': { display: 'none' },
                    },
                  }}
                />
              </Box>
              
              <Typography 
                variant="body2" 
                color={errors.monthlySalesVolume ? 'error.main' : 'text.secondary'} 
                sx={{ textAlign: 'center', fontWeight: 500, mb: 3 }}
              >
                {t('unitsPerMonth')} (0-1000)
              </Typography>
            </>
          )}
          
          {/* Desktop layout */}
          {!isMobile && (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Slider
                  value={typeof inputs.monthlySalesVolume === 'number' ? inputs.monthlySalesVolume : 0}
                  onChange={handleSliderChange}
                  min={0}
                  max={1000}
                  step={10}
                  color="primary"
                  valueLabelDisplay="auto"
                  aria-labelledby="monthly-sales-volume-slider"
                  sx={{
                    height: 8,
                    padding: '15px 0',
                    width: '100%',
                    '& .MuiSlider-rail': {
                      opacity: 1,
                      backgroundColor: errors.monthlySalesVolume ? theme.palette.error.light : '#e0e0e0',
                      height: 8,
                      borderRadius: 4,
                    },
                    '& .MuiSlider-track': {
                      opacity: 1,
                      height: 8,
                      border: 'none',
                      borderRadius: 4,
                      backgroundColor: errors.monthlySalesVolume ? theme.palette.error.main : '#2471CC',
                    },
                    '& .MuiSlider-thumb': {
                      height: 24,
                      width: 24,
                      backgroundColor: '#fff',
                      border: `2px solid ${errors.monthlySalesVolume ? theme.palette.error.main : '#2471CC'}`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:focus, &:hover, &.Mui-active': {
                        boxShadow: `0 0 0 8px ${errors.monthlySalesVolume ? 'rgba(244, 67, 54, 0.16)' : 'rgba(36, 113, 204, 0.2)'}`,
                      },
                      '&:before': {
                        display: 'none',
                      },
                    },
                    '& .MuiSlider-valueLabel': {
                      lineHeight: 1.2,
                      fontSize: 12,
                      background: 'unset',
                      padding: 0,
                      width: 32,
                      height: 32,
                      backgroundColor: errors.monthlySalesVolume ? theme.palette.error.main : '#2471CC',
                      '&:before': { display: 'none' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  value={inputs.monthlySalesVolume === '' ? '' : Number(inputs.monthlySalesVolume).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}
                  onChange={handleVolumeInputChange}
                  onFocus={() => onInputFocus('monthlySalesVolume')}
                  onBlur={() => onInputBlur('monthlySalesVolume')}
                  inputProps={{
                    min: 0,
                    max: 1000,
                    'aria-labelledby': 'monthly-sales-volume-input',
                    style: { textAlign: 'center', fontWeight: '500', fontSize: '1rem' }
                  }}
                  type="text"
                  size="small"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.monthlySalesVolume)}
                  helperText={errors.monthlySalesVolume}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontWeight: 500,
                      borderRadius: '8px',
                      height: '48px',
                      backgroundColor: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: errors.monthlySalesVolume ? 'error.main' : 'rgba(0, 0, 0, 0.2)',
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography 
                  variant="body2" 
                  color={errors.monthlySalesVolume ? 'error.main' : 'text.secondary'} 
                  sx={{ textAlign: 'center', fontWeight: 500, mb: 2 }}
                >
                  {t('unitsPerMonth')} (0-1000)
                </Typography>
              </Grid>
            </Grid>
          )}
          
          {/* Sales Price Input - Same for both mobile and desktop */}
          <Box sx={{ mt: 1 }}>
            <StepperInput
              label={language === 'ja' ? `${t('salesPricePerUnit')} (${t('currency')})` : `${t('salesPricePerUnit')} (${t('currency')})`}
              value={inputs.salesPricePerUnit}
              name="salesPricePerUnit"
              min={0}
              step={50}
              error={errors.salesPricePerUnit}
              language={language}
              startAdornment={language === 'ja' ? null : currencySymbol}
              endAdornment={language === 'ja' ? currencySymbol : null}
              onValueChange={onInputChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesVolumeCard;