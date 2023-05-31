import ImageBackground from '@/components/imageBackground';

import {
  Box,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  forwardRef,
  memo,
  useContext,
  useRef,
  useEffect,
  useMemo,
  useState,
  ForwardedRef,
} from 'react';
import Image from 'next/image';
import { CustomButton, CustomIconButton } from '@/components/Inputs/Buttons';
import DeleteIcon from '@mui/icons-material/Delete';
import formatPrice from '@/utilities/formatCurrency';
import { NumberInputWithButtons } from '@/components/Inputs/NumberInputWithButtons';
import { CustomTextarea } from '../components/Inputs/CustomTextarea';
import router from 'next/router';
import {
  CartContext,
  DisplayCartItem,
  FAIL_SAVE_CART_MSG,
  SUCCESS_SAVE_CART_MSG,
  saveCart,
} from '@/lib/contexts/cartContext';
import { CartItem, CartItemAddingResult } from '@/lib/contexts/productDetail';
import { LOCAL_CART_KEY } from '@/lib';
import { CartContextType } from '@/lib/contexts/cartContext';
import {
  AppContext,
  AppContextType,
  AppDispatchAction,
  AppState,
} from '@/lib/contexts/appContext';
import { useSnackbarService } from '@/lib/contexts';
import {
  getDocFromFirestore,
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore/firestoreLib';
import React from 'react';

//#region Đọc export default trước rồi hả lên đây!
function UI_Name(props: any) {
  const hello = 5;
  const theme = useTheme();
  const { row } = props;
  return (
    <>
      <Typography
        variant="body1"
        color={{
          xs: theme.palette.secondary.main,
          md: theme.palette.common.black,
        }}
      >
        {row.name}
      </Typography>
    </>
  );
}

function UI_SizeMaterial(props: any) {
  const theme = useTheme();
  const { row } = props;
  return (
    <>
      <Typography variant={'button'} color={theme.palette.text.secondary}>
        {'Size ' + row.size + ' + ' + row.material}
      </Typography>
    </>
  );
}

function UI_Price(props: any) {
  const theme = useTheme();
  const { row } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const hasDiscount = useMemo(() => {
    return row.discountPrice && row.discountPrice > 0;
  }, []);

  return (
    <>
      <Typography
        variant={'button'}
        color={theme.palette.common.black}
        sx={{
          fontWeight: hasDiscount ? 'none' : 'bold',
          textDecoration: hasDiscount ? 'line-through' : 'none',
          opacity: hasDiscount ? 0.5 : 1,
        }}
      >
        {formatPrice(row.price) + (isMd ? '' : ' /sản phẩm')}
      </Typography>
      {hasDiscount && (
        <Typography variant={'button'} color={theme.palette.common.black}>
          {formatPrice(row.discountPrice) + (isMd ? '' : ' /sản phẩm')}
        </Typography>
      )}
    </>
  );
}

function UI_Quantity(props: any) {
  const theme = useTheme();
  const { row, justifyContent = 'flex-start', onChange } = props;

  return (
    <>
      <NumberInputWithButtons
        min={1}
        value={row.quantity}
        max={row.maxQuantity}
        justifyContent={justifyContent}
        size="small"
        onChange={onChange}
      />
    </>
  );
}

function UI_TotalPrice(props: any) {
  const theme = useTheme();
  const { row }: { row: DisplayCartItem } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const finalTotalPrice = useMemo(() => {
    if (row.discountPrice && row.discountPrice > 0) {
      return row.quantity * row.discountPrice;
    }

    return row.quantity * row.price;
  }, [row.quantity]);

  return (
    <>
      {isMd ? (
        <Stack>
          <Typography
            variant="button"
            color={theme.palette.common.black}
            sx={{
              fontWeight: 'bold',
            }}
          >
            {formatPrice(finalTotalPrice)}
          </Typography>
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}

function UI_Delete(props: any) {
  const theme = useTheme();
  const { row, onDelete } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      {isMd ? (
        <CustomIconButton
          onClick={() => onDelete(row.id)}
          sx={{
            bgcolor: theme.palette.secondary.main,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: theme.palette.secondary.dark,
              color: theme.palette.common.white,
            },
          }}
        >
          <DeleteIcon sx={{ color: theme.palette.common.white }} />
        </CustomIconButton>
      ) : (
        <CustomButton onClick={() => onDelete(row.id)}>
          <Typography
            sx={{ px: 4 }}
            variant="button"
            color={theme.palette.common.white}
          >
            Xóa
          </Typography>
        </CustomButton>
      )}
    </>
  );
}

function ProductTable({ setProductBill, handleSaveCart }: any) {
  const theme = useTheme();
  const { productBill } = useContext<CartContextType>(CartContext);
  const imageHeight = '20vh';

  const handleDeleteRow = (id: string) => {
    setProductBill((prev: DisplayCartItem[]) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <>
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

      <TableContainer
        component={Paper}
        sx={{
          bgcolor: theme.palette.common.white,
          borderRadius: '8px',
          border: 3,
          borderColor: theme.palette.secondary.main,
          marginTop: 1,
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              bgcolor: theme.palette.secondary.main,
            }}
          >
            <TableRow>
              {headingTable.map((item, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{ minWidth: i == 2 ? '255px' : '0px' }}
                >
                  <Typography
                    variant="body1"
                    color={theme.palette.common.white}
                  >
                    {item}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productBill.map((row: any) => (
              <TableRow
                key={row.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" align="center">
                  <Grid
                    container
                    direction={'row'}
                    alignItems={'center'}
                    spacing={0}
                    justifyContent={'center'}
                  >
                    <Grid item xs={12} pb={1}>
                      <Link href={row.href}>
                        <Box
                          sx={{
                            width: '100%',
                            height: imageHeight,
                            border: 3,
                            borderColor: theme.palette.secondary.main,
                            overflow: 'hidden',
                            borderRadius: '8px',
                            position: 'relative',
                          }}
                        >
                          <Box
                            component={Image}
                            src={row.image}
                            alt={row.name}
                            loading="lazy"
                            fill={true}
                            sx={{
                              objectFit: 'cover',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                cursor: 'pointer',
                                transform: 'scale(1.2) rotate(5deg)',
                              },
                            }}
                          />
                        </Box>
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Name row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_SizeMaterial row={row} />
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align="center">
                  <UI_Price row={row} />
                </TableCell>
                <TableCell align="center">
                  <UI_Quantity
                    row={row}
                    justifyContent={'center'}
                    onChange={(quantity: number) => {
                      if (setProductBill && quantity) {
                        const indexOfUpdatedRow = productBill.indexOf(row);
                        const updatedProductBill = [...productBill];
                        updatedProductBill[indexOfUpdatedRow].quantity =
                          quantity;

                        setProductBill(() => updatedProductBill);
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <UI_TotalPrice row={row} />
                </TableCell>
                <TableCell align="center">
                  <UI_Delete row={row} onDelete={handleDeleteRow} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        spacing={2}
        sx={{
          display: {
            xs: 'block',
            md: 'none',
          },
        }}
      >
        {productBill.map((row: any, index: number) => (
          <Grid item xs={12} key={index}>
            <Box
              sx={{
                border: 3,
                borderColor: theme.palette.secondary.main,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                spacing={2}
              >
                <Grid item xs={5} alignSelf={'stretch'}>
                  <Link href={row.href}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Box
                        component={Image}
                        src={row.image}
                        alt={row.name}
                        loading="lazy"
                        fill={true}
                        sx={{
                          objectFit: 'cover',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            cursor: 'pointer',
                            transform: 'scale(1.2) rotate(5deg)',
                          },
                        }}
                      />
                    </Box>
                  </Link>
                </Grid>
                <Grid item xs={7}>
                  <Grid
                    container
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    spacing={0.5}
                    sx={{
                      py: 1,
                    }}
                  >
                    <Grid item xs={12}>
                      <UI_Name row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_SizeMaterial row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Price row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Quantity row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_TotalPrice row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Delete row={row} onDelete={handleDeleteRow} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function TongTienHoaDon(props: any) {
  const theme = useTheme();
  const context = useContext<CartContextType>(CartContext);

  const totalPriceBill: number = useMemo(() => {
    return context.productBill.reduce((acc, row) => {
      if (row.discountPrice && row.discountPrice > 0)
        return acc + row.quantity * row.discountPrice;
      else return acc + row.quantity * row.price;
    }, 0);
  }, [context.productBill]);

  return (
    <Box
      sx={{
        border: 3,
        borderColor: theme.palette.secondary.main,
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bgcolor: theme.palette.common.white,
      }}
    >
      <Box
        sx={{
          alignSelf: 'stretch',
          p: 2,
          bgcolor: theme.palette.secondary.main,
        }}
      >
        <Typography
          align="left"
          variant="body1"
          color={theme.palette.common.white}
        >
          Tổng hóa đơn
        </Typography>
      </Box>
      <Box
        sx={{
          alignSelf: 'stretch',
          p: 2,
          pb: 1,

          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          align="left"
          variant="body1"
          color={theme.palette.text.secondary}
        >
          Giá tiền bạn trả:
        </Typography>
        <Typography
          align="right"
          variant="body1"
          color={theme.palette.common.black}
        >
          {formatPrice(totalPriceBill)}
        </Typography>
      </Box>
      <Box
        sx={{
          alignSelf: 'stretch',
          p: 2,
          pt: 0,
        }}
      >
        <Typography
          align="left"
          variant="body2"
          color={theme.palette.text.secondary}
        >
          Vận chuyển, thuế và giảm giá sẽ được tính khi thanh toán.
        </Typography>
      </Box>
    </Box>
  );
}

const GhiChuCuaBan = forwardRef(
  (props: any, noteRef: ForwardedRef<HTMLTextAreaElement>) => {
    const theme = useTheme();

    return (
      <Box
        sx={{
          border: 3,
          borderColor: theme.palette.secondary.main,
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          bgcolor: theme.palette.common.white,
        }}
      >
        <Box
          sx={{
            alignSelf: 'stretch',
            p: 2,

            bgcolor: theme.palette.secondary.main,
          }}
        >
          <Typography
            align="left"
            variant="body1"
            color={theme.palette.common.white}
          >
            Ghi chú
          </Typography>
        </Box>
        <Box
          sx={{
            alignSelf: 'stretch',
            justifySelf: 'stretch',
            '&:hover': {
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3
              )}`,
            },
          }}
        >
          <CustomTextarea
            minRows={3}
            style={{ minHeight: '40px' }}
            placeholder="Ghi chú cho đầu bếp bên mình"
            ref={noteRef}
          />
        </Box>
      </Box>
    );
  }
);

//#endregion

//#region Giả dữ liệu
function createDataRow({
  id,
  href,
  image,
  name,
  size,
  material,
  quantity,
  maxQuantity,
  price,
  discountPercent,
}: DisplayCartItem) {
  return {
    id,
    href,
    image,
    name,
    size,
    material,
    price,
    quantity,
    maxQuantity,
    discountPercent,
  };
}
const headingTable = [
  'Sản phẩm',
  'Giá tiền /sản phẩm',
  'Số lượng',
  'Tổng',
  'Xóa',
];

const Cart = () => {
  // #region Hooks

  const theme = useTheme();
  const { state, dispatch } = useContext<AppContextType>(AppContext);
  const handleSnackbarAlert = useSnackbarService();

  // #endregion

  // #region States

  const [productBill, setProductBill] = useState<DisplayCartItem[]>([]);

  // #endregion

  // #region Refs

  const noteRef = useRef<HTMLTextAreaElement>(null);

  // #endregion

  // #region useEffects

  useEffect(() => {
    getCartItems();
  }, []);

  // #endregion

  // #region Methods

  const getCartItems = async () => {
    const localCartItems = getLocalCartItems();

    try {
      const firestoreCartItems = await getFirestoreCartItem();

      const finalCartItems = syncLocalCartItemToFirestore(
        localCartItems,
        firestoreCartItems
      );

      const displayCartItems = await fetchCartItemData(finalCartItems);

      // TODO: Please actually remove the Ids from localStorage
      const temps = displayCartItems.filter((item) => {
        return new Date(item.EXP).getTime() > new Date().getTime();
      });

      displayCartItemsToView(temps);
      handleSaveCart();
    } catch (error) {
      console.log(error);
    }
  };

  const getLocalCartItems = (): CartItem[] => {
    const cartItemsString = localStorage.getItem(LOCAL_CART_KEY);

    if (cartItemsString) {
      return JSON.parse(cartItemsString);
    }

    return [];
  };

  const getFirestoreCartItem = async (): Promise<CartItem[]> => {
    return [];
  };

  const syncLocalCartItemToFirestore = (
    localCartItems: any,
    firestoreCartItems: any
  ): CartItem[] => {
    return localCartItems;
  };

  const fetchCartItemData = async (
    cartItems: CartItem[]
  ): Promise<DisplayCartItem[]> => {
    if (!cartItems || cartItems.length <= 0) return [];

    const displayCartItems = await Promise.all(
      cartItems.map(async (item) => {
        const batch = await getDocFromFirestore('batches', item.batchId);
        const product = await getDocFromFirestore('products', batch.product_id);

        const discountPrice =
          new Date(batch.discountDate).getTime() < new Date().getTime()
            ? batch.price - (batch.price * batch.discountPercent) / 100
            : -1;

        const displayCartItem: DisplayCartItem = {
          ...item,
          name: product.name,
          image: await getDownloadUrlFromFirebaseStorage(product.images[0]),
          size: batch.size,
          material: batch.material,
          maxQuantity: batch.totalQuantity - batch.soldQuantity,
          price: batch.price,
          discountPercent: batch.discountPercent,
          discountPrice: discountPrice,
          discountDate: batch.discountDate,
          MFG: batch.MFG,
          EXP: batch.EXP,
        };

        return displayCartItem;
      })
    );

    return displayCartItems;
  };

  const displayCartItemsToView = (cartItems: DisplayCartItem[]) => {
    setProductBill(() => cartItems);
  };

  // #endregion

  // #region Handlers

  const handlePayment = async () => {
    if (isCartEmpty) {
      handleSnackbarAlert('info', 'Giỏ hàng trống');
      return;
    }

    handleSaveCart();

    dispatch({
      type: AppDispatchAction.SET_PRODUCT_BILL,
      payload: [...productBill],
    });

    dispatch({
      type: AppDispatchAction.SET_CART_NOTE,
      payload: noteRef.current?.value,
    });

    router.push('/payment');
  };

  const handleContinueToSurf = async () => {
    handleSaveCart();

    router.push('/products');
  };

  const handleSaveCart = async () => {
    if (isCartEmpty) {
      handleSnackbarAlert('info', 'Giỏ hàng trống');
      return;
    }

    const result = await saveCart(productBill);

    handleSnackbarAlert(result.isSuccess ? 'success' : 'error', result.msg);
  };

  // #endregion

  //#region UseMemos

  const isCartEmpty = useMemo(() => {
    return !Boolean(productBill) || productBill.length <= 0;
  }, [productBill]);

  //#endregion

  return (
    <>
      <CartContext.Provider
        value={{
          productBill,
        }}
      >
        <Box sx={{ pb: 8 }}>
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
            )}
          />

          <Box sx={{ pt: 12, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'start'}
              spacing={4}
            >
              <Grid item xs={12}>
                <ProductTable
                  setProductBill={setProductBill}
                  handleSaveCart={() => {
                    handleSaveCart();
                  }}
                />
                {isCartEmpty && (
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
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <GhiChuCuaBan ref={noteRef} />
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
                    <TongTienHoaDon />
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
            </Grid>
          </Box>
        </Box>
      </CartContext.Provider>
    </>
  );
};

export default memo(Cart);
