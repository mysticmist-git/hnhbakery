import ImageBackground from '@/components/Imagebackground';
import { CaiKhungCoTitle } from '@/components/layouts';
import { auth } from '@/firebase/config';
import {
  getBill,
  getBillTableRowById,
  updateBill,
  updateBillField,
} from '@/lib/DAO/billDAO';
import { getGuestUser, getUserByUid, updateUser } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import User from '@/models/user';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import useLoadingService from '@/lib/hooks/useLoadingService';
import { BillTableRow } from '@/models/bill';
import { ExpandMore } from '@mui/icons-material';
import { formatDateString } from '@/lib/utils';
import { BillAccordionContent } from '../components/profile/BillAccordionContent';
import { sendBillToEmail } from '@/lib/services/MailService';
import { updateSale } from '@/lib/DAO/saleDAO';
import { getCustomerRank } from '@/lib/DAO/customerRankDAO';

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
  const [load, stop] = useLoadingService();

  const router = useRouter();

  //#endregion
  //#region States

  const [userData, setUserData] = useState<User | undefined | null>(undefined);
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

  const sendBillToMail = useCallback(async (bill?: BillTableRow) => {
    try {
      const email = bill?.deliveryTableRow?.mail ?? '';
      const sendMailResponse = await sendBillToEmail(email, bill);

      if (sendMailResponse.status == 200) {
        handlerSnackbarAlert(
          'success',
          'Mã hóa đơn đã được gửi tới mail của bạn.'
        );
      } else {
        console.log(sendMailResponse);
        handlerSnackbarAlert('error', 'Có lỗi xảy ra khi cố gửi mail cho bạn');
      }
    } catch (error: any) {
      console.log(error);
    }
  }, []);

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
        responseBillId === '' ||
        typeof responseBillId !== 'string'
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

      const data = await getBillTableRowById(userData.uid, responseBillId);
      if (data) {
        setBillData(data);

        const hasRunBefore = localStorage.getItem('hasRun') == 'true';

        if (!hasRunBefore) {
          await updateBillField(
            userData.group_id,
            userData.id,
            responseBillId as string,
            {
              paid_time: new Date(),
            }
          );
        }

        // Cập nhật Sale khi thanh toán thành công
        if (data.sale && !hasRunBefore) {
          const usedTurn: number = ['00', '07'].includes(responseCode as string)
            ? data.sale.usedTurn
            : data.sale.usedTurn - 1;

          console.log(usedTurn);

          const totalSalePrice: number = ['00', '07'].includes(
            responseCode as string
          )
            ? parseFloat(data.sale.totalSalePrice.toString()) +
              parseFloat(data.sale_price.toString())
            : data.sale.totalSalePrice;

          console.log(totalSalePrice);

          await updateSale(data.sale_id, {
            ...data.sale,
            usedTurn: parseInt(usedTurn.toString()),
            totalSalePrice: parseInt(totalSalePrice.toString()),
          });
        }

        // Cập nhật User
        if (
          data.customer &&
          data.customer.paidMoney &&
          data.customer.rankId &&
          !hasRunBefore &&
          ['00', '07'].includes(responseCode as string)
        ) {
          const paidMoney: number =
            parseFloat(data.customer.paidMoney.toString()) +
            parseFloat(data.final_price.toString());

          console.log(paidMoney);

          const customerRank = await getCustomerRank(data.customer.rankId);
          const rankId =
            paidMoney >= customerRank!.maxPaidMoney
              ? parseInt(data.customer.rankId) + 1
              : data.customer.rankId;

          console.log(rankId);

          await updateUser(data.customer.group_id, data.customer.id, {
            ...data.customer,
            paidMoney: parseInt(paidMoney.toString()),
            rankId: rankId.toString(),
          });
        }

        localStorage.setItem('hasRun', 'true');
      } else {
        setBillData(null);
      }

      setIsProcessed(true);

      const responseMessage = resolveResponseCode(responseCode as string);
      setResponseMessage(() => responseMessage);
    };

    if (isProcessed) return;
    getPaymentResultAndUpdateBillState();
  }, [responseCode, responseBillId, userData, isProcessed]);

  //#endregion

  //#region billdata
  const [billData, setBillData] = useState<BillTableRow | undefined | null>(
    undefined
  );

  //#endregion

  useEffect(() => {
    const sendMail = async () => {
      const sentEmail = localStorage.getItem('sentEmail');
      if (!billData || sentEmail == 'true') {
        localStorage.removeItem('sentEmail');
        return;
      }
      localStorage.setItem('sentEmail', 'true');
      await sendBillToMail(billData);
    };
    if (billData) {
      sendMail();
      console.log('billData', billData);
    }
  }, [billData]);

  console.log(billData);

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
          spacing={2}
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
                  sx={{
                    '&:hover': {
                      color: theme.palette.common.white,
                    },
                  }}
                >
                  {responseMessage}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ImageBackground>

      <Box
        component={'div'}
        sx={{
          pt: 6,
          pb: 12,
          px: { xs: 2, sm: 2, md: 4, lg: 8 },
          overflow: 'visible',
        }}
      >
        {billData && (
          <>
            <Accordion
              defaultExpanded
              sx={{
                border: 1,
                borderColor: 'black',
                boxShadow: 0,
                '&.MuiAccordion-rounded': {
                  borderRadius: 3,
                },
                backgroundColor: 'transparent',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pr: 2,
                  }}
                >
                  <Typography variant="button" fontWeight={'regular'}>
                    Mã hóa đơn: {billData.id}
                  </Typography>
                  <Typography variant="button" fontWeight={'regular'}>
                    {formatDateString(billData.created_at)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <BillAccordionContent bill={billData} />
              </AccordionDetails>
            </Accordion>
          </>
        )}

        {billData == null && isProcessed && (
          <Typography
            align="center"
            variant="body1"
            fontWeight={'bold'}
            sx={{
              color: 'grey.600',
            }}
          >
            Hệ thống đang xảy ra sự cố.
            <br />
            Vui lòng quay lại sau!
          </Typography>
        )}

        {billData == null && !isProcessed && (
          <Typography
            align="center"
            variant="body1"
            fontWeight={'bold'}
            sx={{
              color: 'grey.600',
            }}
          >
            Hệ thống đang xử lý...
          </Typography>
        )}

        <Box
          component={'div'}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={() => router.push('/')}
          >
            Trở về trang chủ
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(PaymentResult);
