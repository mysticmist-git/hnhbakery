import { CheckCircleRounded, CheckRounded } from '@mui/icons-material';
import { Box, BoxProps, IconButton } from '@mui/material';
import React from 'react';

export function CardItem({
  src,
  check = false,
  aspectRatio,
}: {
  src: string;
  check?: boolean;
  aspectRatio?: string;
}) {
  return (
    <Box
      component={'div'}
      sx={{
        width: '100%',
        aspectRatio: !aspectRatio ? '1/1' : aspectRatio,
        borderRadius: '16px',
        border: 4,
        boxShadow: check ? 3 : 0,
        borderColor: check ? 'secondary.main' : 'white',
        overflow: 'hidden',
      }}
    >
      <Box
        component={'img'}
        src={src}
        sx={{
          objectFit: 'cover',
          objectPosition: 'center',

          width: '100%',
          height: '100%',
        }}
      />

      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          color: 'white',
          bgcolor: 'secondary.main',
          opacity: check ? 1 : 0,
        }}
      >
        <CheckRounded color="inherit" sx={{ fontSize: 'inherit' }} />
      </IconButton>
    </Box>
  );
}
