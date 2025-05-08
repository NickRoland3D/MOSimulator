import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import AppContent from './AppContent';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;