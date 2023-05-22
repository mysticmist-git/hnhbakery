import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import CustomTextField from '../Inputs/CustomTextField';
import { CustomButton } from '../Inputs/Buttons';
import formatPrice from '@/utilities/formatCurrency';
import { RenderSale } from './RenderSale';

export function DonHangCuaBan(props: any) {
  const { totalBill, Sales, TimKiemMaSale, showDeliveryPrice } = props;
  const theme = useTheme();
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
          <Box component="form" noValidate onSubmit={TimKiemMaSale}>
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
                  children={() => (
                    <Typography
                      variant="button"
                      color={theme.palette.common.white}
                    >
                      Sử dụng
                    </Typography>
                  )}
                />
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
            <RenderSale Sales={Sales} />

            <Grid item xs={12}>
              <Box
                sx={{
                  borderBottom: 1.5,
                  borderColor: theme.palette.text.secondary,
                  my: 0.5,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
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
                  {formatPrice(totalBill)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
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
                  {showDeliveryPrice ? formatPrice(20000) : formatPrice(0)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
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
                  {formatPrice(-100000)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  borderBottom: 1.5,
                  borderColor: theme.palette.text.secondary,
                  my: 0.5,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
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
                  {formatPrice(100000)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
