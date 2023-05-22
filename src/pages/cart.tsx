import ImageBackground from '@/components/imageBackground';
import {
  Box,
  Grid,
  Link,
  Paper,
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
import { createContext, memo, useContext, useState } from 'react';
import { theme } from '../../tailwind.config';
import Banh1 from '../assets/Carousel/1.jpg';
import Image from 'next/image';
import { CustomButton, CustomIconButton } from '@/components/Inputs/Buttons';
import DeleteIcon from '@mui/icons-material/Delete';
import formatPrice from '@/utilities/formatCurrency';
import { NumberInputWithButtons } from '@/components/Inputs/NumberInputWithButtons';
import { CustomTextarea } from '../components/Inputs/CustomTextarea';
import router from 'next/router';

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
  const { row, justifyContent = 'flex-start' } = props;

  return (
    <>
      <NumberInputWithButtons
        min={1}
        value={row.quantity}
        max={row.maxQuantity}
        justifyContent={justifyContent}
        size="small"
      />
    </>
  );
}

function UI_TotalPrice(props: any) {
  const theme = useTheme();
  const { row } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      {isMd ? (
        <Typography variant="button" color={theme.palette.common.black}>
          {formatPrice(row.totalPrice)}
        </Typography>
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

function ProductTable(props: any) {
  const theme = useTheme();
  const context = useContext(CartContext);
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
            {context.productBill.map((row: any) => (
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
                  <UI_Quantity row={row} justifyContent={'center'} />
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
        {context.productBill.map((row: any) => (
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
  const context = useContext(CartContext);
  let totalPriceBill: number = 0;
  context.productBill.forEach((row: any) => {
    totalPriceBill += row.totalPrice;
  });
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
function createDataRow(
  id: number,
  href: string,
  image: string,
  name: string,
  size: string,
  material: string,
  quantity: number,
  maxQuantity: number,
  price: number,
) {
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
    totalPrice: quantity * price,
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
  createDataRow(
    1,
    '/',
    Banh1.src,
    'Hàng than',
    'Nhỏ',
    'Mứt dâu',
    5,
    10,
    100000,
  ),
  createDataRow(
    2,
    '/',
    Banh1.src,
    'Hàng than',
    'Nhỏ',
    'Mứt dâu',
    5,
    10,
    100000,
  ),
  createDataRow(
    3,
    '/',
    Banh1.src,
    'Hàng than',
    'Nhỏ',
    'Mứt dâu',
    5,
    10,
    100000,
  ),
  createDataRow(
    4,
    '/',
    Banh1.src,
    'Hàng than',
    'Nhỏ',
    'Mứt dâu',
    5,
    10,
    100000,
  ),
];
//#endregion

// #region Context
interface CartContextType {
  productBill: any;
}

const initCartContext: CartContextType = {
  productBill: [],
};

export const CartContext = createContext<CartContextType>(initCartContext);
// #endregion

const Cart = () => {
  const theme = useTheme();
  const [productBill, setProductBill] = useState(initproductBill);
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
                <ProductTable />
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
