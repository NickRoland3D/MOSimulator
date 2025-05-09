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
        sx: { 
          width: 'auto', 
          minWidth: 450, 
          maxWidth: 500, 
          p: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, borderBottom: '1px solid rgba(0, 0, 0, 0.1)', pb: 1, mb: 2 }}>
        {t('printerSpecifications')}
      </Typography>
      
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          {t('baseParameters')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 1 }}>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{t('initialInvestment')}:</span> 
            <span style={{ fontWeight: 600 }}>{language === 'ja' ? `3,780,000${t('currency')}` : `${t('currency')} 3,780,000`}</span>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{t('printSpeed')}:</span> 
            <span style={{ fontWeight: 600 }}>6 {t('printsPerHour')}</span>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{t('printableArea')}:</span> 
            <span style={{ fontWeight: 600 }}>305mm × 458mm</span>
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
        {t('inkUsageReferenceData')}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
              <TableCell 
                sx={{ 
                  py: 1, 
                  px: 1.5, 
                  fontWeight: 600, 
                  width: '35%',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}
              >
                {t('shortEdgeHeader')}
              </TableCell>
              <TableCell 
                sx={{ 
                  py: 1, 
                  px: 1.5, 
                  fontWeight: 600, 
                  textAlign: 'center',
                  width: '22%',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}
              >
                {language === 'ja' ? 
                  <span>
                    ホワイト<br />(cc)
                  </span> : 
                  t('whiteInk')
                }
              </TableCell>
              <TableCell 
                sx={{ 
                  py: 1, 
                  px: 1.5, 
                  fontWeight: 600, 
                  textAlign: 'center',
                  width: '22%',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}
              >
                {t('cmykInk')}
              </TableCell>
              <TableCell 
                sx={{ 
                  py: 1, 
                  px: 1.5, 
                  fontWeight: 600, 
                  textAlign: 'center',
                  width: '21%',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}
              >
                {language === 'ja' ? 'プライマー (cc)' : t('primerInk')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inkUsageData.map((row, index) => (
              <TableRow 
                key={row.shortEdge}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: index % 2 === 0 ? 'white' : 'rgba(0, 0, 0, 0.02)'
                }}
              >
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ 
                    py: 0.75, 
                    px: 1.5, 
                    fontWeight: 500,
                    borderBottom: index === inkUsageData.length - 1 ? 0 : '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {row.shortEdge}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    py: 0.75, 
                    px: 1.5,
                    borderBottom: index === inkUsageData.length - 1 ? 0 : '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {row.white}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    py: 0.75, 
                    px: 1.5,
                    borderBottom: index === inkUsageData.length - 1 ? 0 : '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {row.cmyk}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    py: 0.75, 
                    px: 1.5,
                    borderBottom: index === inkUsageData.length - 1 ? 0 : '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {row.primer}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1, py: 1, px: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
        {t('inkUsageFormula')}
      </Typography>
    </Popover>
  );
};

export default PrinterInfoPopover;
