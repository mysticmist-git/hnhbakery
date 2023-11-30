import CustomButton from '@/components/buttons/CustomButton';
import { formatPrice } from '@/lib/utils';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import CustomTextField from '../../inputs/textFields/CustomTextField';
import RenderSale from '../RenderSale';
import { useState } from 'react';
import RenderSaleItem from '../RenderSale/RenderSaleItem';
import { useSnackbarService } from '@/lib/contexts';

export default function DonHangCuaBan(props: any) {
  const {
    tamTinh,
    khuyenMai,
    tongBill,
    Sales,
    TimKiemMaSale,
    showDeliveryPrice,
    handleChooseSale,
    chosenSale,
  } = props;
  const theme = useTheme();

  const [saleCode, setSaleCode] = useState('');
  const handleSnackbarAlert = useSnackbarService();
  return (
    <>
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'start'}
        spacing={1}
      >
        <Grid item xs={12}>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (saleCode === '') {
                handleSnackbarAlert('warning', 'Mã khuyến mãi đang trống!');
                return;
              }
              TimKiemMaSale(saleCode);
            }}
          >
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'start'}
              spacing={1}
            >
              <Grid item xs={true}>
                <CustomTextField
                  placeholder="Mã khuyến mãi"
                  fullWidth
                  type="text"
                  name="saleCode"
                  id="saleCode"
                  value={saleCode}
                  onChange={(e) => setSaleCode(e.target.value)}
                />
              </Grid>
              <Grid item xs={'auto'}>
                <CustomButton
                  type="submit"
                  sx={{
                    borderRadius: '8px',
                    py: '12px',
                    px: 3,
                  }}
                >
                  <Typography
                    variant="button"
                    color={theme.palette.common.white}
                  >
                    Sử dụng
                  </Typography>
                </CustomButton>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'start'}
            spacing={1}
          >
            {chosenSale && (
              <RenderSaleItem
                sale={chosenSale}
                chosenSale={chosenSale}
                handleChooseSale={handleChooseSale}
              />
            )}

            {/* <RenderSale
              Sales={Sales}
              chosenSale={chosenSale}
              handleChooseSale={handleChooseSale}
            />

            {Sales.length <= 0 && (
              <Typography
                variant="body2"
                color={theme.palette.text.secondary}
                sx={{
                  mt: 1,
                }}
              >
                Không tồn tại khuyến mãi công khai nào
              </Typography>
            )} */}

            <Grid item xs={12}>
              <Box
                component={'div'}
                sx={{
                  borderBottom: 1.5,
                  borderColor: theme.palette.text.secondary,
                  my: 0.5,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  variant="body1"
                  color={theme.palette.text.secondary}
                >
                  Tạm tính
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                  }}
                  color={theme.palette.common.black}
                >
                  {formatPrice(tamTinh, ' đồng')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  variant="body1"
                  color={theme.palette.text.secondary}
                >
                  Phí vận chuyển
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                  }}
                  color={theme.palette.common.black}
                >
                  {formatPrice(showDeliveryPrice, ' đồng')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  variant="body1"
                  color={theme.palette.text.secondary}
                >
                  Khuyến mãi
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                  }}
                  color={theme.palette.common.black}
                >
                  {formatPrice(-1 * khuyenMai, ' đồng')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
                sx={{
                  borderBottom: 1.5,
                  borderColor: theme.palette.text.secondary,
                  my: 0.5,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  variant="body1"
                  color={theme.palette.text.secondary}
                >
                  Tổng hóa đơn
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                  }}
                  color={theme.palette.secondary.main}
                >
                  {formatPrice(tongBill, ' đồng')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
