/**
 * Test suite for validation utilities
 * Tests the validation functions to ensure they work correctly
 */

import { 
  validateInput, 
  validateAllInputs, 
  areAllInputsValid,
  inputValidationSchema
} from '../utils/validation';

describe('Validation Utilities', () => {
  // Test validateInput
  describe('validateInput', () => {
    test('validates required fields', () => {
      const result = validateInput('shortEdge', '', inputValidationSchema);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    test('validates numeric fields', () => {
      const result = validateInput('shortEdge', 'abc', inputValidationSchema);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('number');
    });
    
    test('validates minimum values', () => {
      const result = validateInput('shortEdge', 5, inputValidationSchema);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('at least');
    });
    
    test('validates maximum values', () => {
      const result = validateInput('shortEdge', 500, inputValidationSchema);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('at most');
    });
    
    test('passes valid values', () => {
      const result = validateInput('shortEdge', 100, inputValidationSchema);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
    
    test('handles unknown fields', () => {
      const result = validateInput('unknownField', 100, inputValidationSchema);
      expect(result.valid).toBe(true);
    });
  });
  
  // Test validateAllInputs
  describe('validateAllInputs', () => {
    const sampleInputs = {
      shortEdge: 100,
      longEdge: 100,
      salesPricePerUnit: 1000,
      monthlySalesVolume: 300,
      materialCostPerUnit: 200,
      laborCostPerHour: 2000,
      inkPricePerCC: 18,
      initialInvestment: 3780000
    };
    
    test('validates all fields correctly', () => {
      const results = validateAllInputs(sampleInputs);
      
      // All fields should be valid
      Object.values(results).forEach(result => {
        expect(result.valid).toBe(true);
      });
    });
    
    test('catches invalid fields', () => {
      const badInputs = {
        ...sampleInputs,
        shortEdge: 5, // Too small
        salesPricePerUnit: 'abc' // Not a number
      };
      
      const results = validateAllInputs(badInputs);
      
      expect(results.shortEdge.valid).toBe(false);
      expect(results.salesPricePerUnit.valid).toBe(false);
      expect(results.longEdge.valid).toBe(true); // This one is still valid
    });
  });
  
  // Test areAllInputsValid
  describe('areAllInputsValid', () => {
    test('returns true when all inputs are valid', () => {
      const validationResults = {
        field1: { valid: true, errors: [] },
        field2: { valid: true, errors: [] }
      };
      
      expect(areAllInputsValid(validationResults)).toBe(true);
    });
    
    test('returns false when any input is invalid', () => {
      const validationResults = {
        field1: { valid: true, errors: [] },
        field2: { valid: false, errors: ['Error'] }
      };
      
      expect(areAllInputsValid(validationResults)).toBe(false);
    });
    
    test('handles empty validation results', () => {
      expect(areAllInputsValid({})).toBe(true);
    });
  });
});
