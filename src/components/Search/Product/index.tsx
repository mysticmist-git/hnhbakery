import { CustomButton } from '@/components/buttons';
import { formatPrice } from '@/lib/utils';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React, { memo } from 'react';

const Product = memo((props: any) => {
  const theme = useTheme();
  const item = props.item;
  return (
    <>
      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
          height={'auto'}
        >
          <Grid item xs={5} alignSelf={'stretch'}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: '16px',
                position: 'relative',
              }}
            >
              <Box
                fill={true}
                component={Image}
                loading="lazy"
                alt=""
                src={item.productDetail.image}
                sx={{
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease-in-out',
                  ':hover': {
                    transform: 'scale(1.3) rotate(5deg)',
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Grid
              container
              justifyContent={'center'}
              alignItems={'center'}
              spacing={1}
              py={2}
            >
              <Grid item xs={12}>
                <Typography variant="h3" color={theme.palette.secondary.main}>
                  {item.productDetail.name}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={theme.palette.common.black}
                    >
                      Giá tiền:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="button"
                      color={theme.palette.common.black}
                    >
                      {formatPrice(item.productDetail.price)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={theme.palette.common.black}
                    >
                      Loại:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="button"
                      color={theme.palette.common.black}
                    >
                      {item.productDetail.type}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={theme.palette.common.black}
                    >
                      Trạng thái:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="button"
                      color={
                        item.productDetail.state == 1
                          ? theme.palette.success.main
                          : item.productDetail.state == 0
                          ? theme.palette.error.main
                          : theme.palette.common.black
                      }
                    >
                      {item.productDetail.state == 1
                        ? 'Còn hàng'
                        : item.productDetail.state == 0
                        ? 'Hết hàng'
                        : 'Ngưng bán'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={theme.palette.common.black}
                    >
                      Mô tả:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="button"
                      color={theme.palette.common.black}
                    >
                      {item.productDetail.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <CustomButton>
                  <Typography
                    variant="button"
                    color={theme.palette.common.white}
                  >
                    Xem chi tiết
                  </Typography>
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
});

export default Product;
