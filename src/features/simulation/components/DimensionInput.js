import React, { useState } from 'react';
import { Box, Typography, Button, TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Dimension Input Component
 * Reusable component for dimension inputs with edit functionality
 */
const DimensionInput = ({
  label,
  value,
  name,
  min,
  max,
  helperText,
  error,
  step = 5,
  onValueChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editingActive, setEditingActive] = useState(false);
  const [tempValue, setTempValue] = useState("");

  // Start editing the dimension value
  const startEditing = (currentValue) => {
    setEditingActive(true);
    setTempValue(currentValue.toString());
  };

  // Handle text input change
  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  // Finish editing and update the value if valid
  const finishEditing = () => {
    const numValue = parseInt(tempValue, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onValueChange(name, numValue);
    } else {
      // Revert to original value if input is invalid
      setTempValue(value.toString());
    }
    setEditingActive(false);
  };

  // Handle keyboard events (Enter to submit, Escape to cancel)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
      e.target.blur();
    } else if (e.key === 'Escape') {
      setTempValue(value.toString()); // Revert on escape
      setEditingActive(false);
      e.target.blur();
    }
  };

  // Increment/decrement value with step buttons
  const handleStepperClick = (step) => {
    const currentValue = parseInt(value, 10) || 0;
    let newValue = currentValue + step;

    // Apply min/max constraints
    newValue = Math.max(min, Math.min(max, newValue));
    
    onValueChange(name, newValue);
  };

  return (
    <div>
      <Typography 
        variant="subtitle2" 
        gutterBottom 
        sx={{ fontWeight: 500, color: error ? 'error.main' : 'text.secondary' }}
      >
        {label} (mm)
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 1,
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
            type="number"
            error={Boolean(error)}
            inputProps={{
              min,
              max,
              style: { textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem' }
            }}
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
            {value}
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
      {error && (
        <Typography 
          variant="caption" 
          color="error"
          sx={{ display: 'block', mt: 0.5, fontSize: isMobile ? '0.65rem' : '0.7rem' }}
        >
          {error}
        </Typography>
      )}
    </div>
  );
};

export default DimensionInput;