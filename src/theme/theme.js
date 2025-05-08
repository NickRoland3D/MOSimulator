import { createTheme } from '@mui/material/styles';

// Roland DG brand-inspired color palette with enhanced CMYK color accents
const colors = {
  primary: {
    main: '#0058A3',      // Primary blue
    light: '#4B8BCC',
    dark: '#003D74',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F05A28',      // Roland orange accent
    light: '#FF7C53',
    dark: '#D13D00',
    contrastText: '#FFFFFF',
  },
  // CMYK accent colors - refined for the final UI
  cmyk: {
    cyan: '#00AEEF',      // C - Used for Payback tab and accents
    magenta: '#EC008C',   // M - Used for Cost tab and accents
    yellow: '#FFF200',    // Y - Used for Profit tab and accents
    keyBlack: '#000000',  // K - Used for text and borders
    // Lighter versions for subtle accents
    cyanLight: 'rgba(0, 174, 239, 0.2)',
    magentaLight: 'rgba(236, 0, 140, 0.2)',
    yellowLight: 'rgba(255, 242, 0, 0.2)',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    resultGood: '#E6F4EA',     // Light green for good results
    resultAverage: '#FCF8E3',  // Light yellow for average results
    resultWarning: '#FEF2F2',  // Light red for warning results
    resultNoProfit: '#F1F3F5', // Light gray for no profit
    activeTab: '#F2F7FC',      // Neutral light blue for active tab
  },
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
  },
  divider: '#E9ECEF',
};

// Custom typography settings
const typography = {
  fontFamily: [
    'Segoe UI',
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontWeight: 600,
    fontSize: '2.5rem',
  },
  h2: {
    fontWeight: 600,
    fontSize: '2rem',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
  },
  body2: {
    fontSize: '0.875rem',
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
  caption: {
    fontSize: '0.75rem',
  },
};

// Custom component overrides with enhanced CMYK accents
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
      containedPrimary: {
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          transition: 'border-color 0.3s, box-shadow 0.3s',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.cmyk.cyan,
            borderWidth: 2,
          },
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        '&.Mui-focused': {
          boxShadow: `0 0 0 3px ${colors.cmyk.cyanLight}`, // Cyan shadow when focused
        },
      },
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: {
        height: 8,
        padding: '15px 0',
      },
      thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        '&:focus, &:hover, &.Mui-active': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        },
      },
      track: {
        height: 8,
        borderRadius: 4,
      },
      rail: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
      },
      valueLabel: {
        backgroundColor: colors.cmyk.cyan,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'visible',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        margin: '16px 0',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        minWidth: 'auto',
        fontWeight: 600,
        padding: '12px 24px',
        transition: 'all 0.3s ease-in-out',
        '&.Mui-selected': {
          backgroundColor: colors.background.activeTab,
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: 'rgba(33, 37, 41, 0.95)',
        padding: '8px 12px',
        fontSize: '0.75rem',
        maxWidth: 300,
        borderRadius: 6,
      },
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: {
        borderRadius: 8,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 600,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      },
    },
  },
};

// Create and export the theme
const theme = createTheme({
  palette: { 
    ...colors,
    // Keep the primary/secondary intact
    primary: colors.primary,
    secondary: colors.secondary,
  },
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 16px 24px rgba(0, 0, 0, 0.12)',
    ...Array(20).fill('none'),
  ],
});

export default theme;
