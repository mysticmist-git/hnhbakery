import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/system';
import banh1 from '../assets/Carousel/3.jpg';

export default function ImageBackground(props: any) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        height: '320px',
        backgroundImage: `url(${banh1.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: alpha(theme.palette.common.black, 0.6),
        }}
      >
        <props.children />
      </Box>
    </Box>
  );
}
