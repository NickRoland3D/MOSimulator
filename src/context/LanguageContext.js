import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../utils/translations';

// Create the context
const LanguageContext = createContext();

// Custom hook for accessing the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Try to get the language from localStorage or default to Japanese
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'ja';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Toggle between English and Japanese
  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'ja' : 'en'));
  };

  // Get translation string
  const t = (key) => {
    if (!translations[language] || !translations[language][key]) {
      // Fallback to English if translation is missing
      return translations.en[key] || key;
    }
    return translations[language][key];
  };

  // Get the current language code ('en' or 'ja')
  const currentLanguage = language;

  // Context value
  const value = {
    language: currentLanguage,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;