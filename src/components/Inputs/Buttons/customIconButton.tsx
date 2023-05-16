import { IconButton, useTheme } from '@mui/material';
import React from 'react';

export default function CustomIconButton(props: any) {
  const theme = useTheme();
  return (
    <IconButton
      {...props}
      style={{
        transition: 'opacity 0.2s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <props.children />
    </IconButton>
  );
}
