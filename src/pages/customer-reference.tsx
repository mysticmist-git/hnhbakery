import { Box, Grid, alpha, useTheme } from '@mui/material';
import bg2 from '@/assets/Decorate/bg2.png';
import logo from '@/assets/Logo.png';
import React from 'react';
import Image from 'next/image';
import { ContentCustomerReference } from '../components/customerReference/ContentCustomerReference';

function customerReference() {
  const theme = useTheme();
  return (
    <Box
      component={'div'}
      sx={{
        position: 'fixed',
        width: '100%',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'primary.main',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        overflowY: 'auto',
        p: 8,
        px: 16,
      }}
    >
      <Box
        component={'div'}
        sx={{
          width: '100%',
          height: 'fit-content',
          backgroundImage: `url(${bg2.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 10px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Background */}
        <Box
          component={'div'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `rgba(255,255,255,0.7)`,
            backdropFilter: 'blur(1px)',
            zIndex: 1,
          }}
        />

        {/* logo */}
        <Box
          component={'div'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 44,
            width: 58,
            height: 83,
            zIndex: 3,
          }}
        >
          <Box
            fill={true}
            sx={{
              objectFit: 'cover',
            }}
            component={Image}
            loading="lazy"
            alt=""
            src={logo.src}
          />
        </Box>

        {/* Content */}
        <ContentCustomerReference />
      </Box>
    </Box>
  );
}

export default customerReference;
