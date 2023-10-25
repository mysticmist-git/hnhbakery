import ImageBackground from '@/components/Imagebackground';
import CustomButton from '@/components/buttons/CustomButton';
import { CaiKhungCoTitle } from '@/components/layouts';
import { DanhSachSanPham, DonHangCuaBan } from '@/components/payment';
import DialogHinhThucThanhToan from '@/components/payment/DialogHinhThucThanhToan/PTTT_item';
import { auth, db } from '@/firebase/config';
import { COLLECTION_NAME, PLACEHOLDER_DELIVERY_PRICE } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { addDocToFirestore, addDocsToFirestore } from '@/lib/firestore';
import useAssembledCartItems from '@/lib/hooks/useAssembledCartItems';
import useCartItems from '@/lib/hooks/useCartItems';
import useCartNote from '@/lib/hooks/useCartNote';
import useDeliveryForm from '@/lib/hooks/useDeliveryForm';
import useSales from '@/lib/hooks/useSales';
import useShippingFee from '@/lib/hooks/useShippingFee';
import { BillObject, DeliveryObject, SaleObject } from '@/lib/models';
import {
  calculateTotalBillPrice,
  createDeliveryData,
  mapProductBillToBillDetailObject,
  sendPaymentRequestToVNPay,
  validateForm,
} from '@/lib/pageSpecific/payment';
import { Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { collection, doc, increment, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import FormGiaoHang from '../components/payment/FormGiaoHang';

// #endregion

const Payment = () => {
  // #region States

  const { value: sales } = useSales();
  const [user, loading, error] = useAuthState(auth);

  const [cart, setCart] = useCartItems();
  const [assembledCartItems, reloadAssembledCartItems] =
    useAssembledCartItems();
  const [firstTime, setFirstTime] = useState(true);
  const [cartNote, setCartNote] = useCartNote();

  const [saleAmount, setSaleAmount] = useState(0);
  const [chosenSale, setChosenSale] = useState<SaleObject | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deliveryForm, setDeliveryForm] = useDeliveryForm();

  const shippingFee = useShippingFee();

  // #endregion

  //#region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  // #region useMemos

  const billPrice = useMemo(() => {
    return assembledCartItems.reduce((acc, item) => {
      if (item.discounted)
        return (
          acc +
          item.quantity *
            (item.variant?.price
              ? item.variant?.price - item.discountAmount
              : 0)
        );
      else return acc + item.quantity * (item.variant?.price ?? 0);
    }, 0);
  }, [assembledCartItems]);

  //  #endregion

  // #region useEffects

  const totalBill = useMemo(() => {
    return calculateTotalBillPrice(billPrice, saleAmount, shippingFee);
  }, [billPrice, saleAmount, shippingFee]);

  useEffect(() => {
    if (cart && firstTime) {
      reloadAssembledCartItems(cart);
      setFirstTime(false);
    }
  }, [cart, firstTime, reloadAssembledCartItems]);

  // #endregion

  // #region Methods

  const TimKiemMaSale = () => {};

  const createBillData = (
    paymentId: string | undefined,
    chosenSale: SaleObject | null
  ): BillObject => {
    let billData: BillObject = {
      totalPrice: billPrice - saleAmount,
      originalPrice: billPrice,
      saleAmount: saleAmount,
      note: cartNote,
      state: 0,
      payment_id: paymentId,
      user_id: user?.uid ?? '',
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

  const addAllNecessariesInfoToFirestore = async (
    paymentId: string | undefined,
    chosenSale: SaleObject | null
  ): Promise<{
    billData: BillObject;
    deliveryData: DeliveryObject;
  }> => {
    const billData = createBillData(paymentId, chosenSale);
    const billRef = await addDocToFirestore(billData, COLLECTION_NAME.BILLS);

    const deliveryData = createDeliveryData(
      deliveryForm,
      billRef.id,
      PLACEHOLDER_DELIVERY_PRICE
    );

    const deliveryRef = await addDocToFirestore(
      deliveryData,
      COLLECTION_NAME.DELIVERIES
    );

    const billDetails = mapProductBillToBillDetailObject(
      assembledCartItems,
      billRef.id
    );

    // Make a firestore batch commit
    const billDetailRefs = await addDocsToFirestore(
      billDetails,
      COLLECTION_NAME.BILL_DETAILS
    );

    // Update batch soldQuantity
    await Promise.all(
      billDetails.map(async (item) => {
        const batchRef = doc(
          collection(db, COLLECTION_NAME.BATCHES),
          item.batch_id
        );

        await updateDoc(batchRef, {
          soldQuantity: increment(item.amount ?? 0),
        });
      })
    );

    return {
      billData: { ...billData, id: billRef.id },
      deliveryData: { ...deliveryData, id: deliveryRef.id },
    };
  };

  const handleProceedPayment = async (
    id: string | undefined,
    type: string | undefined
  ) => {
    try {
      if (!checkPaymentValidation(type)) return;

      console.log(id, type);

      console.log('Running...');

      console.log('Adding data to firestore...');

      const { billData, deliveryData } = await addAllNecessariesInfoToFirestore(
        id,
        chosenSale
      );

      console.log('Clearing cache...');
      // Deelte localStorage cart
      setCart([]);
      setCartNote('');

      if (type === 'Thanh toán khi nhận hàng') {
        router.push(`/tienmat-result?billId=${billData.id}`);
      } else {
        const reqData = {
          billId: billData.id as string,
          totalPrice: totalBill,
          paymentDescription: `THANH TOAN CHO DON HANG ${billData.id}`,
        };

        console.log('Sending payment request wih data...');
        console.log('Payload:', reqData);

        const data = await sendPaymentRequestToVNPay(reqData);

        console.log('URL received from VNPay: ', data.url);

        window.location.href = data.url;

        console.log('Finishing...');
      }
    } catch (error: any) {
      console.log(error);
      handleSnackbarAlert('error', error.message);
    }
  };

  // #endregion

  // #region Handlers

  const handleChooseSale = (newChosenSale: SaleObject) => {
    if (newChosenSale) {
      if (newChosenSale.id === chosenSale?.id) {
        setChosenSale(() => null);
        setSaleAmount(() => 0);
      } else {
        setChosenSale(() => newChosenSale);

        if (
          (billPrice * newChosenSale.percent) / 100 <
          newChosenSale.maxSalePrice
        ) {
          setSaleAmount(() => (billPrice * newChosenSale.percent) / 100);
        } else {
          setSaleAmount(newChosenSale.maxSalePrice);
        }
      }
    } else {
      setSaleAmount(0);
    }
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

  // const handleSaveCart = async () => {
  //   const result = await saveCart(state.productBill);

  //   handleSnackbarAlert(result.isSuccess ? 'success' : 'error', result.msg);
  // };

  const handleClickOpen = () => {
    const result = validateForm(deliveryForm);

    if (!result.isValid) {
      handleSnackbarAlert('error', result.msg);
      return;
    }

    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  // #endregion

  return (
    <>
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

        <Box sx={{ pt: 8, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'start'}
            spacing={4}
          >
            <Grid item xs={12}>
              <CaiKhungCoTitle title={'Thông tin giao hàng'}>
                <FormGiaoHang form={deliveryForm} setForm={setDeliveryForm} />
              </CaiKhungCoTitle>
            </Grid>

            <Grid item xs={12} md={6}>
              <CaiKhungCoTitle title={'Danh sách sản phẩm'} fluidContent={true}>
                <DanhSachSanPham Products={assembledCartItems} />
              </CaiKhungCoTitle>
            </Grid>

            <Grid item xs={12} md={6}>
              <CaiKhungCoTitle title={'Đơn hàng của bạn'}>
                <DonHangCuaBan
                  tamTinh={billPrice}
                  khuyenMai={saleAmount}
                  tongBill={totalBill}
                  Sales={sales}
                  TimKiemMaSale={TimKiemMaSale}
                  showDeliveryPrice={shippingFee}
                  handleChooseSale={handleChooseSale}
                  chosenSale={chosenSale}
                />
              </CaiKhungCoTitle>
            </Grid>

            <Grid item xs={'auto'}>
              <CustomButton onClick={handleClickOpen}>
                <Typography variant="button" color={theme.palette.common.white}>
                  Phương thức thanh toán
                </Typography>
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
        <DialogHinhThucThanhToan
          open={dialogOpen}
          handleClose={handleClose}
          handlePayment={handleProceedPayment}
        />
      </Box>
    </>
  );
};

export default Payment;
