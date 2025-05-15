import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * SectionHeader Component
 * Reusable header for form sections with icon and title
 */
const SectionHeader = ({ icon, title, isMobile = false }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
    <Box sx={{
      mr: 1.5,
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </Box>
    <Typography 
      variant="h6" 
      fontWeight="600" 
      color="text.primary" 
      sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}
    >
      {title}
    </Typography>
  </Box>
);

export default SectionHeader;
