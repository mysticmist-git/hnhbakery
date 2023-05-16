import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    gray: string;
    darkGray: string;
    veryDarkGray: string;
    light: string;
    veryLight: string;
  }

  // interface HoverColor {
  //   gray: string;
  // }

  // interface PaletteOptions {
  //   hover?: Partial<HoverColor>;
  // }
}
