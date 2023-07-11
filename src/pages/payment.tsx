import bfriday from '@/assets/blackfriday.jpg';
import ImageBackground from '@/components/Imagebackground';
import CustomButton from '@/components/buttons/CustomButton';
import { DanhSachSanPham, DonHangCuaBan } from '@/components/payment';
import DialogHinhThucThanhToan from '@/components/payment/DialogHinhThucThanhToan';
import { db } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import {
  AppContext,
  AppContextType,
  AppDispatchAction,
} from '@/lib/contexts/appContext';
import { DisplayCartItem, saveCart } from '@/lib/contexts/cartContext';
import { Ref } from '@/lib/contexts/payment';
import {
  PaymentContext,
  initPaymentContext,
} from '@/lib/contexts/paymentContext';
import {
  addDocToFirestore,
  addDocsToFirestore,
  getCollection,
  getCollectionWithQuery,
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore';
import {
  BillDetailObject,
  BillObject,
  DeliveryObject,
  SaleObject,
} from '@/lib/models';
import { Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  increment,
  updateDoc,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CaiKhungCoTitle } from '../components/layouts/CaiKhungCoTitle';
import FormGiaoHang from '../components/payment/FormGiaoHang';

// #endregion

const BILL_KEY = 'BILL_KEY';

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

const Payment = ({ salesJSON }: { salesJSON: string }) => {
  //#region Hooks

  const theme = useTheme();
  const { state, dispatch } = useContext<AppContextType>(AppContext);
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();
  const auth = getAuth();

  //#endregion

  // #region useMemos

  const tamTinh = useMemo(() => {
    return state.productBill.reduce((acc, row) => {
      if (row.discountPrice && row.discountPrice > 0)
        return acc + row.quantity * row.discountPrice;
      else return acc + row.quantity * row.price;
    }, 0);
  }, [state.productBill]);

  const sales = useMemo(() => {
    if (!salesJSON || salesJSON === '') return null;

    const parsedSales = JSON.parse(salesJSON) as SaleObject[];
    return parsedSales;
  }, [salesJSON]);

  //  #endregion

  // #region States

  const [phiVanChuyen, setPhiVanChuyen] = useState(0);
  const [khuyenMai, setKhuyenMai] = useState(0);
  const [chosenSale, setChosenSale] = useState<SaleObject | null>(null);
  const [tongBill, setTongBill] = useState(0);
  const [userId, setUserId] = useState('');

  // #endregion

  // #region refs

  const formGiaoHangRef = useRef<Ref>(null);

  // #endregion

  // #region useEffects

  useEffect(() => {
    if (!state.productBill || state.productBill.length <= 0) {
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
    billId: string
  ) => {
    return productBill.map((item) => {
      return createBillDetailData(item, billId);
    });
  };

  const createBillData = (
    paymentId: string | undefined,
    chosenSale: SaleObject | null
  ): BillObject => {
    let billData: BillObject = {
      totalPrice: tamTinh - khuyenMai,
      originalPrice: tamTinh,
      saleAmount: khuyenMai,
      note: state.cartNote,
      state: 0,
      payment_id: paymentId,
      user_id: userId,
      created_at: new Date(),
    } as BillObject;

    if (chosenSale) {
      billData = {
        ...billData,
        sale_id: chosenSale.id,
      } as BillObject;
    }

    return billData;
  };

  const createDeliveryData = (billId: string) => {
    const otherInfos = formGiaoHangRef.current?.getOtherInfos();

    const date = otherInfos?.ngayGiao;
    const time = otherInfos?.thoiGianGiao;

    const deliveryData: DeliveryObject = {
      name: otherInfos?.name,
      tel: otherInfos?.tel,
      email: otherInfos?.email,
      address: otherInfos?.diaChi,
      note: otherInfos?.deliveryNote,
      state: 'inProcress',
      bill_id: billId,
      price: phiVanChuyen,
      date: date,
      time: time,
    } as DeliveryObject;

    return deliveryData;
  };

  const createBillDetailData = (
    productBill: DisplayCartItem,
    billId: string
  ): BillDetailObject => {
    const billDetailData: BillDetailObject = {
      amount: productBill.quantity,
      price: productBill.price,
      discount: productBill.discountPercent,
      discountAmount: productBill.discountPrice,
      batch_id: productBill.batchId,
      bill_id: billId,
    } as BillDetailObject;

    return billDetailData;
  };

  const clearCacheData = async () => {
    dispatch({
      type: AppDispatchAction.SET_PRODUCT_BILL,
      payload: [],
    });

    dispatch({
      type: AppDispatchAction.SET_CART_NOTE,
      payload: '',
    });

    const result = await saveCart([]);

    handleSnackbarAlert(result.isSuccess ? 'success' : 'error', result.msg);
  };

  // #endregion

  // #region Handlers

  const handleSetPhiVanChuyen = (value: number) => {
    setPhiVanChuyen(value);
  };

  const handleChooseSale = (newChosenSale: SaleObject) => {
    if (newChosenSale) {
      if (newChosenSale.id === chosenSale?.id) {
        setChosenSale(() => null);
        setKhuyenMai(() => 0);
      } else {
        setChosenSale(() => newChosenSale);

        if (
          (tamTinh * newChosenSale.percent) / 100 <
          newChosenSale.maxSalePrice
        ) {
          setKhuyenMai(() => (tamTinh * newChosenSale.percent) / 100);
        } else {
          setKhuyenMai(newChosenSale.maxSalePrice);
        }
      }
    } else {
      setKhuyenMai(0);
    }
  };

  const handleTongBill = () => {
    setTongBill(tamTinh - khuyenMai + phiVanChuyen);
  };

  const checkPaymentValidation = (type: string | undefined): boolean => {
    if (!type) {
      handleSnackbarAlert('error', 'Đã có lỗi xảy ra');
      router.push('/cart');
      return false;
    }

    if (type === 'Momo') {
      handleSnackbarAlert('error', 'Momo chưa được hỗ trợ');
      return false;
    }

    return true;
  };

  const addAllNecessariesInfoToFirestore = async (
    paymentId: string | undefined,
    chosenSale: SaleObject | null
  ): Promise<{
    billData: BillObject;
    deliveryData: DeliveryObject;
  }> => {
    const billData = createBillData(paymentId, chosenSale);
    const billRef = await addDocToFirestore(billData, 'bills');

    const deliveryData = createDeliveryData(billRef.id);
    const deliveryRef = await addDocToFirestore(deliveryData, 'deliveries');

    const billDetails = mapProductBillToBillDetailObject(
      state.productBill,
      billRef.id
    );

    // Make a firestore batch commit
    const billDetailRefs = await addDocsToFirestore(
      billDetails,
      'bill_details'
    );

    // Update batch soldQuantity
    billDetails.forEach(async (item) => {
      const batchRef = doc(collection(db, 'batches'), item.batch_id);

      await updateDoc(batchRef, {
        soldQuantity: increment(item.amount ?? 0),
      });
    });

    return {
      billData: { ...billData, id: billRef.id },
      deliveryData: { ...deliveryData, id: deliveryRef.id },
    };
  };

  const sendPaymentRequestToVNPay = async (reqData: {
    billId: string;
    totalPrice: number;
    paymentDescription: string;
  }) => {
    try {
      const response: Response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      });

      const data = await response.json();

      if (data) {
        return data;
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProceedPayment = async (
    id: string | undefined,
    type: string | undefined
  ) => {
    try {
      if (!checkPaymentValidation(type)) return;

      console.log('Running...');

      console.log('Adding data to firestore...');

      const { billData, deliveryData } = await addAllNecessariesInfoToFirestore(
        id,
        chosenSale
      );

      console.log('Clearing cache...');
      clearCacheData();

      // Update bill to localStorage (in case use is not logged it)
      console.log('Saving bills to local storage...');
      saveBillToLocalStorage(id ?? '');

      const reqData = {
        billId: billData.id as string,
        totalPrice: tongBill,
        paymentDescription: `THANH TOAN CHO DON HANG ${billData.id}`,
      };

      console.log('Sending payment request wih data...');
      console.log('Payload:', reqData);

      const data = await sendPaymentRequestToVNPay(reqData);

      console.log('URL received from VNPay: ', data.url);

      window.location.href = data.url;

      console.log('Finishing...');
    } catch (error: any) {
      console.log(error);
      handleSnackbarAlert('error', error.message);
    }
  };

  const handleSaveCart = async () => {
    const result = await saveCart(state.productBill);

    handleSnackbarAlert(result.isSuccess ? 'success' : 'error', result.msg);
  };
  // #endregion

  // #region useEffects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // #endregion

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    const result = validateForm();

    if (!result.isValid) {
      handleSnackbarAlert('error', result.msg);
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //#region Methods

  interface FormValidationResult {
    isValid: boolean;
    msg: string;
  }

  const validateForm = (): FormValidationResult => {
    const otherInfos = formGiaoHangRef.current?.getOtherInfos();

    if (otherInfos?.name === '') {
      return {
        isValid: false,
        msg: 'Vui lòng nhập họ tên',
      };
    }

    if (otherInfos?.tel === '') {
      return {
        msg: 'Vui lòng nhập số điện thoại',
        isValid: false,
      };
    }

    if (otherInfos?.diaChi === '') {
      return {
        msg: 'Vui lòng nhập địa chỉ',
        isValid: false,
      };
    }

    if (otherInfos?.email === '') {
      return {
        msg: 'Vui lòng nhập email',
        isValid: false,
      };
    }

    if (!otherInfos?.ngayGiao) {
      return {
        msg: 'Vui lòng chọn ngày giao',
        isValid: false,
      };
    }

    if (otherInfos?.thoiGianGiao === '') {
      return {
        msg: 'Vui lòng chọn thời gian giao',
        isValid: false,
      };
    }

    return {
      isValid: true,
      msg: '',
    };
  };

  const saveBillToLocalStorage = (billId: string) => {
    if (!billId || billId === '') return;

    const currentBills = localStorage.getItem(BILL_KEY);

    const saveUpdatedBillsToLocalStorage = (billIds: string[]) => {
      if (!billIds) return;

      const json = JSON.stringify(billIds);

      localStorage.setItem(BILL_KEY, JSON.stringify(json));
    };

    if (currentBills) {
      const parsedCurrentBills: string[] = JSON.parse(currentBills) as string[];

      const isBillAlreadyExisted = parsedCurrentBills.includes(billId);

      if (isBillAlreadyExisted) return;

      const updatedBills = [...parsedCurrentBills, billId];

      saveUpdatedBillsToLocalStorage(updatedBills);
    } else {
      saveUpdatedBillsToLocalStorage([billId]);
    }
  };

  //#endregion

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
                  <DanhSachSanPham Products={state.productBill} />
                </CaiKhungCoTitle>
              </Grid>

              <Grid item xs={12} md={6}>
                <CaiKhungCoTitle title={'Đơn hàng của bạn'}>
                  <DonHangCuaBan
                    tamTinh={tamTinh}
                    khuyenMai={khuyenMai}
                    tongBill={tongBill}
                    Sales={sales}
                    TimKiemMaSale={TimKiemMaSale}
                    showDeliveryPrice={phiVanChuyen}
                    handleChooseSale={handleChooseSale}
                    chosenSale={chosenSale}
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
            handlePayment={handleProceedPayment}
          />
        </Box>
      </PaymentContext.Provider>
    </>
  );
};

export const getServerSideProps = async () => {
  let sales = await getCollectionWithQuery<SaleObject>(
    'sales',
    where('end_at', '>', Timestamp.now())
  );

  // Get downloadURL

  sales = await Promise.all(
    sales.map(async (sale) => {
      const image = sale.image;
      const downloadURL = await getDownloadUrlFromFirebaseStorage(image);
      return {
        ...sale,
        image: downloadURL,
      };
    })
  );

  const salesJSON = JSON.stringify(sales);

  return {
    props: {
      salesJSON,
    },
  };
};

export default memo(Payment);
