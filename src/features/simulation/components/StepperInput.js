import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * StepperInput Component
 * Reusable numeric input with increment/decrement buttons
 * Updated to match DimensionInput styling
 */
const StepperInput = ({
  label,
  value,
  name,
  endAdornment,
  min,
  max,
  helperText,
  error,
  startAdornment,
  step = 1,
  fullWidth = true,
  language = 'en-US',
  onValueChange,
  onFocus,
  onBlur
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Add editing state similar to DimensionInput
  const [editingActive, setEditingActive] = useState(false);
  const [tempValue, setTempValue] = useState("");
  
  // Format value display based on language
  const displayValue = value === '' 
    ? '' 
    : Number(value).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US');

  // Start editing the value
  const startEditing = (currentValue) => {
    if (onFocus) onFocus(name);
    setEditingActive(true);
    setTempValue(currentValue === '' ? '' : currentValue.toString());
  };

  // Handle text input change during editing
  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  // Finish editing and update if valid
  const finishEditing = () => {
    if (onBlur) onBlur(name);
    
    // Process the value
    const rawValue = tempValue.toString().replace(/,/g, '');
    
    if (rawValue === '') {
      onValueChange(name, '');
    } else {
      const numValue = parseFloat(rawValue);
      if (!isNaN(numValue)) {
        // Apply constraints
        if (min !== undefined && numValue < min) {
          onValueChange(name, min);
        } else if (max !== undefined && numValue > max) {
          onValueChange(name, max);
        } else {
          onValueChange(name, numValue);
        }
      }
    }
    
    setEditingActive(false);
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
      e.target.blur();
    } else if (e.key === 'Escape') {
      setTempValue(value.toString()); // Revert
      setEditingActive(false);
      if (onBlur) onBlur(name);
      e.target.blur();
    }
  };

  // Handle stepper button clicks
  const handleStepperClick = (stepValue) => {
    const currentValue = parseFloat(value) || 0;
    let newValue = currentValue + stepValue;

    // Apply min/max constraints
    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);

    onValueChange(name, newValue);
  };

  // Format display value with endAdornment if needed
  const displayTextWithUnit = endAdornment ? `${displayValue} ${endAdornment}` : displayValue;
  
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography 
        variant="subtitle2" 
        gutterBottom 
        sx={{ fontWeight: 500, color: error ? 'error.main' : 'text.secondary' }}
      >
        {label}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
        gap: isMobile ? '5px' : '10px'
      }}>
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(-step)}
          sx={{
            minWidth: isMobile ? '36px' : '44px',
            width: isMobile ? '36px' : '44px',
            height: '44px',
            padding: 0,
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#666',
            borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f5f5f5',
            flexShrink: 0,
            '&:hover': {
              borderColor: error ? 'error.main' : 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }
          }}
        >
          −
        </Button>
        
        {editingActive ? (
          <TextField
            autoFocus
            value={tempValue}
            onChange={handleInputChange}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
            type="text"
            InputProps={{
              endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
            }}
            inputProps={{
              min,
              max,
              style: { textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem' }
            }}
            error={Boolean(error)}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-input': {
                  textAlign: 'center',
                  padding: isMobile ? '6px' : '8px',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: 500
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.2)',
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
            onClick={() => startEditing(value)}
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontSize: isMobile ? '0.9rem' : '1rem',
              fontWeight: 500,
              cursor: 'text',
              padding: '10px 0',
              borderRadius: '8px',
              border: `1px solid ${error ? 'error.main' : 'rgba(0, 0, 0, 0.2)'}`,
              backgroundColor: '#fff',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }
            }}
          >
            {displayTextWithUnit}
          </Box>
        )}
        
        <Button
          variant="outlined"
          onClick={() => handleStepperClick(step)}
          sx={{
            minWidth: isMobile ? '36px' : '44px',
            width: isMobile ? '36px' : '44px',
            height: '44px',
            padding: 0,
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#666',
            borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f5f5f5',
            flexShrink: 0,
            '&:hover': {
              borderColor: error ? 'error.main' : 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }
          }}
        >
          +
        </Button>
      </Box>
      {helperText && (
        <Typography 
          variant="caption" 
          color={error ? 'error.main' : 'text.secondary'}
          sx={{ fontSize: isMobile ? '0.65rem' : '0.7rem' }}
        >
          {helperText}
        </Typography>
      )}
      {error && !helperText && (
        <Typography 
          variant="caption" 
          color="error"
          sx={{ display: 'block', mt: 0.5, fontSize: isMobile ? '0.65rem' : '0.7rem' }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default StepperInput;