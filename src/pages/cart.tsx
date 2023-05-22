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
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { theme } from '../../tailwind.config';
import Banh1 from '../assets/Carousel/1.jpg';
import Image from 'next/image';
import { CustomButton, CustomIconButton } from '@/components/Inputs/Buttons';
import DeleteIcon from '@mui/icons-material/Delete';
import formatPrice from '@/utilities/formatCurrency';
import { NumberInputWithButtons } from '@/components/Inputs/NumberInputWithButtons';
import { CustomTextarea } from '../components/Inputs/CustomTextarea';
import router from 'next/router';
import { CartContext, DisplayCartItem } from '@/lib/contexts/cartContext';
import { CartItem } from '@/lib/contexts/productDetail';
import { LOCAL_CART_KEY } from '@/lib';
import { getDownloadURL } from 'firebase/storage';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import { db } from '@/firebase/config';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { BatchObject } from '@/lib/models/Batch';
import { ProductObject } from '@/lib/models';
import { dateCalendarClasses } from '@mui/x-date-pickers';
import { CartContextType } from '@/lib/contexts/cartContext';

//#region Đọc export default trước rồi hả lên đây!
function UI_Name(props: any) {
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

  return (
    <>
      <Typography variant={'button'} color={theme.palette.common.black}>
        {formatPrice(row.price) + (isMd ? '' : ' /sản phẩm')}
      </Typography>
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

  const totalPrice = useMemo(() => {
    return row.quantity * row.price;
  }, [row.quantity, row.price]);

  const totalDiscountPrice = useMemo(() => {
    if (row.discountPrice && row.discountPrice > 0) {
      return row.quantity * row.discountPrice;
    }

    return -1;
  }, [row.quantity, row.discountPrice]);

  return (
    <>
      {isMd ? (
        <Stack>
          <Typography
            variant="button"
            color={theme.palette.common.black}
            sx={{
              fontWeight: totalDiscountPrice >= 0 ? 'normal' : 'bold',
              textDecoration: totalDiscountPrice >= 0 ? 'line-through' : 'none',
              opacity: totalDiscountPrice >= 0 ? 0.5 : 1,
            }}
          >
            {formatPrice(totalPrice)}
          </Typography>
          {totalDiscountPrice > 0 && (
            <Typography variant="button" color={theme.palette.common.black}>
              {`${formatPrice(totalDiscountPrice)} (-${row.discountPercent}%)`}
            </Typography>
          )}
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}

function UI_Delete(props: any) {
  const theme = useTheme();
  const { row } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      {isMd ? (
        <CustomIconButton
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
        <CustomButton>
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

function ProductTable({ setProductBill }: any) {
  const theme = useTheme();
  const { productBill } = useContext<CartContextType>(CartContext);
  const imageHeight = '20vh';

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: theme.palette.common.white,
          borderRadius: '8px',
          border: 3,
          borderColor: theme.palette.secondary.main,
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
                      console.log(quantity);

                      if (setProductBill && quantity) {
                        const indexOfUpdatedRow = productBill.indexOf(row);
                        console.log(indexOfUpdatedRow);
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
                  <UI_Delete row={row} />
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
        {productBill.map((row: any) => (
          <Grid item xs={12}>
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
                      <UI_Delete row={row} />
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

function GhiChuCuaBan(props: any) {
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
              0.3,
            )}`,
          },
        }}
      >
        <CustomTextarea
          minRows={3}
          style={{ minHeight: '40px' }}
          placeholder="Ghi chú cho đầu bếp bên mình"
        />
      </Box>
    </Box>
  );
}

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

const initproductBill = [
  createDataRow({
    id: '1',
    href: '/',
    image: Banh1.src,
    name: 'Hàng than',
    size: 'Nhỏ',
    material: 'Mứt dâu',
    quantity: 5,
    maxQuantity: 10,
    price: 100000,
  }),
  createDataRow({
    id: '2',
    href: '/',
    image: Banh1.src,
    name: 'Hàng than',
    size: 'Nhỏ',
    material: 'Mứt dâu',
    quantity: 5,
    maxQuantity: 10,
    price: 100000,
  }),
  createDataRow({
    id: '3',
    href: '/',
    image: Banh1.src,
    name: 'Hàng than',
    size: 'Nhỏ',
    material: 'Mứt dâu',
    quantity: 5,
    maxQuantity: 10,
    price: 100000,
    discountPercent: 20,
  }),
  createDataRow({
    id: '4',
    href: '/',
    image: Banh1.src,
    name: 'Hàng than',
    size: 'Nhỏ',
    material: 'Mứt dâu',
    quantity: 5,
    maxQuantity: 10,
    price: 100000,
  }),
];

//#endregion

const Cart = () => {
  // #region Hooks

  const theme = useTheme();
  // #endregion

  // #region States

  const [productBill, setProductBill] =
    useState<DisplayCartItem[]>(initproductBill);

  // #endregion

  // #region useEffects

  useEffect(() => {
    getCartItems();
  }, []);

  // #endregion

  // #region Methods

  const getCartItems = async () => {
    const localCartItems = getLocalCartitem();

    try {
      const firestoreCartItems = await getFirestoreCartItem();

      const finalCartItems = syncLocalCartItemToFirestore(
        localCartItems,
        firestoreCartItems,
      );

      const displayCartItems = await fetchCartItemData(finalCartItems);

      displayCartItemsToView(displayCartItems);
    } catch (error) {
      console.log(error);
    }
  };

  const getLocalCartitem = (): CartItem[] => {
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
    firestoreCartItems: any,
  ): CartItem[] => {
    // TODO: Do this
    return localCartItems;
  };

  const fetchCartItemData = async (
    cartItems: CartItem[],
  ): Promise<DisplayCartItem[]> => {
    // TODO: implement

    if (!cartItems || cartItems.length <= 0) return [];

    const displayCartItems = await Promise.all(
      cartItems.map(async (item) => {
        const productRef = doc(db, 'products', item.productId);
        const productData = await getDoc(productRef);
        const product: ProductObject = {
          ...productData.data(),
          id: productData.id,
        } as ProductObject;

        const batchRef = doc(db, 'batches', item.batchId);
        const batchData = await getDoc(batchRef);
        const batch: BatchObject = {
          ...batchData.data(),
          id: batchData.id,
          MFG: (batchData.data()?.MFG as Timestamp).toDate(),
          EXP: (batchData.data()?.EXP as Timestamp).toDate(),
          discountDate: (batchData.data()?.discountDate as Timestamp).toDate(),
        } as BatchObject;

        const discountPrice =
          new Date(batch.discountDate).getTime() < new Date().getTime()
            ? batch.price - (batch.price * batch.discountPercent) / 100
            : -1;

        const displayCartItem: DisplayCartItem = {
          id: item.id,
          href: item.href,
          name: product.name,
          image: await getDownloadUrlFromFirebaseStorage(product.images[0]),
          size: batch.size,
          material: batch.material,
          quantity: item.quantity,
          maxQuantity: batch.totalQuantity - batch.soldQuantity,
          price: batch.price,
          discountPercent: batch.discountPercent,
          discountPrice: discountPrice,
        };

        return displayCartItem;
      }),
    );

    return displayCartItems;
  };

  const displayCartItemsToView = (cartItems: DisplayCartItem[]) => {
    setProductBill(() => cartItems);
  };

  // #endregion

  console.log();

  return (
    <>
      <CartContext.Provider
        value={{
          productBill,
        }}
      >
        <Box sx={{ pb: 8 }}>
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

          <Box sx={{ pt: 12, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'start'}
              spacing={4}
            >
              <Grid item xs={12}>
                <ProductTable setProductBill={setProductBill} />
              </Grid>

              <Grid item xs={12} md={6}>
                <GhiChuCuaBan />
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
                      onClick={() => {
                        router.push('/products');
                      }}
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
                      onClick={() => {
                        router.push('/payment');
                      }}
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
