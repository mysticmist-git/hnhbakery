import React, { memo } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/system';
import banh1 from '../assets/Carousel/3.jpg';
import { SolidUpWhite } from './Decorate/DecorateDivider';

const ImageBackground = (props: any) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        height: '340px',
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
          position: 'relative',
          backdropFilter: 'blur(1px)',
        }}
      >
        <props.children />

        <SolidUpWhite
          sx={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
        <Box
          sx={{
            height: '30px',
            width: '100%',
            overflow: 'visible',
            background: `linear-gradient(to bottom, ${alpha(
              theme.palette.common.white,
              1,
            )}, ${alpha(theme.palette.primary.main, 1)})`,
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default memo(ImageBackground);
