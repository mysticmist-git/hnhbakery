import ImageBackground from '@/components/Imagebackground';
import { ContactForm, ContactWrapper } from '@/components/contact';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import React, { memo, useMemo } from 'react';

const Contact = () => {
  const wrapperTitle = useMemo(
    () =>
      'Cảm ơn bạn đã ghé thăm trang web của tiệm bánh và sử dụng form đóng góp. Chúng mình rất trân trọng ý kiến đóng góp của bạn! Sớm thôi chúng mình sẽ liên hệ với bạn ngay. Xin cảm ơn!',
    []
  );

  const theme = useTheme();

  return (
    <Box>
      <Box>
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
                  align="center"
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
            <Grid item xs={12}>
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
