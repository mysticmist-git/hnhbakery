import { AssembledCartItem, CartItem } from '@/@types/cart';
import BottomSlideInDiv from '@/components/Animation/Appear/BottomSlideInDiv';
import ImageBackground from '@/components/Imagebackground/Imagebackground';
import { CustomButton } from '@/components/buttons';
import { GhiChuCuaBan, TongTienHoaDon } from '@/components/cart';
import ProductTable from '@/components/cart/ProductTable';
import { ROUTES } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import useAssembledCartItems from '@/lib/hooks/useAssembledCartItems';
import useCartItems from '@/lib/hooks/useCartItems';
import useCartNote from '@/lib/hooks/useCartNote';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import { useLocalStorageValue } from '@react-hookz/web';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

function Cart() {
  //#region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region State

  const [cart, setCart] = useCartItems();
  const [assembled, reloadAssembledCart] = useAssembledCartItems();
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (cart && firstTime) {
      reloadAssembledCart(cart);
      setFirstTime(false);
      return;
    }
  }, [cart]);

  const [note, setNote] = useCartNote();

  //#endregion

  //#region Handlers

  function handleAssembledCartItemChange(items: AssembledCartItem[]) {
    reloadAssembledCart(items);
    setCart(items.map((item) => item.getRawItem()));
  }

  function handleContinueToSurf() {
    router.push(ROUTES.PRODUCTS);
  }

  function handlePayment() {
    router.push(ROUTES.PAYMENT);
  }

  function handleSaveCart() {
    setCart(assembled.map((item) => item.getRawItem()));
    handleSnackbarAlert('success', 'Đã cập nhật giỏ hàng');
  }

  //#endregion

  //#region useMemos

  const totalPrice = useMemo(() => {
    const price = assembled.reduce((acc, item) => {
      let price = item.variant?.price ?? 0;
      let discountAmount = 0;

      if (item.discounted) {
        discountAmount = item.discountAmount;
      }

      const itemTotalPrice = (price - discountAmount) * item.quantity;

      return acc + itemTotalPrice;
    }, 0);

    return price;
  }, [assembled]);

  //#endregion

  return (
    <>
      <Box>
        <ImageBackground>
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
                  <Link href="/products" style={{ textDecoration: 'none' }}>
                    <Typography
                      align="center"
                      variant="h3"
                      color={theme.palette.primary.main}
                      sx={{
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sản phẩm
                    </Typography>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    variant="h2"
                    color={theme.palette.primary.main}
                  >
                    Giỏ hàng
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ImageBackground>

        <BottomSlideInDiv>
          <Box sx={{ pt: 4, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'start'}
              spacing={4}
            >
              {(cart?.length ?? 0) <= 0 && (
                <>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 2,
                      }}
                    >
                      <Typography variant="h2">Giỏ hàng trống</Typography>
                    </Box>
                  </Grid>

                  <Grid item>
                    <CustomButton
                      onClick={handleContinueToSurf}
                      sx={{
                        py: 1.5,
                        px: 5,
                        width: 'auto',
                        bgColor: theme.palette.secondary.dark,
                      }}
                    >
                      <Typography
                        variant="button"
                        color={theme.palette.common.white}
                      >
                        Mua hàng ngay!
                      </Typography>
                    </CustomButton>
                  </Grid>
                </>
              )}

              {(cart?.length ?? 0) > 0 && (
                <>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                      }}
                    >
                      <CustomButton onClick={handleSaveCart}>
                        <Typography
                          sx={{ px: 4 }}
                          variant="button"
                          color={theme.palette.common.white}
                        >
                          Lưu giỏ hàng
                        </Typography>
                      </CustomButton>
                    </Box>
                    <ProductTable
                      items={assembled}
                      onChange={handleAssembledCartItemChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        borderRadius: '8px',
                        p: 0.2,
                      }}
                    ></Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <GhiChuCuaBan
                      note={note}
                      onChange={(note: string) => setNote(() => note)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Grid
                      container
                      direction={'row'}
                      spacing={4}
                      alignItems={'start'}
                      justifyContent={'center'}
                    >
                      <Grid item xs={12}>
                        <TongTienHoaDon totalPrice={totalPrice} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomButton
                          onClick={handleContinueToSurf}
                          sx={{
                            py: 1.5,
                            width: '100%',
                            bgColor: theme.palette.secondary.dark,
                          }}
                        >
                          <Typography
                            variant="button"
                            color={theme.palette.common.white}
                          >
                            Tiếp tục mua hàng
                          </Typography>
                        </CustomButton>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomButton
                          onClick={handlePayment}
                          sx={{
                            py: 1.5,
                            width: '100%',
                          }}
                        >
                          <Typography
                            variant="button"
                            color={theme.palette.common.white}
                          >
                            Thanh toán
                          </Typography>
                        </CustomButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </BottomSlideInDiv>
      </Box>
    </>
  );
}

export default Cart;
