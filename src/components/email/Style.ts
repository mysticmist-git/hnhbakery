import { CSSProperties } from 'react';

// Text
const defaultText: CSSProperties = {
  color: '#000000',
  fontFamily: 'Roboto',
  fontSize: '16px',
  lineHeight: '1.75',
};

export const body1: CSSProperties = {
  ...defaultText,
  fontWeight: '400',
};

export const alignRight: CSSProperties = {
  textAlign: 'right',
};

export const head1: CSSProperties = {
  ...defaultText,
  fontWeight: '700',
};

// Color
export const primaryColor = '#810000';

// Component
export const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

export const container = {
  margin: '0 auto',
  padding: '20px 0 48px 0',
  width: '800px',
};

export const reportLink = {
  fontSize: '14px',
  color: '#9ca299',
  textDecoration: 'underline',
};

export const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

export const footer = {
  color: '#9ca299',
  fontSize: '14px',
  marginBottom: '10px',
};
