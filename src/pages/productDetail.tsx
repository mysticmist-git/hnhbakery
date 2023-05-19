import ImageBackground from '@/components/imageBackground';
import { Grid, Typography, useTheme, alpha } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import banh1 from '../assets/Carousel/3.jpg';
import formatPrice from '@/utilities/formatCurrency';
import Carousel from 'react-material-ui-carousel';
import Link from 'next/link';
import Image from 'next/image';

const product = {
  name: 'Bánh Croissant',
  images: [
    {
      src: banh1.src,
      href: '#',
      alt: '',
    },
    {
      src: banh1.src,
      href: '#',
      alt: '',
    },
    {
      src: banh1.src,
      href: '#',
      alt: '',
    },
  ],
  href: '#',
  items: [
    {
      heading: 'Giá tiền:',
      content: 150000,
    },
    {
      heading: 'Loại:',
      content: 'Bánh mặn',
    },
    {
      heading: 'Trạng thái:',
      content: 'Còn hàng',
      color: 'success',
    },
    {
      heading: 'Mô tả:',
      content:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
  ],
};

function ProductDetailInfo(props: any) {
  const theme = useTheme();
  return (
    <Grid
      container
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      spacing={4}
    >
      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'100%'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                position: 'relative',
                border: 3,
                borderColor: theme.palette.secondary.main,
                overflow: 'hidden',
                borderRadius: '8px',
              }}
            >
              <Carousel animation="slide" duration={1000} indicators={false}>
                {product.images.map((image, i) => (
                  <Box
                    key={i}
                    sx={{
                      height: '284px',
                      width: '100%',
                    }}
                  >
                    <Link
                      href={image.href}
                      style={{ textDecoration: 'none', overflow: 'hidden' }}
                    >
                      <Box
                        component={Image}
                        fill={true}
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        sx={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.5s ease-in-out',
                          ':hover': {
                            transform: 'scale(1.3) rotate(5deg)',
                          },
                        }}
                      />
                    </Link>
                  </Box>
                ))}
              </Carousel>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 'auto',
                  zIndex: 10,
                }}
              >
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'flex-end'}
                  alignItems={'center'}
                  spacing={1}
                  sx={{
                    pr: 1,
                    pb: 1,
                    background: `linear-gradient(to bottom, ${alpha(
                      theme.palette.common.white,
                      0,
                    )}, ${alpha(theme.palette.common.white, 0.5)})`,
                  }}
                >
                  {product.images.map((image, i) => (
                    <Grid key={i} item>
                      <Box
                        sx={{
                          height: '64px',
                          width: '64px',
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '8px',
                          transition: 'transform 0.2s',
                          ':hover': {
                            transform: 'scale(1.2)',
                          },
                        }}
                      >
                        <Link
                          href={image.href}
                          style={{ textDecoration: 'none' }}
                        >
                          <Image
                            fill={true}
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            style={{
                              objectFit: 'cover',
                              cursor: 'pointer',
                            }}
                          />
                        </Link>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {/* <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              spacing={2}
            >
              {product.images.map((image, i) => (
                <Grid key={i} item>
                  <Box
                    sx={{
                      height: '64px',
                      width: '64px',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      border: 3,
                      borderColor: theme.palette.secondary.main,
                      transition: 'transform 0.2s',
                      ':hover': {
                        transform: 'scale(1.2)',
                      },
                    }}
                  >
                    <Link href={image.href} style={{ textDecoration: 'none' }}>
                      <Image
                        fill={true}
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        style={{
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                      />
                    </Link>
                  </Box>
                </Grid>
              ))}
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography variant="h1" color={theme.palette.secondary.main}>
              {product.name}
            </Typography>
          </Grid>
          {product.items.map((item: any, i: number) => (
            <Grid key={i} item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
                sx={{
                  borderBottom: false ? '1.5px solid' : 0,
                  borderColor: false
                    ? theme.palette.text.secondary
                    : 'transparent',
                  my: false ? 1.5 : 0,
                }}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'normal',
                    }}
                    color={theme.palette.common.black}
                  >
                    {item.heading}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    variant="body1"
                    color={
                      item.color == 'success'
                        ? theme.palette.success.main
                        : theme.palette.common.black
                    }
                  >
                    {typeof item.content === 'number'
                      ? formatPrice(item.content)
                      : item.content}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default function productDetail() {
  const theme = useTheme();
  return (
    <>
      <Box>
        <ImageBackground
          children={() => (
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
              sx={{ px: 6 }}
            >
              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  spacing={2}
                >
                  <Grid item xs={12}>
                    <Link href="#" style={{ textDecoration: 'none' }}>
                      <Typography
                        align="center"
                        variant="h3"
                        color={theme.palette.primary.main}
                        sx={{
                          '&:hover': {
                            color: theme.palette.common.white,
                          },
                        }}
                      >
                        Sản phẩm
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
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
                        Bánh Croissant
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        />

        <Box sx={{ px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={8}
            sx={{ pt: 8 }}
          >
            <Grid item xs={12}>
              <ProductDetailInfo />
            </Grid>

            <Grid item xs={12}></Grid>

            <Grid item xs={12}></Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
