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
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';
import PrinterInfoPopover from './PrinterInfoPopover';

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
 * Input Panel Component
 * Handles user inputs for the simulation with enhanced styling and improved aesthetics
 */
const InputPanel = ({ inputs, onInputChange }) => {
  const theme = useTheme();
  const { t } = useLanguage(); // Get translation function
  
  // State for printer info popover
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const infoPopoverOpen = Boolean(infoAnchorEl);
  
  // State to track which input is focused for accent colors
  const [focusedInput, setFocusedInput] = useState(null);
  
  // State for editable dimension values
  const [editingDimension, setEditingDimension] = useState(null);
  const [tempDimensionValue, setTempDimensionValue] = useState("");
  
  // Handle info icon click
  const handleInfoClick = (event) => {
    setInfoAnchorEl(event.currentTarget);
  };
  
  // Handle info popover close
  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };
  
  // Handle numeric input changes with validation
  const handleNumericChange = (name, value, min, max) => {
    // Parse value as number
    const numValue = parseFloat(value);
    
    // Validate number is within range
    if (!isNaN(numValue) && (min === undefined || numValue >= min) && (max === undefined || numValue <= max)) {
      onInputChange(name, numValue);
    }
  };
  
  // Handle stepper button clicks
  const handleStepperClick = (name, step, min, max) => {
    const currentValue = inputs[name];
    const newValue = currentValue + step;
    
    // Validate the new value is within range
    if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
      onInputChange(name, newValue);
    }
  };

  // Handle focus and blur events for accent colors
  const handleFocus = (name) => {
    setFocusedInput(name);
  };
  
  const handleBlur = () => {
    setFocusedInput(null);
  };

  // Handle dimension editing
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
    }
    setEditingDimension(null);
  };

  const handleDimensionKeyDown = (e, name, min, max) => {
    if (e.key === 'Enter') {
      finishEditingDimension(name, min, max);
    } else if (e.key === 'Escape') {
      setEditingDimension(null);
    }
  };
  
  // Accent color for active input based on input type
  const getFocusBorderColor = (name) => {
    if (name === focusedInput) {
      if (name.includes('Edge')) return theme.palette.primary.main;
      if (name.includes('Price') || name.includes('Cost')) return theme.palette.primary.main;
      return theme.palette.primary.main;
    }
    return 'transparent';
  };

  // Section header with icon
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
      <Typography variant="h6" fontWeight="600" color="text.primary">
        {title}
      </Typography>
    </Box>
  );

  // Custom input field with label and +/- buttons
  const StepperInput = ({ 
    label, 
    value, 
    name, 
    endAdornment, 
    min, 
    max, 
    helperText, 
    startAdornment, 
    step = 1,
    fullWidth = true 
  }) => (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Minus Button (Left) */}
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, -step, min, max)}
          sx={{
            minWidth: '40px',
            height: '40px',
            padding: 0,
            borderRadius: '8px 0 0 8px', // Rounded corners matching the design
            borderRight: 0,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)', // Lighter border as in the design
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
            }
          }}
        >
          −
        </Button>
        
        {/* Input Field (Center) */}
        <TextField
          value={value}
          onChange={(e) => handleNumericChange(name, e.target.value, min, max)}
          onFocus={() => handleFocus(name)}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
            endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
            disableUnderline: true,
          }}
          inputProps={{ 
            min,
            max,
            style: { 
              textAlign: 'center',
              fontSize: '1rem',
              padding: '8px 0'
            }
          }}
          type="number"
          variant="outlined"
          size="medium"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              fontWeight: 500,
              transition: 'all 0.2s ease-in-out',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.15)', // Lighter border as in the design
                borderLeftWidth: 0,
                borderRightWidth: 0,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: getFocusBorderColor(name),
                borderWidth: 1,
                borderLeftWidth: 0,
                borderRightWidth: 0,
              }
            },
            // Remove inner arrows from number inputs
            '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0
            },
            '& input[type=number]': {
              '-moz-appearance': 'textfield'
            }
          }}
        />
        
        {/* Plus Button (Right) */}
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, step, min, max)}
          sx={{
            minWidth: '40px',
            height: '40px',
            padding: 0,
            borderRadius: '0 8px 8px 0', // Rounded corners matching the design
            borderLeft: 0,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)', // Lighter border as in the design
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
    </Box>
  );

  // Special version for product dimensions that matches the reference and allows editing
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
        {/* Minus Button */}
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, -step, min, max)}
          sx={{
            minWidth: '40px',
            width: '40px',
            height: '40px',
            padding: 0,
            borderRadius: '8px', // Rounded corners matching the design
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)', // Lighter border as in the design
            mr: 1,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
            }
          }}
        >
          −
        </Button>
        
        {/* Value Display - Can be edited */}
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
                borderRadius: 8, // Rounded corners matching the design
                '& .MuiOutlinedInput-input': {
                  textAlign: 'center',
                  padding: '8px',
                  fontSize: '1.25rem',
                  fontWeight: 500
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.15)', // Lighter border as in the design
                },
              },
              // Remove inner arrows from number inputs
              '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
              },
              '& input[type=number]': {
                '-moz-appearance': 'textfield'
              }
            }}
          />
        ) : (
          <Box 
            onClick={() => startEditingDimension(name, value)}
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center', 
              fontSize: '1.25rem',
              fontWeight: 500,
              cursor: 'text',
              padding: '6px 0',
              borderRadius: 2, // Rounded corners matching the design
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {value}
          </Box>
        )}
        
        {/* Plus Button */}
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(name, step, min, max)}
          sx={{
            minWidth: '40px',
            width: '40px',
            height: '40px',
            padding: 0,
            borderRadius: '8px', // Rounded corners matching the design
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.15)', // Lighter border as in the design
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
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 1, color: 'text.primary' }}>
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
        />
      </Box>

      {/* Product Dimensions - Using the new DimensionInput component */}
      <Fade in={true} timeout={500}>
        <Card 
          sx={{ 
            mb: 3, 
            overflow: 'visible',
            borderRadius: 3, // Rounded corners matching the design
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)', // Subtle shadow as in the design
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CardContent sx={{ px: 3, py: 2.5 }}>
            <SectionHeader icon={<DimensionsIcon />} title={t('productDimensions')} />
            
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <DimensionInput
                  label={t('shortEdge')}
                  value={inputs.shortEdge}
                  name="shortEdge"
                  min={10}
                  max={305}
                  helperText={`${t('range')}: 10-305mm`}
                />
              </Grid>
              <Grid item xs={6}>
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

      {/* Sales Volume Slider */}
      <Fade in={true} timeout={600}>
        <Card 
          sx={{ 
            mb: 3, 
            overflow: 'visible',
            borderRadius: 3, // Rounded corners matching the design
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)', // Subtle shadow as in the design
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CardContent sx={{ px: 3, py: 2.5 }}>
            <SectionHeader icon={<VolumeIcon />} title={t('monthlySalesTarget')} />
            
            <Box sx={{ px: 2, mt: 2 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={8}>
                  <Slider
                    value={inputs.monthlySalesVolume}
                    onChange={(_, value) => onInputChange('monthlySalesVolume', value)}
                    min={0}
                    max={1000}
                    step={10}
                    color="primary"
                    valueLabelDisplay="auto"
                    sx={{
                      height: 4,
                      padding: '15px 0',
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
                <Grid item xs={4}>
                  <TextField
                    value={inputs.monthlySalesVolume}
                    onChange={(e) => handleNumericChange('monthlySalesVolume', e.target.value, 0, 1000)}
                    onFocus={() => handleFocus('monthlySalesVolume')}
                    onBlur={handleBlur}
                    inputProps={{ 
                      min: 0, 
                      max: 1000,
                      style: { textAlign: 'center', fontWeight: '500', fontSize: '1.1rem' }
                    }}
                    type="number"
                    size="small"
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontWeight: 500,
                        borderRadius: '12px', // Rounded corners matching the design
                        height: '48px',
                        backgroundColor: '#fff',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.15)', // Lighter border as in the design
                        },
                        '&.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 1
                          }
                        }
                      },
                      // Remove inner arrows from number inputs
                      '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                      },
                      '& input[type=number]': {
                        '-moz-appearance': 'textfield'
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', fontWeight: 500, mb: 2 }}>
                {t('unitsPerMonth')} (0-1000)
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StepperInput
                    label={`${t('salesPricePerUnit')} (${t('currency')})`}
                    value={inputs.salesPricePerUnit}
                    name="salesPricePerUnit"
                    min={0}
                    step={50}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Price Inputs */}
      <Fade in={true} timeout={700}>
        <Card 
          sx={{ 
            mb: 3, 
            overflow: 'visible',
            borderRadius: 3, // Rounded corners matching the design
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)', // Subtle shadow as in the design
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CardContent sx={{ px: 3, py: 2.5 }}>
            <SectionHeader icon={<PriceIcon />} title={t('priceParameters')} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StepperInput
                  label={`${t('materialCostPerUnit')} (${t('currency')})`}
                  value={inputs.materialCostPerUnit}
                  name="materialCostPerUnit"
                  min={0}
                  step={10}
                />
              </Grid>
              <Grid item xs={12}>
                <StepperInput
                  label={`${t('laborCostPerHour')} (${t('currency')})`}
                  value={inputs.laborCostPerHour}
                  name="laborCostPerHour"
                  min={0}
                  step={100}
                />
              </Grid>
              <Grid item xs={12}>
                <StepperInput
                  label={`${t('inkPrice')} (${t('currency')}/${t('cc')})`}
                  value={inputs.inkPricePerCC}
                  name="inkPricePerCC"
                  min={0}
                  step={1}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default InputPanel;