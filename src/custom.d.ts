import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    gray: string;
    light: string;
    veryLight: string;
  }
}

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
