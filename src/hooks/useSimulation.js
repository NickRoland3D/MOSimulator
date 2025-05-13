import { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { calculateResults } from '../services/calculationService';

/**
 * Custom hook for managing simulation state and calculations
 * This hook separates business logic from UI components
 */
const useSimulation = (initialInputs) => {
  const [inputs, setInputs] = useState(initialInputs);
  const [results, setResults] = useState(calculateResults(initialInputs));
  const { t } = useLanguage();

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    setInputs(prevInputs => {
      const newInputs = { ...prevInputs, [name]: value };
      // Recalculate results when inputs change
      const newResults = calculateResults(newInputs);
      setResults(newResults);
      return newInputs;
    });
  }, []);

  // Format currency for display - ensures 円 always appears after the number in Japanese
  const formatCurrency = useCallback((amount, language) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    
    // Place the currency symbol after the number for Japanese
    if (language === 'ja') {
      return `${Math.round(amount).toLocaleString('ja-JP')}${t('currency')}`;
    }
    // Default format for other languages
    return `${t('currency')} ${Math.round(amount).toLocaleString('en-US')}`;
  }, [t]);

  // Format percentage for display
  const formatPercent = useCallback((value) => {
    return `${value.toFixed(2)}%`;
  }, []);

  // Reset simulation to default values
  const resetSimulation = useCallback(() => {
    setInputs(initialInputs);
    setResults(calculateResults(initialInputs));
  }, [initialInputs]);

  return {
    inputs,
    results,
    handleInputChange,
    formatCurrency,
    formatPercent,
    resetSimulation
  };
};

export default useSimulation;
