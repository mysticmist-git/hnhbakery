import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F2F3F5',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          backgroundColor: '#810000',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#F2F3F5',
      dark: '#919193',
      light: '#D9DADC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#810000',
      dark: '#470000',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
    },
    error: {
      main: red.A400,
    },
    success: {
      main: '#00A803',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
      // light: '#333',
      // veryLight: '#555',
      // gray: '#808080',
      // darkGray: '#555',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    h1: {
      fontSize: '64px',
      fontWeight: '500',
      fontFamily: 'Great Vibes',
    },
    h2: {
      fontSize: '48px',
      fontWeight: '500',
      fontFamily: 'Great Vibes',
    },
    h3: {
      fontSize: '28px',
      fontWeight: '500',
      fontFamily: 'Great Vibes',
    },
    body1: {
      fontSize: '20px',
      fontWeight: '700',
      textTransform: 'none',
    },
    body2: {
      fontSize: '16px',
      fontWeight: '500',
      textTransform: 'none',
    },
    button: {
      fontSize: '16px',
      fontWeight: '700',
      textTransform: 'none',
      display: 'block',
    },
  },
});

export default theme;
