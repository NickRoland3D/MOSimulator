import React from 'react';
import { Card, CardContent, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SectionHeader from './SectionHeader';
import DimensionInput from './DimensionInput';
import { DimensionsIcon } from './Icons';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * ProductDimensionsCard Component
 * Card displaying dimension inputs for product short and long edges
 */
const ProductDimensionsCard = ({ 
  inputs, 
  errors, 
  onInputChange 
}) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card
      sx={{
        mb: 3,
        overflow: 'visible',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <CardContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
        <SectionHeader 
          icon={<DimensionsIcon />} 
          title={t('productDimensions')}
          isMobile={isMobile} 
        />
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item xs={12} sm={6}>
            <DimensionInput
              label={t('shortEdge')}
              value={inputs.shortEdge}
              name="shortEdge"
              min={10}
              max={305}
              helperText={`${t('range')}: 10-305mm`}
              error={errors.shortEdge}
              onValueChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DimensionInput
              label={t('longEdge')}
              value={inputs.longEdge}
              name="longEdge"
              min={10}
              max={458}
              helperText={`${t('range')}: 10-458mm`}
              error={errors.longEdge}
              onValueChange={onInputChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductDimensionsCard;
