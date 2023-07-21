import bg9 from '@/assets/Decorate/bg9.png';
import logo from '@/assets/Logo.png';
import BottomSlideInDiv from '@/components/animations/appear/BottomSlideInDiv/BottomSlideInDiv';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import React, { memo } from 'react';

const Footer = () => {
  //#region Style
  const theme = useTheme();
  //#endregion

  const List = [
    {
      name: 'Hỗ trợ',
      children: [
        {
          name: 'Tìm kiếm',
          href: '',
        },
        {
          name: 'Giới thiệu',
          href: '',
        },
        {
          name: 'Chính sách đổi trả',
          href: '',
        },
        {
          name: 'Chính sách bảo mật',
          href: '',
        },
        {
          name: 'Điều khoản dịch vụ',
          href: '',
        },
      ],
    },
    {
      name: 'Giờ mở cửa',
      children: [
        {
          name: 'T2 - CN: 7h00 - 22h00',
          href: '',
        },
        {
          name: 'Văn phòng: 8h00 - 18h00',
          href: '',
        },
      ],
    },
    {
      name: 'Fanpage Bakery',
      children: [
        {
          name: 'Facebook',
          href: '',
        },
        {
          name: 'Youtube',
          href: '',
        },
        {
          name: 'Instagram',
          href: '',
        },
      ],
    },
  ];

  return (
    <>
      <BottomSlideInDiv>
        <Box
          sx={{
            width: '100%',
            mt: '50px',
            height: 'auto',
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <Box
            sx={{
              height: '80px',
              backgroundImage: `url(${bg9.src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              position: 'absolute',
              top: -79,
              left: 0,
              right: 0,
            }}
          ></Box>
          <Box
            sx={{
              bgcolor: theme.palette.secondary.dark,
              height: 'auto',
              width: '100%',
            }}
          >
            <Grid
              sx={{ p: 6, pt: 3, height: 'auto', width: '100%' }}
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'start'}
              spacing={2}
            >
              <Grid item xs={6} md={3}>
                <Box
                  sx={{ width: 'auto', height: '200px' }}
                  component={'img'}
                  alt=""
                  src={logo.src}
                  loading="lazy"
                ></Box>
              </Grid>
              <Grid item xs={6} md={9}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'flex-start'}
                  alignItems={'start'}
                  spacing={4}
                >
                  {List.map((listItem, i) => (
                    <Grid key={i} item xs={12} md={6} lg={4}>
                      <Grid
                        container
                        direction={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'start'}
                        spacing={2}
                      >
                        <Grid item>
                          <Typography
                            variant="body1"
                            sx={{
                              color: (theme) => theme.palette.common.white,
                            }}
                          >
                            {listItem.name}
                          </Typography>
                        </Grid>
                        <Grid item>
                          {listItem.children.map((child, i) => (
                            <Link
                              key={i}
                              href={child.href}
                              style={{ textDecoration: 'none' }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: (theme) => theme.palette.common.white,
                                }}
                              >
                                {child.name}
                              </Typography>
                            </Link>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </BottomSlideInDiv>
    </>
  );
};

export default memo(Footer);
