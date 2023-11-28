import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

function ScreenShotLoading({ progress }: { progress: number }) {
  return (
    <Box
      component={'div'}
      sx={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
      }}
    >
      <Box
        component={'div'}
        sx={{ position: 'relative', display: 'inline-flex' }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          sx={{
            color: 'white',
          }}
        />
        <Box
          component={'div'}
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{
              color: 'white',
            }}
          >{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ScreenShotLoading;
