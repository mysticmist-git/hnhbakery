import React, { memo } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/system';
import banh1 from '../assets/Carousel/3.jpg';
import { SolidUpWhite } from './Decorate/DecorateDivider';
import TopSlideInDiv_Loof from './Animation/Loof/TopSlideInDiv';
import TopSlideInDiv_Appear from './Animation/Appear/TopSlideInDiv';

const ImageBackground = (props: any) => {
  const height = props.height ?? '340px';
  const minHeight = props.minHeight ?? '0px';
  const image = props.image ?? banh1.src;
  const theme = useTheme();
  return (
    <TopSlideInDiv_Appear>
      <TopSlideInDiv_Loof>
        <Box
          sx={{
            width: '100%',
            minHeight: minHeight,
            height: height,
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
            {props.children}

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
                height: '48px',
                width: '100%',
                overflow: 'visible',
                position: 'relative',
                background: `linear-gradient(to bottom, ${alpha(
                  theme.palette.common.white,
                  1
                )}, ${alpha(theme.palette.primary.main, 1)})`,
              }}
            ></Box>
          </Box>
        </Box>
      </TopSlideInDiv_Loof>
    </TopSlideInDiv_Appear>
  );
};

export default memo(ImageBackground);
