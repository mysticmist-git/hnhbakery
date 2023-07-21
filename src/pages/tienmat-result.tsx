import ImageBackground from '@/components/Imagebackground/Imagebackground';
import { CaiKhungCoTitle } from '@/components/layouts';
import { useSnackbarService } from '@/lib/contexts';
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { memo, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const PaymentResult = () => {
  const theme = useTheme();
  const handlerSnackbarAlert = useSnackbarService();

  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>(
    'Cảm ơn vì đã sử dụng dịch vụ của H&H, đây là mã hóa đơn của bạn'
  );

  const [email, setEmail] = useLocalStorage<string>('email', '');

  const router = useRouter();

  const sendBillToMail = async () => {
    try {
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
            billId,
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
  };

  const { billId } = useMemo(() => {
    return router.query;
  }, [router.query]);

  return (
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

      <Box sx={{ pt: 8, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
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
                    {billId}
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
