import React from 'react';
import { Card, CardContent, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SectionHeader from './SectionHeader';
import StepperInput from './StepperInput';
import { PriceIcon } from './Icons';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * PriceParametersCard Component
 * Card for material, labor, and ink price inputs
 */
const PriceParametersCard = ({ 
  inputs, 
  errors, 
  onInputChange,
  onInputFocus,
  onInputBlur
}) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Determine currency symbol placement based on language
  const currencySymbol = t('currency');
  
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
          icon={<PriceIcon />} 
          title={t('priceParameters')}
          isMobile={isSmallMobile} 
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StepperInput
              label={language === 'ja' ? `${t('materialCostPerUnit')} (${t('currency')})` : `${t('materialCostPerUnit')} (${t('currency')})`}
              value={inputs.materialCostPerUnit}
              name="materialCostPerUnit"
              min={0}
              step={10}
              error={errors.materialCostPerUnit}
              language={language}
              startAdornment={language === 'ja' ? null : currencySymbol}
              endAdornment={language === 'ja' ? currencySymbol : null}
              onValueChange={onInputChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          </Grid>
          <Grid item xs={12}>
            <StepperInput
              label={language === 'ja' ? `${t('laborCostPerHour')} (${t('currency')})` : `${t('laborCostPerHour')} (${t('currency')})`}
              value={inputs.laborCostPerHour}
              name="laborCostPerHour"
              min={0}
              step={100}
              error={errors.laborCostPerHour}
              language={language}
              startAdornment={language === 'ja' ? null : currencySymbol}
              endAdornment={language === 'ja' ? currencySymbol : null}
              onValueChange={onInputChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          </Grid>
          <Grid item xs={12}>
            <StepperInput
              label={language === 'ja' ? `${t('inkPrice')} (${t('currency')}/${t('cc')})` : `${t('inkPrice')} (${t('currency')}/${t('cc')})`}
              value={inputs.inkPricePerCC}
              name="inkPricePerCC"
              min={0}
              step={1}
              error={errors.inkPricePerCC}
              language={language}
              startAdornment={language === 'ja' ? null : currencySymbol}
              endAdornment={language === 'ja' ? currencySymbol : null}
              onValueChange={onInputChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PriceParametersCard;