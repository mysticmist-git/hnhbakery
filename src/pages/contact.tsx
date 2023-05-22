import ContactForm from '@/components/Contact/ContactForm';
import ContactWrapper from '@/components/Contact/ContactWrapper';
import { Box, Grid, Link, Typography, alpha, useTheme } from '@mui/material';
import React, { memo, useMemo } from 'react';
import bg2 from '../assets/Decorate/bg2.png';
import ImageBackground from '@/components/imageBackground';

const Contact = () => {
  const wrapperTitle = useMemo(
    () =>
      'Cảm ơn bạn đã ghé thăm trang web của tiệm bánh và sử dụng form đóng góp. Chúng mình rất trân trọng ý kiến đóng góp của bạn! Sớm thôi chúng mình sẽ liên hệ với bạn ngay. Xin cảm ơn!',
    [],
  );
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundImage: `url(${bg2.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.85),
          backdropFilter: 'blur(1px)',
        }}
      >
        <ImageBackground>
          <Grid
            sx={{ px: 6 }}
            height={'100%'}
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12} md={8}>
              <Link href="#" style={{ textDecoration: 'none' }}>
                <Typography
                  align="center"
                  variant="h2"
                  color={theme.palette.primary.main}
                  sx={{
                    '&:hover': {
                      color: theme.palette.common.white,
                    },
                  }}
                >
                  Liên hệ
                </Typography>
                <Typography
                  align="left"
                  variant="body2"
                  color={theme.palette.common.white}
                >
                  {wrapperTitle}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </ImageBackground>

        <Box sx={{ pt: 0, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Grid item xs={12} md={7} lg={6}>
              <ContactWrapper>
                <ContactForm />
              </ContactWrapper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Contact);
