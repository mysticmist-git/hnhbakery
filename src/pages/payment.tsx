import ImageBackground from '@/components/Imagebackground';
import CustomButton from '@/components/buttons/CustomButton';
import { CaiKhungCoTitle } from '@/components/layouts';
import { DanhSachSanPham, DonHangCuaBan } from '@/components/payment';
import DialogHinhThucThanhToan from '@/components/payment/DialogHinhThucThanhToan';
import { auth } from '@/firebase/config';
import { increaseDecreaseBatchQuantity } from '@/lib/DAO/batchDAO';
import { createBill } from '@/lib/DAO/billDAO';
import { createBillItem } from '@/lib/DAO/billItemDAO';
import { getGuestUser, getUserByUid } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import useAssembledCartItems from '@/lib/hooks/useAssembledCartItems';
import useCartItems from '@/lib/hooks/useCartItems';
import useCartNote from '@/lib/hooks/useCartNote';
import useDeliveryForm from '@/lib/hooks/useDeliveryForm';
import useSales from '@/lib/hooks/useSales';
import useShippingFee from '@/lib/hooks/useShippingFee';
import {
  mapProductBillToBillDetailObject as mapProductBillToBillItem,
  sendPaymentRequestToVNPay,
  validateForm,
} from '@/lib/pageSpecific/payment';
import Bill from '@/models/bill';
import Sale from '@/models/sale';
import User from '@/models/user';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import FormGiaoHang from '../components/payment/FormGiaoHang';

// #endregion

const Payment = () => {
  //#region States

  const { value: sales } = useSales();
  const [user] = useAuthState(auth);
  const [cart, setCart] = useCartItems();
  const [assembledCartItems, reloadAssembledCartItems] =
    useAssembledCartItems();
  const [cartNote, setCartNote] = useCartNote();
  const [saleAmount, setSaleAmount] = useState(0);
  const [chosenSale, setChosenSale] = useState<Sale | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deliveryForm, setDeliveryForm] = useDeliveryForm();
  const shippingFee = useShippingFee();

  // #endregion
  //#region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion
  //#region useMemos

  const { billPrice, discountAmount } = useMemo(() => {
    return assembledCartItems.reduce(
      (result, item) => {
        result.billPrice += (item.variant?.price ?? 0) * item.quantity;
        result.discountAmount +=
          (item.batch?.discount?.start_at?.valueOf() &&
          item.batch?.discount?.start_at < new Date()
            ? ((item.batch?.discount.percent ?? 0) / 100) *
              (item.variant?.price ?? 0)
            : 0) * item.quantity;

        return result;
      },
      { billPrice: 0, discountAmount: 0 } // Updated initial value
    );
  }, [assembledCartItems]);
  const finalBillPrice = useMemo(() => {
    return billPrice - discountAmount - saleAmount + shippingFee;
  }, [billPrice, discountAmount, saleAmount, shippingFee]);

  //#endregion
  //#region useEffects

  useEffect(() => {
    if (cart) {
      reloadAssembledCartItems(cart);
    }
  }, [cart, reloadAssembledCartItems]);

  //#endregion
  //#region Methods

  const createBillData = useCallback(
    function (
      paymentId: string,
      chosenSale: Sale | null,
      customer_id: string
    ): Omit<Bill, 'id' | 'paid_time'> {
      let billData: Omit<Bill, 'id'> = {
        total_price: billPrice,
        total_discount: discountAmount,
        sale_price: saleAmount,
        final_price: finalBillPrice,
        note: cartNote ?? '',
        state: 'issued',
        payment_method_id: paymentId,
        customer_id: customer_id,
        booking_item_id: '',
        branch_id: deliveryForm.branchId,
        delivery_id: '',
        sale_id: chosenSale ? chosenSale.id : '',
        paid_time: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      return billData;
    },
    [
      billPrice,
      cartNote,
      deliveryForm.branchId,
      discountAmount,
      finalBillPrice,
      saleAmount,
    ]
  );

  const addAllNecessariesInfoToFirestore = useCallback(
    async function (
      paymentId: string | undefined,
      chosenSale: Sale | null
    ): Promise<Omit<Bill, 'paid_time'>> {
      if (!paymentId) {
        throw new Error('Payment method is not selected/defined!');
      }

      let userData: User | null;

      if (user) {
        userData = (await getUserByUid(user.uid)) ?? null;
      } else {
        userData = (await getGuestUser()) ?? null;
      }

      if (!userData) {
        throw new Error('User not found!');
      }

      const billData = createBillData(paymentId, chosenSale, userData.id);

      const billRef = await createBill(
        userData?.group_id,
        userData.id,
        billData as Omit<Bill, 'id'>
      );

      const billItemsData = mapProductBillToBillItem(
        assembledCartItems,
        billRef.id
      );

      await Promise.all(
        billItemsData.map(async (item) => {
          await createBillItem(
            userData!.group_id,
            userData!.id,
            billRef.id,
            item
          );
        })
      );

      for (const item of assembledCartItems) {
        await increaseDecreaseBatchQuantity(item.batchId, -item.quantity);
      }

      return { ...billData, id: billRef.id };
    },
    [assembledCartItems, createBillData, user]
  );

  //#endregion
  //#region Handlers

  const checkPaymentValidation = useCallback(
    function (type: string | undefined): boolean {
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
    },
    [handleSnackbarAlert, router]
  );

  const handleProceedPayment = useCallback(
    async function (id: string | undefined, type: string | undefined) {
      try {
        if (!checkPaymentValidation(type)) return;

        console.log(id, type);

        console.log('Running...');

        console.log('Adding data to firestore...');

        const billData = await addAllNecessariesInfoToFirestore(id, chosenSale);

        console.log('Clearing cache...');
        // Deelte localStorage cart
        setCart([]);
        setCartNote('');

        if (type === 'Tiền mặt') {
          router.push(`/tienmat-result?billId=${billData.id}`);
        } else {
          const reqData = {
            billId: billData.id as string,
            totalPrice: finalBillPrice,
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
    },
    [
      addAllNecessariesInfoToFirestore,
      checkPaymentValidation,
      chosenSale,
      handleSnackbarAlert,
      router,
      setCart,
      setCartNote,
      finalBillPrice,
    ]
  );

  const handleChooseSale = useCallback(
    function (newChosenSale: Sale) {
      if (newChosenSale) {
        if (newChosenSale.id === chosenSale?.id) {
          setChosenSale(() => null);
          setSaleAmount(() => 0);
        } else {
          setChosenSale(() => newChosenSale);

          if ((billPrice * newChosenSale.percent) / 100 < newChosenSale.limit) {
            setSaleAmount(() => (billPrice * newChosenSale.percent) / 100);
          } else {
            setSaleAmount(newChosenSale.limit);
          }
        }
      } else {
        setSaleAmount(0);
      }
    },
    [billPrice, chosenSale?.id]
  );

  const handleClickOpen = useCallback(
    function () {
      const result = validateForm(deliveryForm);

      if (!result.isValid) {
        handleSnackbarAlert('error', result.msg);
        return;
      }

      setDialogOpen(true);
    },
    [deliveryForm, handleSnackbarAlert]
  );

  const handleClose = useCallback(function () {
    setDialogOpen(false);
  }, []);

  // #endregion

  return (
    <Box component={'div'} sx={{ pb: 16 }}>
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

      <Box
        component={'div'}
        sx={{ pt: 8, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}
      >
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
                tamTinh={billPrice - discountAmount}
                khuyenMai={saleAmount}
                tongBill={finalBillPrice}
                Sales={sales}
                TimKiemMaSale={() => {}}
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
  );
};

export default Payment;
