import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';

/**
 * LanguageToggle Component
 * Allows switching between English and Japanese
 */
const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <Tooltip title={language === 'en' ? 'Switch to Japanese' : '英語に切り替え'}>
      <Button
        onClick={toggleLanguage}
        variant="outlined"
        size="small"
        sx={{
          minWidth: 'unset',
          borderRadius: '50%',
          width: 40,
          height: 40,
          p: 0,
          fontWeight: 'bold',
          fontSize: '0.75rem',
          borderColor: 'rgba(0, 0, 0, 0.15)',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
          }
        }}
      >
        {language === 'en' ? 'JP' : 'EN'}
      </Button>
    </Tooltip>
  );
};

export default LanguageToggle;