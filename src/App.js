import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { lazyLoad } from './utils/code-splitting';
import './App.css';

// Lazy load AppContent for better initial loading performance
const AppContent = lazyLoad(() => import('./AppContent'));

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
