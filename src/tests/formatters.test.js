/**
 * Test suite for formatting utilities
 * Tests the formatting functions to ensure they work correctly
 */

import { 
  formatNumber, 
  formatCurrency, 
  formatPercent, 
  safeNumber, 
  safeDivide 
} from '../utils/formatters';

describe('Formatting Utilities', () => {
  // Test formatNumber
  describe('formatNumber', () => {
    test('formats numbers with thousands separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
    
    test('handles decimal places correctly', () => {
      expect(formatNumber(1000.123, 2)).toBe('1,000.12');
      expect(formatNumber(1000.5, 0)).toBe('1,001'); // Should round
    });
    
    test('handles language-specific formatting', () => {
      // Japanese format uses different thousands separator
      expect(formatNumber(1000000, 0, 'ja')).toBe('1,000,000');
    });
    
    test('handles invalid inputs', () => {
      expect(formatNumber(null)).toBe('');
      expect(formatNumber(undefined)).toBe('');
      expect(formatNumber('')).toBe('');
      expect(formatNumber('abc')).toBe('abc');
    });
  });
  
  // Test formatCurrency
  describe('formatCurrency', () => {
    test('formats currency with symbol', () => {
      expect(formatCurrency(1000, 'en-US', '$')).toBe('$ 1,000');
      expect(formatCurrency(1000, 'ja', '¥')).toBe('1,000¥');
    });
    
    test('handles approximate values in Japanese', () => {
      expect(formatCurrency(1000, 'ja', '¥', true)).toBe('約1,000¥');
    });
    
    test('handles zero values', () => {
      expect(formatCurrency(0, 'en-US', '$')).toBe('$ 0');
      expect(formatCurrency(0, 'ja', '¥')).toBe('0¥');
    });
    
    test('handles invalid inputs', () => {
      expect(formatCurrency(null)).toBe('');
      expect(formatCurrency(undefined)).toBe('');
      expect(formatCurrency('')).toBe('');
    });
  });
  
  // Test formatPercent
  describe('formatPercent', () => {
    test('formats percentages with correct decimal places', () => {
      expect(formatPercent(10)).toBe('10.00%');
      expect(formatPercent(10.5)).toBe('10.50%');
      expect(formatPercent(10.555, 3)).toBe('10.555%');
    });
    
    test('handles invalid inputs', () => {
      expect(formatPercent(null)).toBe('');
      expect(formatPercent(undefined)).toBe('');
      expect(formatPercent('')).toBe('');
      expect(formatPercent('abc')).toBe('0.00%');
    });
  });
  
  // Test safeNumber
  describe('safeNumber', () => {
    test('converts valid values to numbers', () => {
      expect(safeNumber('123')).toBe(123);
      expect(safeNumber(123)).toBe(123);
      expect(safeNumber('123.45')).toBe(123.45);
    });
    
    test('returns fallback for invalid values', () => {
      expect(safeNumber(null)).toBe(0);
      expect(safeNumber(undefined)).toBe(0);
      expect(safeNumber('')).toBe(0);
      expect(safeNumber('abc')).toBe(0);
      expect(safeNumber(null, 10)).toBe(10); // Custom fallback
    });
  });
  
  // Test safeDivide
  describe('safeDivide', () => {
    test('performs division correctly', () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(10, 3)).toBeCloseTo(3.333, 2);
    });
    
    test('handles division by zero', () => {
      expect(safeDivide(10, 0)).toBe(0);
      expect(safeDivide(10, 0, 'Error')).toBe('Error');
    });
    
    test('handles invalid inputs', () => {
      expect(safeDivide(null, 2)).toBe(0);
      expect(safeDivide(10, null)).toBe(0);
      expect(safeDivide('abc', 2)).toBe(0);
    });
  });
});
