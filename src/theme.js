import { createTheme } from '@mui/material/styles';

// A modern, clean, and elegant theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // A vibrant blue
      light: '#66B2FF',
      dark: '#0059B2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d', // A neutral secondary color
      light: '#a1a7ac',
      dark: '#495057',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc3545', // A standard red for errors
      light: '#e4606d',
      dark: '#b02a37',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffc107', // A warm orange for warnings
      light: '#ffcd3c',
      dark: '#b28704',
      contrastText: '#000000',
    },
    info: {
      main: '#17a2b8', // A cool teal for info
      light: '#45b5c9',
      dark: '#107180',
      contrastText: '#ffffff',
    },
    success: {
      main: '#28a745', // A vibrant green for success
      light: '#53b86a',
      dark: '#1c7430',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa', // A very light grey for the background
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      disabled: '#adb5bd',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.5px',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
});

export default theme;