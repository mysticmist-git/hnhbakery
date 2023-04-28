import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light',
    // primary: {},
    secondary: {
      light: '#B10000',
      main: '#810000',
      dark: '#470000',
    },
    // error: {},
    // warning: {},
    // info: {},
    // success: {},
    common: {
      black: '#000000',
      light: '#333',
      veryLight: '#555',
      white: '#ffffff',
      gray: '#808080',
    },
    // text: {},
    // text: {},
    // action: {},
    // background: {},
  },
  typography: {
    fontSize: 14,
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.5rem',
    },
    h3: {
      fontSize: '2rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.25rem',
    },
    h6: {
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
});

export default theme;
