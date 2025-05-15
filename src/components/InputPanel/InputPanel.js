// MO Simulator 2/src/features/simulation/SimulationForm.js
// OR MO Simulator 2/src/components/InputPanel/InputPanel.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  Grid,
  InputAdornment,
  Card,
  CardContent,
  Tooltip,
  Button,
  Fade,
  useMediaQuery // If not already imported
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // If not already imported
import { useLanguage } from '../../context/LanguageContext';
// Correct the path based on your project structure
// Option 1: If PrinterInfoPopover is in './components/' relative to SimulationForm
import PrinterInfoPopover from './PrinterInfoPopover';
// Option 2: If InputPanel.js is calling PrinterInfoPopover from the same directory
// import PrinterInfoPopover from './PrinterInfoPopover';


// ... (rest of your existing imports for DimensionsIcon, PriceIcon, VolumeIcon, InfoIcon)

// Using SVG icons directly instead of emojis to match the design
const DimensionsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 19L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 19L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5L3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 5L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 19L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 19L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const VolumeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17H7V10H3V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 17H14V3H10V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 17H21V6H17V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
  </svg>
);


/**
 * SimulationForm Component / InputPanel Component
 * Handles user inputs for the simulation with enhanced styling and improved aesthetics
 */
const SimulationForm = ({ inputs, onInputChange }) => { // Or InputPanel
  const theme = useTheme();
  const { t, language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsive styling
  const isExtraSmallMobile = useMediaQuery('(max-width:380px)');


  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const infoPopoverOpen = Boolean(infoAnchorEl);

  const [focusedInput, setFocusedInput] = useState(null);
  const [editingDimension, setEditingDimension] = useState(null);
  const [tempDimensionValue, setTempDimensionValue] = useState("");

  const handleInfoClick = (event) => {
    setInfoAnchorEl(event.currentTarget);
  };

  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };

  // This function will be passed to PrinterInfoPopover
  // It calls the onInputChange from props, which ultimately updates the useSimulation hook
  const handleInitialInvestmentChange = (value) => {
    onInputChange('initialInvestment', value);
  };

  const handleNumericChange = (name, value, min, max) => {
    const rawValue = value.toString().replace(/,/g, '');
     if (rawValue === '') {
      onInputChange(name, ''); // Allow clearing the field
      return;
    }
    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue) && (min === undefined || numValue >= min) && (max === undefined || numValue <= max)) {
      onInputChange(name, numValue);
    } else if (isNaN(numValue) && rawValue.length > 0) {
      // If it's not a number but not empty, perhaps keep the last valid value or an empty string
      // For now, we'll just not update if invalid and not empty
    } else if (rawValue.length === 0) {
       onInputChange(name, ''); // explicitly set to empty
    }
  };

  const handleStepperClick = (name, step, min, max) => {
    const currentValue = parseFloat(inputs[name]) || 0; // Ensure current value is a number
    let newValue = currentValue + step;

    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);

    onInputChange(name, newValue);
  };


  const handleFocus = (name) => {
    setFocusedInput(name);
  };

  const handleBlur = (name) => { // Added name to correctly reset specific input if needed
    setFocusedInput(null);
    // Ensure values are valid numbers on blur for inputs that allow direct typing
    const numericFields = ['salesPricePerUnit', 'materialCostPerUnit', 'laborCostPerHour', 'inkPricePerCC', 'monthlySalesVolume'];
    if (numericFields.includes(name)) {
        const currentValue = inputs[name];
        if (currentValue === '' || isNaN(parseFloat(currentValue))) {
            // Find the default for this field, or set to 0 if not crucial
            // For simplicity here, let's ensure it's at least 0 if it was meant to be a number
            // A more robust solution would be to use default values from constants.js
            const defaults = {
                salesPricePerUnit: 0, materialCostPerUnit: 0, laborCostPerHour: 0, inkPricePerCC: 0, monthlySalesVolume: 0
            };
            onInputChange(name, defaults[name]);
        }
    }
  };

  const startEditingDimension = (name, currentValue) => {
    setEditingDimension(name);
    setTempDimensionValue(currentValue.toString());
  };

  const handleDimensionChange = (e) => {
    setTempDimensionValue(e.target.value);
  };

  const finishEditingDimension = (name, min, max) => {
    const value = parseInt(tempDimensionValue, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      onInputChange(name, value);
    } else {
      // Revert to original value if input is invalid
      setTempDimensionValue(inputs[name].toString());
    }
    setEditingDimension(null);
  };

  const handleDimensionKeyDown = (e, name, min, max) => {
    if (e.key === 'Enter') {
      finishEditingDimension(name, min, max);
      e.target.blur();
    } else if (e.key === 'Escape') {
      setTempDimensionValue(inputs[name].toString()); // Revert on escape
      setEditingDimension(null);
      e.target.blur();
    }
  };

  const getFocusBorderColor = (name) => {
    if (name === focusedInput) {
      if (name.includes('Edge')) return theme.palette.primary.main;
      if (name.includes('Price') || name.includes('Cost')) return theme.palette.primary.main;
      return theme.palette.primary.main;
    }
    return 'transparent'; // This was 'transparent', might need to be theme.palette.divider or similar
  };

  const SectionHeader = ({ icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
      <Box sx={{
        mr: 1.5,
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </Box>
      <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
        {title}
      </Typography>
    </Box>
  );

  // Modified input component to match the DimensionInput style
  const NumericInput = ({
    label,
    value,
    name,
    endAdornment,
    min,
    max,
    helperText,
    step = 1,
  }) => (
    <div>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, -step, min, max)}
          sx={{
            minWidth: isExtraSmallMobile ? '30px' : '40px',
            width: isExtraSmallMobile ? '30px' : '40px',
            height: isExtraSmallMobile ? '34px' : '40px',
            padding: 0,
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)',
            mr: 1,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
            }
          }}
        >
          −
        </Button>
        {editingDimension === name ? (
          <TextField
            autoFocus
            value={tempDimensionValue}
            onChange={handleDimensionChange}
            onBlur={() => finishEditingDimension(name, min, max)}
            onKeyDown={(e) => handleDimensionKeyDown(e, name, min, max)}
            variant="outlined"
            size="small"
            type="number"
            InputProps={{
              endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
            }}
            inputProps={{
              min,
              max,
              style: { textAlign: 'center' }
            }}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                '& .MuiOutlinedInput-input': {
                  textAlign: 'center',
                  padding: '8px',
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  fontWeight: 500
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                },
              },
              '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
              },
              '& input[type=number]': {
                MozAppearance: 'textfield'
              }
            }}
          />
        ) : (
          <Box
            onClick={() => startEditingDimension(name, value)}
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontSize: isMobile ? '1rem' : '1.25rem',
              fontWeight: 500,
              cursor: 'text',
              padding: '6px 0',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {value === '' ? '' : Number(value).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}
            {endAdornment && ` ${endAdornment}`}
          </Box>
        )}
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, step, min, max)}
          sx={{
            minWidth: isExtraSmallMobile ? '30px' : '40px',
            width: isExtraSmallMobile ? '30px' : '40px',
            height: isExtraSmallMobile ? '34px' : '40px',
            padding: 0,
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)',
            ml: 1,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
            }
          }}
        >
          +
        </Button>
      </Box>
      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </div>
  );
  
  const DimensionInput = ({
    label,
    value,
    name,
    min,
    max,
    helperText,
    step = 5
  }) => (
    <div>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {label} (mm)
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, -step, min, max)}
          sx={{
            minWidth: isExtraSmallMobile ? '30px' : '40px',
            width: isExtraSmallMobile ? '30px' : '40px',
            height: isExtraSmallMobile ? '34px' : '40px',
            padding: 0,
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)',
            mr: 1,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
            }
          }}
        >
          −
        </Button>
        {editingDimension === name ? (
          <TextField
            autoFocus
            value={tempDimensionValue}
            onChange={handleDimensionChange}
            onBlur={() => finishEditingDimension(name, min, max)}
            onKeyDown={(e) => handleDimensionKeyDown(e, name, min, max)}
            variant="outlined"
            size="small"
            type="number"
            inputProps={{
              min,
              max,
              style: { textAlign: 'center' }
            }}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                '& .MuiOutlinedInput-input': {
                  textAlign: 'center',
                  padding: '8px',
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  fontWeight: 500
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                },
              },
              '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
              },
              '& input[type=number]': {
                MozAppearance: 'textfield'
              }
            }}
          />
        ) : (
          <Box
            onClick={() => startEditingDimension(name, value)}
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontSize: isMobile ? '1rem' : '1.25rem',
              fontWeight: 500,
              cursor: 'text',
              padding: '6px 0',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {value}
          </Box>
        )}
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, step, min, max)}
          sx={{
            minWidth: isExtraSmallMobile ? '30px' : '40px',
            width: isExtraSmallMobile ? '30px' : '40px',
            height: isExtraSmallMobile ? '34px' : '40px',
            padding: 0,
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)',
            ml: 1,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
            }
          }}
        >
          +
        </Button>
      </Box>
      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </div>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Typography variant="h5" gutterBottom sx={{
          fontWeight: 600,
          mt: 1,
          color: 'text.primary',
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          {t('simulationParameters')}
        </Typography>
        <Tooltip title={t('printerSpecifications')}>
          <Box
            component="span"
            onClick={handleInfoClick}
            sx={{
              cursor: 'pointer',
              color: 'text.secondary',
              transition: 'all 0.2s',
              '&:hover': {
                color: 'primary.main',
              },
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <InfoIcon />
          </Box>
        </Tooltip>
        <PrinterInfoPopover
          open={infoPopoverOpen}
          anchorEl={infoAnchorEl}
          handleClose={handleInfoClose}
          initialInvestment={inputs.initialInvestment} // Pass current initialInvestment
          onInitialInvestmentChange={handleInitialInvestmentChange} // Pass handler
        />
      </Box>

      <Fade in={true} timeout={500}>
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
            <SectionHeader icon={<DimensionsIcon />} title={t('productDimensions')} />
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} sm={6}> {/* Changed from xs={6} for better mobile stacking */}
                <DimensionInput
                  label={t('shortEdge')}
                  value={inputs.shortEdge}
                  name="shortEdge"
                  min={10}
                  max={305}
                  helperText={`${t('range')}: 10-305mm`}
                />
              </Grid>
              <Grid item xs={12} sm={6}> {/* Changed from xs={6} for better mobile stacking */}
                <DimensionInput
                  label={t('longEdge')}
                  value={inputs.longEdge}
                  name="longEdge"
                  min={10}
                  max={458}
                  helperText={`${t('range')}: 10-458mm`}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      <Fade in={true} timeout={600}>
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
            <SectionHeader icon={<VolumeIcon />} title={t('monthlySalesTarget')} />
            <Box sx={{ px: { xs: 0, sm: 2 }, mt: 2 }}>
              <Grid container spacing={2} alignItems="center" direction={isMobile ? "column" : "row"}>
                <Grid item xs={12} sm={isMobile ? 12 : 8}> {/* Full width on mobile */}
                  <Slider
                    value={typeof inputs.monthlySalesVolume === 'number' ? inputs.monthlySalesVolume : 0}
                    onChange={(_, value) => onInputChange('monthlySalesVolume', value)}
                    min={0}
                    max={1000}
                    step={10}
                    color="primary"
                    valueLabelDisplay="auto"
                    sx={{
                      height: 4,
                      padding: '15px 0',
                      width: '100%', // Ensure slider takes full width in its grid item
                      '& .MuiSlider-rail': {
                        opacity: 0.5,
                        backgroundColor: '#e0e0e0',
                        height: 4,
                      },
                      '& .MuiSlider-track': {
                        height: 4,
                        border: 'none',
                        backgroundColor: '#2471CC',
                      },
                      '& .MuiSlider-thumb': {
                        height: 20,
                        width: 20,
                        backgroundColor: '#fff',
                        border: `2px solid #2471CC`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:focus, &:hover, &.Mui-active': {
                          boxShadow: `0 0 0 8px rgba(36, 113, 204, 0.2)`,
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
                        borderRadius: '50% 50% 50% 0',
                        backgroundColor: '#2471CC',
                        transformOrigin: 'bottom left',
                        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                        '&:before': { display: 'none' },
                        '&.MuiSlider-valueLabelOpen': {
                          transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                        },
                        '& > *': {
                          transform: 'rotate(45deg)',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={isMobile ? 12 : 4}> {/* Full width on mobile */}
                  <NumericInput
                    label={t('unitsPerMonth')}
                    value={inputs.monthlySalesVolume}
                    name="monthlySalesVolume"
                    min={0}
                    max={1000}
                    step={10}
                    helperText={`${t('range')}: 0-1000`}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}> {/* This was spacing={3} */}
                <Grid item xs={12}>
                  <NumericInput
                    label={`${t('salesPricePerUnit')}`}
                    value={inputs.salesPricePerUnit}
                    name="salesPricePerUnit"
                    endAdornment={t('currency')}
                    min={0}
                    step={50} // As per constants.js
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      <Fade in={true} timeout={700}>
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
            <SectionHeader icon={<PriceIcon />} title={t('priceParameters')} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <NumericInput
                  label={`${t('materialCostPerUnit')}`}
                  value={inputs.materialCostPerUnit}
                  name="materialCostPerUnit"
                  endAdornment={t('currency')}
                  min={0}
                  step={10} // As per constants.js
                />
              </Grid>
              <Grid item xs={12}>
                <NumericInput
                  label={`${t('laborCostPerHour')}`}
                  value={inputs.laborCostPerHour}
                  name="laborCostPerHour"
                  endAdornment={t('currency')}
                  min={0}
                  step={100} // As per constants.js
                />
              </Grid>
              <Grid item xs={12}>
                <NumericInput
                  label={`${t('inkPrice')}`}
                  value={inputs.inkPricePerCC}
                  name="inkPricePerCC"
                  endAdornment={`${t('currency')}/${t('cc')}`}
                  min={0}
                  step={1} // As per constants.js
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default SimulationForm;