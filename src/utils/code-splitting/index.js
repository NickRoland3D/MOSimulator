import React, { lazy, Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loading component to display while lazy-loaded components are being loaded
 * @param {string} message - Optional message to display during loading
 * @returns {JSX.Element} - Loading component
 */
export const Loading = ({ message = 'Loading...' }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      p: 4
    }}
  >
    <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

/**
 * Lazy loads a component with a loading fallback
 * @param {Function} importFunc - Import function to lazy load the component
 * @param {Object} options - Options for the lazy loading
 * @returns {JSX.Element} - Lazy-loaded component with suspense fallback
 */
export const lazyLoad = (importFunc, options = {}) => {
  const LazyComponent = lazy(importFunc);
  const { fallback = <Loading />, ...suspenseProps } = options;
  
  return (props) => (
    <Suspense fallback={fallback} {...suspenseProps}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default lazyLoad;
