import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { calculateResults } from '../services/calculationService';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';
import { validateAllInputs, areAllInputsValid } from '../utils/validation';

/**
 * Custom hook for managing simulation state and calculations
 * Handles inputs, results, validation, and formatting
 * 
 * @param {Object} initialInputs - Initial input values for the simulation
 * @returns {Object} - State and methods for simulation management
 */
const useSimulation = (initialInputs) => {
  // State management for inputs, results, and validation
  const [inputs, setInputs] = useState(initialInputs);
  const [results, setResults] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const { language, t } = useLanguage();

  // Initialize results on mount
  useEffect(() => {
    try {
      const initialResults = calculateResults(initialInputs);
      setResults(initialResults);
      
      // Validate initial inputs
      const validationResults = validateAllInputs(initialInputs);
      setIsValid(areAllInputsValid(validationResults));
    } catch (error) {
      console.error('Error initializing simulation:', error);
      setResults(null);
      setIsValid(false);
    }
  }, [initialInputs]);

  // Handle input changes with debouncing for performance
  const handleInputChange = useCallback((name, value) => {
    setInputs(prevInputs => {
      const newInputs = { ...prevInputs, [name]: value };
      
      // Validate inputs
      const validationResults = validateAllInputs(newInputs);
      const valid = areAllInputsValid(validationResults);
      setIsValid(valid);
      
      // Update results if inputs are valid
      if (valid) {
        setIsCalculating(true);
        
        // Use setTimeout to prevent UI blocking during calculation
        setTimeout(() => {
          try {
            const newResults = calculateResults(newInputs);
            setResults(newResults);
          } catch (error) {
            console.error('Error calculating results:', error);
          } finally {
            setIsCalculating(false);
          }
        }, 0);
      }
      
      return newInputs;
    });
  }, []);

  // Formatted output helpers using utility functions
  const formatCurrencyValue = useCallback((amount) => {
    return formatCurrency(amount, language, t('currency'));
  }, [language, t]);

  const formatPercentValue = useCallback((value) => {
    return formatPercent(value);
  }, []);

  const formatNumberValue = useCallback((value, decimals = 0) => {
    return formatNumber(value, decimals, language);
  }, [language]);

  // Reset simulation to default values
  const resetSimulation = useCallback(() => {
    setInputs(initialInputs);
    
    try {
      const initialResults = calculateResults(initialInputs);
      setResults(initialResults);
      setIsValid(true);
    } catch (error) {
      console.error('Error resetting simulation:', error);
      setResults(null);
      setIsValid(false);
    }
  }, [initialInputs]);

  // Return state and methods
  return {
    inputs,
    results,
    isValid,
    isCalculating,
    handleInputChange,
    formatCurrencyValue,
    formatPercentValue,
    formatNumberValue,
    resetSimulation
  };
};

export default useSimulation;
