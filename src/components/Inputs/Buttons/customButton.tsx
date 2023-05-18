import { Button, useTheme } from '@mui/material';
import React from 'react';

export default function CustomButton(props: any) {
  const theme = useTheme();
  return (
    <Button
      style={{
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        transition: 'opacity 0.2s',
      }}
      py={props.py ? props.py : 1.5}
      variant="contained"
      {...props}
      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <props.children />
    </Button>
  );
}
