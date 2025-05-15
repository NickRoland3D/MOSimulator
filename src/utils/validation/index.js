/**
 * Input validation utilities for the application
 * Provides schema-based validation for all user inputs
 */

import { UI_CONSTANTS } from '../../config/constants';

// Get ranges from UI constants for validation
const { ranges } = UI_CONSTANTS;

/**
 * Validation schema for all input fields
 * Each field has validation rules to check against
 */
export const inputValidationSchema = {
  shortEdge: {
    required: true,
    type: 'number',
    min: ranges.shortEdge.min,
    max: ranges.shortEdge.max,
    errorMessages: {
      required: 'Short edge dimension is required',
      type: 'Short edge must be a number',
      min: `Short edge must be at least ${ranges.shortEdge.min}mm`,
      max: `Short edge must be at most ${ranges.shortEdge.max}mm`
    }
  },
  longEdge: {
    required: true,
    type: 'number',
    min: ranges.longEdge.min,
    max: ranges.longEdge.max,
    errorMessages: {
      required: 'Long edge dimension is required',
      type: 'Long edge must be a number',
      min: `Long edge must be at least ${ranges.longEdge.min}mm`,
      max: `Long edge must be at most ${ranges.longEdge.max}mm`
    }
  },
  salesPricePerUnit: {
    required: true,
    type: 'number',
    min: ranges.salesPricePerUnit.min,
    errorMessages: {
      required: 'Sales price is required',
      type: 'Sales price must be a number',
      min: 'Sales price cannot be negative'
    }
  },
  monthlySalesVolume: {
    required: true,
    type: 'number',
    min: ranges.monthlySalesVolume.min,
    max: ranges.monthlySalesVolume.max,
    errorMessages: {
      required: 'Monthly sales volume is required',
      type: 'Monthly sales volume must be a number',
      min: 'Monthly sales volume cannot be negative',
      max: `Monthly sales volume cannot exceed ${ranges.monthlySalesVolume.max} units`
    }
  },
  materialCostPerUnit: {
    required: true,
    type: 'number',
    min: ranges.materialCostPerUnit.min,
    errorMessages: {
      required: 'Material cost is required',
      type: 'Material cost must be a number',
      min: 'Material cost cannot be negative'
    }
  },
  laborCostPerHour: {
    required: true,
    type: 'number',
    min: ranges.laborCostPerHour.min,
    errorMessages: {
      required: 'Labor cost is required',
      type: 'Labor cost must be a number',
      min: 'Labor cost cannot be negative'
    }
  },
  inkPricePerCC: {
    required: true,
    type: 'number',
    min: ranges.inkPricePerCC.min,
    errorMessages: {
      required: 'Ink price is required',
      type: 'Ink price must be a number',
      min: 'Ink price cannot be negative'
    }
  },
  initialInvestment: {
    required: true,
    type: 'number',
    min: ranges.initialInvestment.min,
    errorMessages: {
      required: 'Initial investment is required',
      type: 'Initial investment must be a number',
      min: 'Initial investment must be greater than zero'
    }
  }
};

/**
 * Validate a single input value against its schema rules
 * @param {string} name - Field name to validate
 * @param {any} value - Value to validate
 * @param {Object} schema - Validation schema (defaults to inputValidationSchema)
 * @returns {Object} - Validation result {valid: boolean, errors: string[]}
 */
export const validateInput = (name, value, schema = inputValidationSchema) => {
  // Check if field exists in schema
  const rules = schema[name];
  if (!rules) {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  
  // Required field validation
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push(rules.errorMessages?.required || `${name} is required`);
  }
  
  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return { valid: errors.length === 0, errors };
  }
  
  // Type validation
  if (rules.type === 'number') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      errors.push(rules.errorMessages?.type || `${name} must be a number`);
    } else {
      // Minimum value validation
      if (rules.min !== undefined && numValue < rules.min) {
        errors.push(rules.errorMessages?.min || `${name} must be at least ${rules.min}`);
      }
      
      // Maximum value validation
      if (rules.max !== undefined && numValue > rules.max) {
        errors.push(rules.errorMessages?.max || `${name} must be at most ${rules.max}`);
      }
    }
  }
  
  // Additional custom validations could be added here
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate all input fields at once
 * @param {Object} inputs - Object containing all input values
 * @param {Object} schema - Validation schema (defaults to inputValidationSchema) 
 * @returns {Object} - Validation results for all fields {fieldName: {valid, errors}}
 */
export const validateAllInputs = (inputs, schema = inputValidationSchema) => {
  const validationResults = {};
  
  // Validate each field in the schema
  Object.keys(schema).forEach(fieldName => {
    validationResults[fieldName] = validateInput(fieldName, inputs[fieldName], schema);
  });
  
  return validationResults;
};

/**
 * Check if all inputs are valid
 * @param {Object} validationResults - Results from validateAllInputs
 * @returns {boolean} - True if all inputs are valid
 */
export const areAllInputsValid = (validationResults) => {
  return Object.values(validationResults).every(result => result.valid);
};
