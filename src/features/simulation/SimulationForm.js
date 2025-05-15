// MO Simulator/src/features/simulation/SimulationForm.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';
import PrinterInfoPopover from './components/PrinterInfoPopover';
import ProductDimensionsCard from './components/ProductDimensionsCard';
import SalesVolumeCard from './components/SalesVolumeCard';
import PriceParametersCard from './components/PriceParametersCard';
import { InfoIcon } from './components/Icons';
import { validateInput, validateAllInputs } from '../../utils/validation';

/**
 * SimulationForm Component
 * Main form component for simulation inputs with validation
 */
const SimulationForm = ({ inputs, onInputChange }) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for form validation and focus tracking
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Printer info popover state
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const infoPopoverOpen = Boolean(infoAnchorEl);

  // Validate all inputs on initial load
  useEffect(() => {
    const initialValidation = validateAllInputs(inputs);
    const initialErrors = {};
    
    // Only store actual error messages
    Object.entries(initialValidation).forEach(([field, result]) => {
      if (!result.valid) {
        initialErrors[field] = result.errors[0];
      }
    });
    
    setErrors(initialErrors);
  }, []);
  
  // Handle input change with validation
  const handleValidatedInputChange = (name, value) => {
    // Validate the input
    const validationResult = validateInput(name, value);
    
    // Update errors state
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validationResult.valid ? null : validationResult.errors[0]
    }));
    
    // If valid or empty (for optional fields), propagate the change
    onInputChange(name, value);
  };
  
  // Handle input focus
  const handleInputFocus = (name) => {
    setFocusedInput(name);
  };
  
  // Handle input blur with additional validation
  const handleInputBlur = (name) => {
    setFocusedInput(null);
    
    // Validate again on blur to catch any issues
    const validationResult = validateInput(name, inputs[name]);
    
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validationResult.valid ? null : validationResult.errors[0]
    }));
    
    // Handle empty inputs on blur - set to default or minimum value
    if (inputs[name] === '' || inputs[name] === null || inputs[name] === undefined) {
      // Set minimum values based on the field
      const defaultValues = {
        shortEdge: 10,
        longEdge: 10,
        salesPricePerUnit: 0,
        monthlySalesVolume: 0,
        materialCostPerUnit: 0,
        laborCostPerHour: 0,
        inkPricePerCC: 0
      };
      
      onInputChange(name, defaultValues[name] || 0);
    }
  };
  
  // Handle printer info popover
  const handleInfoClick = (event) => {
    setInfoAnchorEl(event.currentTarget);
  };

  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };

  // Handle initial investment change from the printer info popover
  const handleInitialInvestmentChange = (value) => {
    handleValidatedInputChange('initialInvestment', value);
  };

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
          initialInvestment={inputs.initialInvestment}
          onInitialInvestmentChange={handleInitialInvestmentChange}
          error={errors.initialInvestment}
        />
      </Box>

      {/* Product Dimensions Card */}
      <ProductDimensionsCard
        inputs={inputs}
        errors={errors}
        onInputChange={handleValidatedInputChange}
      />
      
      {/* Sales Volume Card */}
      <SalesVolumeCard
        inputs={inputs}
        errors={errors}
        focusedInput={focusedInput}
        onInputChange={handleValidatedInputChange}
        onInputFocus={handleInputFocus}
        onInputBlur={handleInputBlur}
      />
      
      {/* Price Parameters Card */}
      <PriceParametersCard
        inputs={inputs}
        errors={errors}
        onInputChange={handleValidatedInputChange}
        onInputFocus={handleInputFocus}
        onInputBlur={handleInputBlur}
      />
    </Box>
  );
};

export default SimulationForm;
