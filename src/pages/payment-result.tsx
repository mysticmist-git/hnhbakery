import ImageBackground from '@/components/Imagebackground';
import { CaiKhungCoTitle } from '@/components/layouts';
import { auth } from '@/firebase/config';
import { updateBillField } from '@/lib/DAO/billDAO';
import { getGuestUser, getUserByUid } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import User from '@/models/user';
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const resolveResponseCode = (responseCode: string) => {
  switch (responseCode) {
    case '00':
      return 'Thanh toán thành công';
    case '07':
      return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).';
    case '09':
      return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
    case '10':
      return 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
    case '11':
      return 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '12':
      return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.';
    case '13':
      return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '24':
      return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
    case '51':
      return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch. Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '65':
      return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.';
    case '75':
      return 'Ngân hàng thanh toán đang bảo trì.';
    case '79':
      return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '99':
      return 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)';
    default:
      return 'Lỗi không xác định';
  }
};

const PaymentResult = () => {
  //#region Hooks

  const theme = useTheme();
  const handlerSnackbarAlert = useSnackbarService();
  const [email] = useLocalStorage<string>('email', '');
  const router = useRouter();

  //#endregion
  //#region States

  const [userData, setUserData] = useState<User | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isProcessed, setIsProcessed] = useState(false);

  //#endregion
  //#region UseMemos

  const { vnp_ResponseCode: responseCode, vnp_TxnRef: responseBillId } =
    useMemo(() => {
      return router.query;
    }, [router.query]);

  //#endregion
  //#region Handlers

  const sendBillToMail = useCallback(async () => {
    try {
      console.log(email);

      const sendMailResponse = await fetch('/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: '[HNH-BAKERY - Thanh toán hóa đơn thanh công]',
          text:
            'Cảm ơn vi đã tin tưởng sử dụng sản phẩm của HnH Bakery. Đây là mã hóa đơn của bạn: ' +
            responseBillId,
        }),
      });

      if (sendMailResponse.ok) {
        handlerSnackbarAlert(
          'success',
          'Mã hóa đơn đã được gửi tới mail của bạn.'
        );
      } else {
        const errorMessage = await sendMailResponse.json();
        console.log(errorMessage);
        handlerSnackbarAlert('error', 'Có lỗi xảy ra khi cố gửi mail cho bạn');
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [email, handlerSnackbarAlert, responseBillId]);

  //#endregion
  //#region UseEffects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        getUserByUid(user.uid)
          .then((fetchedUserData) => setUserData(fetchedUserData ?? null))
          .catch(() => {
            console.log('Fail to fetch user data!');
            handlerSnackbarAlert(
              'warning',
              'Không thể lấy dữ liệu người dùng!'
            );
          });
      } else {
        getGuestUser()
          .then((fetchedUserData) => setUserData(fetchedUserData ?? null))
          .catch(() => {
            console.log('Fail to fetch user data!');
            handlerSnackbarAlert(
              'warning',
              'Không thể lấy dữ liệu người dùng!'
            );
          });
      }
    });

    return () => unsubscribe();
  }, [handlerSnackbarAlert]);

  useEffect(() => {
    const getPaymentResultAndUpdateBillState = async () => {
      if (
        !responseCode ||
        !responseBillId ||
        responseCode === '' ||
        responseBillId === ''
      )
        return;

      if (!userData) {
        return;
      }

      if (['00', '07'].includes(responseCode as string)) {
        setIsSuccess(true);
        try {
          await updateBillField(
            userData.group_id,
            userData.id,
            responseBillId as string,
            {
              state: 'paid',
              updated_at: new Date(),
            }
          );
        } catch (error) {
          console.log('Fail to update bill state', error);
          handlerSnackbarAlert(
            'warning',
            'Cập nhật trạng thái đơn hàng thất bại!'
          );
        }
      } else {
        setIsSuccess(false);

        try {
          await updateBillField(
            userData.group_id,
            userData.id,
            responseBillId as string,
            {
              state: 'cancelled',
              updated_at: new Date(),
            }
          );
          handlerSnackbarAlert(
            'warning',
            'Thanh toán đơn hàng thất bại, đã hủy đơn hàng!'
          );
        } catch (error) {
          console.log('Fail to update bill state', error);
          handlerSnackbarAlert(
            'warning',
            'Cập nhật trạng thái đơn hàng thất bại!'
          );
        }
      }

      const responseMessage = resolveResponseCode(responseCode as string);
      setResponseMessage(() => responseMessage);

      if (['00', '07'].includes(responseCode as string)) {
        sendBillToMail();

        // Update payment time
        try {
          await updateBillField(
            userData.group_id,
            userData.id,
            responseBillId as string,
            {
              paid_time: new Date(),
            }
          );

          setIsProcessed(true);
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (isProcessed) return;
    getPaymentResultAndUpdateBillState();
  }, [
    responseCode,
    responseBillId,
    handlerSnackbarAlert,
    sendBillToMail,
    userData,
    isProcessed,
  ]);

  //#endregion

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
                <Typography
                  align="center"
                  variant="h2"
                  color={theme.palette.primary.main}
                >
                  {responseMessage}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ImageBackground>

      <Box component={'div'} sx={{ pt: 8, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
        <Grid
          container
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={4}
        >
          <Grid item xs={12}>
            <CaiKhungCoTitle title={'Hóa đơn của bạn'}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
                spacing={2}
              >
                <Grid item xs={'auto'}>
                  <Typography
                    align="left"
                    variant="h3"
                    color={theme.palette.common.black}
                  >
                    Mã hóa đơn:
                  </Typography>
                </Grid>
                <Grid item xs={'auto'}>
                  <Typography
                    align="right"
                    variant="body1"
                    color={theme.palette.common.black}
                  >
                    {responseBillId}
                  </Typography>
                </Grid>
              </Grid>
            </CaiKhungCoTitle>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => router.push('/cart')}>
              Trở về giỏ hàng
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(PaymentResult);
