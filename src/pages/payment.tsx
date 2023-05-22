import ImageBackground from '@/components/imageBackground';
import {
  Grid,
  Typography,
  useTheme,
  ListItemText,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import { createContext, memo, useRef, useState } from 'react';
import { theme } from '../../tailwind.config';
import { CaiKhungCoTitle } from '../components/Layouts/components/CaiKhungCoTitle';
import Banh1 from '../assets/Carousel/3.jpg';
import { DanhSachSanPham } from '../components/Payment/DanhSachSanPham';
import { DonHangCuaBan } from '../components/Payment/DonHangCuaBan';
import FormGiaoHang from '../components/Payment/FormGiaoHang';
import bfriday from '../assets/blackfriday.jpg';
import products from './products';

// #region Context
interface PaymentContextType {
  productBill: any;
}

const initPaymentContext: PaymentContextType = {
  productBill: [],
};

export const PaymentContext =
  createContext<PaymentContextType>(initPaymentContext);

// #endregion

function createProduct(
  id: number,
  name: string,
  image: string,
  size: string,
  material: string,
  quantity: number,
  MFG: string,
  EXP: string,
  price: number,
  discount: number,
) {
  return {
    id,
    name,
    image,
    size,
    material,
    quantity,
    MFG,
    EXP,
    price,
    discount,
    discountPrice: price * discount,
    totalPrice: price * (1 - discount) * quantity,
  };
}

const Products = [
  createProduct(
    1,
    'Bánh Croissant',
    Banh1.src,
    'Vừa',
    'Dâu',
    3,
    '07:00 07/01/2023',
    '22:00 07/01/2023',
    100000,
    0.2,
  ),
  createProduct(
    2,
    'Bánh kem',
    Banh1.src,
    'Lớn',
    'Dâu',
    1,
    '07:00 07/01/2023',
    '22:00 07/01/2023',
    100000,
    0.2,
  ),
  createProduct(
    3,
    'Bánh kem',
    Banh1.src,
    'Lớn',
    'Dâu',
    1,
    '07:00 07/01/2023',
    '22:00 07/01/2023',
    100000,
    0.2,
  ),
];

function createSale(
  id: number,
  name: string,
  code: string,
  image: string,
  percentage: number,
  maxDiscountPrice: number,
  endDate: string,
) {
  return {
    id,
    name,
    code,
    image,
    percentage,
    maxDiscountPrice,
    endDate,
  };
}

const Sales = [
  createSale(
    1,
    'Black Friday',
    'SALE-001',
    bfriday.src,
    0.1,
    50000,
    '07/01/2022',
  ),
  createSale(
    2,
    'Black Friday',
    'SALE-001',
    bfriday.src,
    0.1,
    50000,
    '07/01/2022',
  ),
];

const totalBill = Products.reduce((total, product) => {
  return total + product.totalPrice;
}, 0);

const Payment = () => {
  const theme = useTheme();
  const [showDeliveryPrice, setShowDeliveryPrice] = useState(false);

  const handleShowSetDeliveryPrice = (value: boolean) => {
    setShowDeliveryPrice(value);
  };

  const TimKiemMaSale = () => {};

  return (
    <>
      <PaymentContext.Provider value={initPaymentContext}>
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
                      <Link href="/cart" style={{ textDecoration: 'none' }}>
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
                          Giỏ hàng
                        </Typography>
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        align="center"
                        variant="h2"
                        color={theme.palette.primary.main}
                      >
                        Thông tin thanh toán
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
                <CaiKhungCoTitle title={'Thông tin giao hàng'}>
                  <FormGiaoHang
                    handleShowSetDeliveryPrice={handleShowSetDeliveryPrice}
                  />
                </CaiKhungCoTitle>
              </Grid>

              <Grid item xs={12} md={6}>
                <CaiKhungCoTitle
                  title={'Danh sách sản phẩm'}
                  fluidContent={true}
                >
                  <DanhSachSanPham Products={Products} />
                </CaiKhungCoTitle>
              </Grid>

              <Grid item xs={12} md={6}>
                <CaiKhungCoTitle title={'Đơn hàng của bạn'}>
                  <DonHangCuaBan
                    totalBill={totalBill}
                    Sales={Sales}
                    TimKiemMaSale={TimKiemMaSale}
                    showDeliveryPrice={showDeliveryPrice}
                  />
                </CaiKhungCoTitle>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PaymentContext.Provider>
    </>
  );
};

export default memo(Payment);
