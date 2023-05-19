import React, { memo } from 'react';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import logo from '../assets/Logo.png';

const Footer = () => {
  //#region Style
  const theme = useTheme();
  const styles = {
    text: {
      white: {
        color: theme.palette.common.white,
      },
      grey: {
        color: theme.palette.text.secondary,
      },
      black: {
        color: theme.palette.common.black,
      },
      primary: {
        color: theme.palette.secondary.main,
      },
    },
  };
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
      <Box
        sx={{
          bgcolor: theme.palette.secondary.dark,
          height: 'auto',
          width: '100%',
        }}
      >
        <Grid
          sx={{ p: 6, height: 'auto', width: '100%' }}
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
    </>
  );
};

export default memo(Footer);
