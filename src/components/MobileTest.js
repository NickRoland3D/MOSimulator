import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Mobile Test Component
 * Displays a clear message to verify mobile styling is working
 */
const MobileTest = () => {
  return (
    <Box 
      sx={{ 
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        backgroundColor: 'red',
        color: 'white',
        padding: 2,
        borderRadius: 2,
        maxWidth: '80%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Mobile View Active
      </Typography>
      <Typography variant="body2" gutterBottom>
        VERSION 5: Added sample image. The popup now includes the Lisa sample image. Last updated: {new Date().toLocaleTimeString()}
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        fullWidth
        sx={{ mt: 1, backgroundColor: 'white', color: 'red' }}
        onClick={() => alert("V5 active with sample image!")}
      >
        Test Button
      </Button>
    </Box>
  );
};

export default MobileTest;