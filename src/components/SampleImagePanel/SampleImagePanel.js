import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
// Import the image correctly
import LisaImage from '../../assets/images/lisa.png';

/**
 * SampleImagePanel Component
 * Displays sample image information for printing examples
 */
const SampleImagePanel = () => {
  const { language } = useLanguage();

  const captionText = language === 'ja' 
    ? 'このデータを使用して印刷しています'
    : 'This data is being used for printing';

  const titleText = language === 'ja' 
    ? 'この画像を印刷した場合'
    : 'When this image is printed';

  return (
    <Box>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 600, 
          mb: 1.5,
          color: 'text.primary' 
        }}
      >
        {titleText}
      </Typography>
      
      {/* Use the imported image directly - no src attribute */}
      <Box 
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }
        }}
      >
        <img src={LisaImage} alt="Lisa" />
      </Box>
      
      <Divider sx={{ my: 1.5 }} />
      
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500, 
          color: 'text.secondary',
          textAlign: 'center',
          mt: 1
        }}
      >
        {captionText}
      </Typography>
    </Box>
  );
};

export default SampleImagePanel;
