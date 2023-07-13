import { AssembledCartItem, CartItem } from '@/@types/cart';
import BottomSlideInDiv from '@/components/Animation/Appear/BottomSlideInDiv';
import ImageBackground from '@/components/Imagebackground';
import { CustomButton } from '@/components/buttons';
import { GhiChuCuaBan, TongTienHoaDon } from '@/components/cart';
import ProductTable from '@/components/cart/ProductTable';
import { assembleItems, filterExpired } from '@/lib/cart';
import { ROUTES } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
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

  const { value: cart, set: setCart } = useLocalStorageValue<CartItem[]>(
    'cart',
    {
      defaultValue: [],
      initializeWithValue: false,
      parse(str, fallback) {
        if (!str) return fallback;

        const value: any[] = JSON.parse(str);
        const items = value.map(
          (item) =>
            new CartItem(item._userId, item._batchId, item._quantity, item._id)
        );

        return items;
      },
    }
  );

  const { value: note, set: setNote } = useLocalStorageValue<string>('note', {
    defaultValue: '',
    initializeWithValue: false,
  });

  const [assembledCartItems, setAssembledCartItems] = useState<
    AssembledCartItem[]
  >([]);

  const [firstLoad, setFirstLoad] = useState(true);

  //#endregion

  //#region Handlers

  function handleCartItemChange(items: AssembledCartItem[]) {
    setAssembledCartItems(items);
  }

  function handleContinueToSurf() {
    router.push(ROUTES.PRODUCTS);
  }

  function handlePayment() {
    alert('paid');
  }

  function handleSaveCart() {
    setCart(assembledCartItems.map((item) => item.getRawItem()));
    handleSnackbarAlert('success', 'Đã cập nhật giỏ hàng');
  }

  //#endregion

  //#region useEffect

  useEffect(() => {
    async function execute() {
      if (!cart) return;

      try {
        let filteredCart: CartItem[] = cart;

        if (firstLoad) {
          filteredCart = await filterExpired(cart);
          setCart(filteredCart);
          setFirstLoad(false);
          return;
        }

        const assembledCartItem = await assembleItems(filteredCart);

        setAssembledCartItems(assembledCartItem);
      } catch (error) {
        console.log(error);
      }
    }

    execute();
  }, [cart]);

  //#endregion

  //#region useMemos

  const totalPrice = useMemo(() => {
    const price = assembledCartItems.reduce((acc, item) => {
      let price = item.variant?.price ?? 0;
      let discountAmount = 0;

      if (item.discounted) {
        discountAmount = item.discountAmount;
      }

      const itemTotalPrice = (price - discountAmount) * item.quantity;

      return acc + itemTotalPrice;
    }, 0);

    return price;
  }, [assembledCartItems]);

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
                      items={assembledCartItems}
                      onChange={handleCartItemChange}
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
