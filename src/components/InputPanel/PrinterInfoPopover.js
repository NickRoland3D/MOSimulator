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

/**
 * PrinterInfoPopover Component
 * Displays printer specifications in a popover when info icon is clicked
 */
const PrinterInfoPopover = ({ open, anchorEl, handleClose }) => {
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
        MO-180 Printer Specifications
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Base Parameters
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">
            <strong>Initial Investment:</strong> JPY 3,780,000
          </Typography>
          <Typography variant="body2">
            <strong>Print Speed:</strong> 6 prints/hour
          </Typography>
          <Typography variant="body2">
            <strong>Printable Area:</strong> 305mm × 458mm
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>
        Ink Usage Reference Data
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Short Edge (mm)</TableCell>
              <TableCell>White (cc)</TableCell>
              <TableCell>CMYK (cc)</TableCell>
              <TableCell>Primer (cc)</TableCell>
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
        Ink usage is calculated using a scaling formula: scale = (Short_Edge / 65)²
      </Typography>
    </Popover>
  );
};

export default PrinterInfoPopover;
