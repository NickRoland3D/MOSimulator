import React from 'react';
import { 
  Popover, 
  Typography, 
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';

/**
 * PrinterInfoPopover Component
 * Displays printer specifications in a popover when info icon is clicked
 */
const PrinterInfoPopover = ({ open, anchorEl, handleClose }) => {
  const { t, language } = useLanguage(); // Get translation function and current language
  
  // Ink usage reference data from PRD
  const inkUsageData = [
    { shortEdge: 65, white: 0.04, cmyk: 0.04, primer: 0.01, area: 4225 },
    { shortEdge: 90, white: 0.09, cmyk: 0.06, primer: 0.02, area: 8100 },
    { shortEdge: 200, white: 0.42, cmyk: 0.34, primer: 0.09, area: 40000 }
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { maxWidth: 400, p: 3 }
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t('printerSpecifications')}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('baseParameters')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">
            <strong>{t('initialInvestment')}:</strong> {language === 'ja' ? `3,780,000${t('currency')}` : `${t('currency')} 3,780,000`}
          </Typography>
          <Typography variant="body2">
            <strong>{t('printSpeed')}:</strong> 6 {t('printsPerHour')}
          </Typography>
          <Typography variant="body2">
            <strong>{t('printableArea')}:</strong> 305mm × 458mm
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>
        {t('inkUsageReferenceData')}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('shortEdgeHeader')}</TableCell>
              <TableCell>{t('whiteInk')}</TableCell>
              <TableCell>{t('cmykInk')}</TableCell>
              <TableCell>{t('primerInk')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inkUsageData.map((row) => (
              <TableRow key={row.shortEdge}>
                <TableCell>{row.shortEdge}</TableCell>
                <TableCell>{row.white}</TableCell>
                <TableCell>{row.cmyk}</TableCell>
                <TableCell>{row.primer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="caption" color="text.secondary">
        {t('inkUsageFormula')}
      </Typography>
    </Popover>
  );
};

export default PrinterInfoPopover;
