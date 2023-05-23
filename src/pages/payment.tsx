import ImageBackground from '@/components/imageBackground';
import { Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CaiKhungCoTitle } from '../components/Layouts/components/CaiKhungCoTitle';
import Banh1 from '../assets/Carousel/3.jpg';
import { DanhSachSanPham } from '../components/Payment/DanhSachSanPham';
import { DonHangCuaBan } from '../components/Payment/DonHangCuaBan';
import FormGiaoHang from '../components/Payment/FormGiaoHang';
import bfriday from '../assets/blackfriday.jpg';
import CustomButton from '@/components/Inputs/Buttons/customButton';
import { AppContext, AppContextType } from '@/lib/contexts/appContext';
import { TwoUsers } from 'react-iconly';
import { useRouter } from 'next/router';
import { useSnackbarService } from '@/lib/contexts';
import productDetail from './product-detail';
import { DisplayCartItem } from '@/lib/contexts/cartContext';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Ref } from '@/lib/contexts/payment';
import { DeliveryObject } from '@/lib/models/Delivery';
import { BillObject } from '@/lib/models/Bill';
import { BillDetailObject } from '@/lib/models/BillDetail';
import DialogHinhThucThanhToan from '@/components/Payment/DialogHinhThucThanhToan';
import { DataArrayOutlined } from '@mui/icons-material';
import {
  PaymentContext,
  initPaymentContext,
} from '@/lib/contexts/paymentContext';

//#region Giả dữ liệu
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

const productBill = [
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

const MocGioGiaoHang = [
  {
    value: 'Buổi sáng (07:30 - 11:30)',
    label: 'Buổi sáng',
    description: '(07:30 - 11:30)',
  },
  {
    value: 'Buổi trưa (11:30 - 13:00)',
    label: 'Buổi trưa',
    description: '(11:30 - 13:00)',
  },
  {
    value: 'Buổi chiều (13:00 - 17:00)',
    label: 'Buổi chiều',
    description: '(13:00 - 17:00)',
  },
  {
    value: 'Buổi tối (17:00 - 21:00)',
    label: 'Buổi tối',
    description: '(17:00 - 21:00)',
  },
  {
    value: 'Cụ thể',
    label: 'Cụ thể',
    description: 'Chọn mốc thời gian',
  },
];

const Payment = () => {
  //#region Hooks

  const theme = useTheme();
  const { productBill } = useContext<AppContextType>(AppContext);
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  // #region useMemos

  const tamTinh = useMemo(() => {
    return productBill.reduce((acc, row) => {
      if (row.discountPrice && row.discountPrice > 0)
        return acc + row.quantity * row.discountPrice;
      else return acc + row.quantity * row.price;
    }, 0);
  }, [productBill]);

  //  #endregion

  // #region States

  const [phiVanChuyen, setPhiVanChuyen] = useState(0);
  const [khuyenMai, setKhuyenMai] = useState(0);
  const [chooseSale, setChooseSale] = useState('');
  const [tongBill, setTongBill] = useState(0);

  // #endregion

  // #region refs

  const formGiaoHangRef = useRef<Ref>(null);

  // #endregion

  // #region useEffects

  useEffect(() => {
    if (!productBill || productBill.length <= 0) {
      handleSnackbarAlert('error', 'Đã có lỗi xảy ra');
      router.push('/cart');
    }
  }, []);

  useEffect(() => {
    handleTongBill();
  }, [tamTinh, khuyenMai, phiVanChuyen]);

  // #endregion

  // #region Methods

  const TimKiemMaSale = () => {};

  const mapProductBillToBillDetailObject = (
    productBill: DisplayCartItem[],
    billId: string,
  ) => {
    return productBill.map((item) => {
      return createBillDetailData(item, billId);
    });
  };

  const createBillData = (): BillObject => {
    const billData: BillObject = {
      totalPrice: tamTinh,
      noteDelivery: '',
      noteCart: '',
      state: 0,
    } as BillObject;

    return billData;
  };

  const createDeliveryData = (billId: string) => {
    const otherInfos = formGiaoHangRef.current?.getOtherInfos();

    const deliveryData: DeliveryObject = {
      name: otherInfos?.name,
      tel: otherInfos?.tel,
      email: otherInfos?.email,
      address: otherInfos?.diaChi,
      note: otherInfos?.deliveryNote,
      state: 'inProcress',
      bill_id: billId,
    } as DeliveryObject;

    return deliveryData;
  };

  const createBillDetailData = (
    productBill: DisplayCartItem,
    billId: string,
  ): BillDetailObject => {
    const billDetailData: BillDetailObject = {
      amount: productBill.quantity,
      price: productBill.price,
      discount: productBill.discountPercent,
      discountPrice: productBill.discountPrice,
      batch_id: productBill.batchId,
      bill_id: billId,
    } as BillDetailObject;

    return billDetailData;
  };

  // #endregion

  // #region Handlers

  const handleSetPhiVanChuyen = (value: number) => {
    setPhiVanChuyen(value);
  };

  const handleChooseSale = (id: string) => {
    setChooseSale(id);
    if (id) {
      const sale: any = Sales.find((sale: any) => sale.id === id);
      if (tamTinh * sale.percentage < sale.maxDiscountPrice) {
        setKhuyenMai(tamTinh * sale.percentage);
      } else {
        setKhuyenMai(sale.maxDiscountPrice);
      }
    } else {
      setKhuyenMai(0);
    }
  };

  const handleTongBill = () => {
    setTongBill(tamTinh - khuyenMai + phiVanChuyen);
  };

  const handleProceedPayment = async () => {
    console.log('Running...');

    const billData = createBillData();
    const billRef = await addDoc(collection(db, 'bills'), billData);

    const deliveryData = createDeliveryData(billRef.id);
    const deliveryRef = await addDoc(
      collection(db, 'deliveries'),
      deliveryData,
    );

    const billDetails = mapProductBillToBillDetailObject(
      productBill,
      billRef.id,
    );

    // Make a firestore batch commit
    const batch = writeBatch(db);
    const billDetailsCollection = collection(db, 'bill_details');
    billDetails.forEach((billDetail) => {
      const docRef = doc(billDetailsCollection);
      batch.set(docRef, billDetail);
    });
    await batch.commit();

    const reqData = {
      billId: billRef.id,
      totalPrice: tamTinh,
      paymentDescription: `THANH TOAN CHO DON HANG ${billRef.id}`,
    };

    console.log(reqData);

    fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.url) {
          console.log(data.url);
          window.location.href = data.url;
        }
      })
      .catch((error) => console.error(error));

    console.log('Finishing...');
  };

  // #endregion

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <PaymentContext.Provider value={initPaymentContext}>
        <Box sx={{ pb: 16 }}>
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
          </ImageBackground>

          <Box sx={{ pt: 4, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
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
                    handleSetPhiVanChuyen={handleSetPhiVanChuyen}
                    MocGioGiaoHang={MocGioGiaoHang}
                    ref={formGiaoHangRef}
                  />
                </CaiKhungCoTitle>
              </Grid>

              <Grid item xs={12} md={6}>
                <CaiKhungCoTitle
                  title={'Danh sách sản phẩm'}
                  fluidContent={true}
                >
                  <DanhSachSanPham Products={productBill} />
                </CaiKhungCoTitle>
              </Grid>

              <Grid item xs={12} md={6}>
                <CaiKhungCoTitle title={'Đơn hàng của bạn'}>
                  <DonHangCuaBan
                    tamTinh={tamTinh}
                    khuyenMai={khuyenMai}
                    tongBill={tongBill}
                    Sales={Sales}
                    TimKiemMaSale={TimKiemMaSale}
                    showDeliveryPrice={phiVanChuyen}
                    handleChooseSale={handleChooseSale}
                  />
                </CaiKhungCoTitle>
              </Grid>

              <Grid item xs={'auto'}>
                <CustomButton onClick={handleClickOpen}>
                  <Typography
                    variant="button"
                    color={theme.palette.common.white}
                  >
                    Phương thức thanh toán
                  </Typography>
                </CustomButton>
              </Grid>
            </Grid>
          </Box>
          <DialogHinhThucThanhToan
            open={open}
            handleClose={handleClose}
            handlePayment={() => handleProceedPayment()}
          />
        </Box>
      </PaymentContext.Provider>
    </>
  );
};

export default memo(Payment);
