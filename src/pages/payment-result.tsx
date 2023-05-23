import { CaiKhungCoTitle } from '@/components/Layouts/components/CaiKhungCoTitle';
import ImageBackground from '@/components/imageBackground';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import { createContext, memo, useState } from 'react';

// #region Context
interface PaymentResultContextType {
  billInfor: any;
  productInfor: any;
}

const initSearchContext: PaymentResultContextType = {
  billInfor: [],
  productInfor: [],
};

const SearchContext =
  createContext<PaymentResultContextType>(initSearchContext);
// #endregion

const PaymentResult = () => {
  const theme = useTheme();

  const [isSuccess, setIsSuccess] = useState(true);

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
                  {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
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
          <Grid item xs={6}>
            <CaiKhungCoTitle title={'Hóa đơn của bạn'}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
                spacing={2}
              >
                <Grid item xs={6}>
                  <Typography
                    align="left"
                    variant="h3"
                    color={theme.palette.common.black}
                  >
                    Mã hóa đơn:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    align="right"
                    variant="h3"
                    color={theme.palette.common.black}
                  ></Typography>
                </Grid>
              </Grid>
            </CaiKhungCoTitle>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(PaymentResult);
