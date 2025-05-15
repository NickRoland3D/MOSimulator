/**
 * Common formatting utilities for the application
 * Centralizes all formatting logic to avoid duplication across components
 */

/**
 * Format a number with commas as thousands separators
 * @param {number} num - The number to format
 * @param {number} decimals - The number of decimal places (default: 0)
 * @param {string} language - The language code for localization (default: 'en-US')
 * @returns {string} - Formatted number
 */
export const formatNumber = (num, decimals = 0, language = 'en-US') => {
  if (num === undefined || num === null || num === '') return '';
  if (typeof num === 'string' && !isFinite(parseFloat(num))) return num;
  
  const locale = language === 'ja' ? 'ja-JP' : 'en-US';
  
  return Number(num).toLocaleString(locale, { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a currency value
 * @param {number} amount - The amount to format
 * @param {string} language - The language code (default: 'en-US')
 * @param {string} currencySymbol - The currency symbol to use
 * @param {boolean} isEstimate - Whether to prefix with "approx" in Japanese (default: false)
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (amount, language = 'en-US', currencySymbol = '¥', isEstimate = false) => {
  if (amount === undefined || amount === null || amount === '') return '';
  if (amount === 0) return language === 'ja' ? `0${currencySymbol === '¥' ? '円' : currencySymbol}` : `${currencySymbol} 0`;
  
  // Use '円' symbol instead of '¥' for Japanese
  const symbol = language === 'ja' && currencySymbol === '¥' ? '円' : currencySymbol;
  
  // Place the currency symbol after the number for Japanese
  if (language === 'ja') {
    return isEstimate 
      ? `約${formatNumber(Math.round(amount), 0, language)}${symbol}` 
      : `${formatNumber(Math.round(amount), 0, language)}${symbol}`;
  }
  
  // Default format for other languages
  return `${symbol} ${formatNumber(Math.round(amount), 0, language)}`;
};

/**
 * Format a percentage value
 * @param {number} value - The value to format as percentage 
 * @param {number} decimals - The number of decimal places (default: 2)
 * @returns {string} - Formatted percentage with % symbol
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === undefined || value === null || value === '') return '';
  if (isNaN(parseFloat(value))) return '0.00%';
  
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Safely convert a value to a number, with fallback
 * @param {any} value - The value to convert
 * @param {number} fallback - The fallback value if conversion fails (default: 0)
 * @returns {number} - The converted number or fallback
 */
export const safeNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === '') return fallback;
  
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
};

/**
 * Safe division that handles division by zero
 * @param {number} numerator - The numerator
 * @param {number} denominator - The denominator
 * @param {*} fallback - The fallback value if denominator is zero
 * @returns {number|*} - The division result or fallback
 */
export const safeDivide = (numerator, denominator, fallback = 0) => {
  if (denominator === 0 || denominator === null || denominator === undefined) {
    return fallback;
  }
  return numerator / denominator;
};
