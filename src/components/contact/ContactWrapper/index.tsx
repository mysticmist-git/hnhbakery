import { Box, useTheme, alpha, Grid } from '@mui/material';
import { memo } from 'react';
import contactImage from '@/assets/contact-img.jpg';
import Image from 'next/image';

const ContactWrapper = ({ children = '' }: { children?: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
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
