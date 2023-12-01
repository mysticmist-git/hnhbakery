import ImageBackground from '@/components/Imagebackground';
import { CaiKhungCoTitle } from '@/components/layouts';
import { auth } from '@/firebase/config';
import { getBillTableRowById } from '@/lib/DAO/billDAO';
import { useSnackbarService } from '@/lib/contexts';
import useLoadingService from '@/lib/hooks/useLoadingService';
import { formatDateString } from '@/lib/utils';
import { BillTableRow, billStateContentParse } from '@/models/bill';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocalStorage } from 'usehooks-ts';
import { BillAccordionContent } from './profile';
import { deliveryStateContentParse } from '@/models/delivery';

const PaymentResult = () => {
  const theme = useTheme();
  const handlerSnackbarAlert = useSnackbarService();
  const [load, stop] = useLoadingService();

  const router = useRouter();

  // #region Bill data
  const { billId } = useMemo(() => {
    return router.query;
  }, [router.query]);

  const [user, userLoading, userError] = useAuthState(auth);

  const [billData, setBillData] = useState<BillTableRow | undefined | null>(
    undefined
  );

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/');
    }
  }, [router, user, userLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        if (
          user &&
          user.uid &&
          user.uid != '' &&
          billId &&
          typeof billId == 'string' &&
          billId != ''
        ) {
          const data = await getBillTableRowById(user.uid, billId);
          if (data) setBillData(data);
          else setBillData(null);
        } else {
          setBillData(null);
        }
        stop();
      } catch (error) {
        console.log(error);
        setBillData(null);
        stop();
      }
    };

    fetchData();
  }, [load, stop, user, billId]);

  //#endregion

  //#region Gửi mail
  const [isProcessed, setIsProcessed] = useState(false);

  const [email] = useLocalStorage<string>('email', '');

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
          subject: '[HNH-BAKERY - Thanh toán thành công]',
          text: `
        Cảm ơn bạn đã sử dụng dịch vụ của H&H Bakery.
        *Dưới đây là thông tin hóa đơn của bạn
        Thông tin đơn hàng
         - Mã hóa đơn: ${billData?.id ?? 'Trống'}
         - Trạng thái: ${billStateContentParse(billData?.state)}
         - Hình thức thanh toán: ${billData?.paymentMethod?.name ?? 'Trống'}
         - Ghi chú: ${billData?.note ?? 'Trống'}
        Thông tin vận chuyển
         - Người nhận: ${billData?.deliveryTableRow?.name}
         - Số điện thoại: ${billData?.deliveryTableRow?.tel}
         - Ngày đặt giao: ${
           formatDateString(
             billData?.deliveryTableRow?.ship_date,
             'DD/MM/YYYY'
           ) ?? 'Trống'
         }
         - Thời gian đặt giao: ${
           billData?.deliveryTableRow?.ship_time ?? 'Trống'
         }
         - Địa chi giao hàng: ${
           billData?.deliveryTableRow?.addressObject?.address ??
           billData?.deliveryTableRow?.address ??
           'Trống'
         }
         - Ghi chú: ${billData?.deliveryTableRow?.delivery_note ?? 'Trống'}
         - Trạng thái: ${
           deliveryStateContentParse(billData?.deliveryTableRow?.state) ??
           'Trống'
         }
          *Đầy đủ thông tin hóa đơn vui lòng truy cập: https://hnhbakery.vercel.app/`,
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
  }, [billId, email, handlerSnackbarAlert]);

  useEffect(() => {
    if (isProcessed == false && billId && billData) {
      sendBillToMail();
      setIsProcessed(true);
    }
  }, [isProcessed, sendBillToMail, billId, billData]);

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
          spacing={2}
        >
          <Grid item xs={12}>
            <Link href="#" style={{ textDecoration: 'none' }}>
              <Typography
                align="center"
                variant="h1"
                color={theme.palette.primary.main}
                sx={{
                  '&:hover': {
                    color: theme.palette.common.white,
                  },
                }}
              >
                H&H Bakery xin cảm ơn!
              </Typography>
            </Link>
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

        {billData == null && (
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
