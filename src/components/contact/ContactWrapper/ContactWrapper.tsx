import contactImage from '@/assets/contact-img.jpg';
import { Box, Grid, useTheme } from '@mui/material';
import Image from 'next/image';
import { memo } from 'react';

const ContactWrapper = ({ children = '' }: { children?: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
      component={'div'}
      sx={{
        mt: 8,
        bgcolor: theme.palette.common.white,
        borderRadius: '16px',
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <Grid container justifyContent={'center'} alignItems={'center'}>
        <Grid
          item
          xs={0}
          md={6}
          lg={6}
          alignSelf={'stretch'}
          sx={{ position: 'relative', display: { xs: 'none', md: 'block' } }}
        >
          <Box
            fill={true}
            component={Image}
            src={contactImage.src}
            alt=""
            sx={{
              objectFit: 'contain',
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Box
            component={'div'}
            sx={{
              p: 4,
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(ContactWrapper);
