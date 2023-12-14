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
import { sendBillToEmail } from '@/lib/services/MailService';

const PaymentResult = () => {
  const theme = useTheme();
  const handlerSnackbarAlert = useSnackbarService();
  const [load, stop] = useLoadingService();

  const router = useRouter();

  // #region Bill data

  const [billData, setBillData] = useState<BillTableRow | undefined | null>(
    undefined
  );

  //#endregion

  //#region Gửi mail

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

  // #endregion

  const [uid, setUid] = useLocalStorage<string>('uid', '');
  const [billId, setBillId] = useLocalStorage<string>('billId', '');

  useEffect(() => {
    const { uid, billId } = router.query;
    console.log('uid', uid);
    console.log('billId', billId);
    setUid(uid as string);
    setBillId(billId as string);
  }, [router.query]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        const data = await getBillTableRowById(uid, billId);
        if (data) {
          setBillData(data);
        } else {
          setBillData(null);
        }
        stop();
      } catch (error) {
        console.log(error);
        setBillData(undefined);
        stop();
      }
    };

    if (uid && uid != '' && billId && billId != '' && billData == undefined) {
      fetchData();
    }
  }, [uid, billId]);

  useEffect(() => {
    const sendMail = async () => {
      try {
        const sentEmail = localStorage.getItem('sentEmail');
        if (!billData || sentEmail == 'true') {
          localStorage.removeItem('sentEmail');
          return;
        }
        localStorage.setItem('sentEmail', 'true');
        await sendBillToMail(billData);
      } catch (error) {
        console.log(error);
      }
    };
    if (billData) {
      sendMail();
      console.log('billData', billData);
    }
  }, [billData]);

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
