import formatPrice from '@/lib/utilities/formatCurrency';
import { Grid, Typography, useTheme } from '@mui/material';
import React, { memo, useContext } from 'react';
import { SearchContext } from '../../pages/search';

export const ChiTietHoaDon = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);
  const heading_value = 'billDetail';

  const {
    bill_Id,
    bill_State,
    bill_HinhThucThanhToan,
    bill_PaymentTime,
    bill_Note,
    bill_TongTien,
    bill_KhuyenMai,
    bill_ThanhTien,
  } = context.billInfor.billDetail;
  return (
    <Grid container direction={'row'} justifyContent={'center'} spacing={1}>
      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Mã hóa đơn:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {bill_Id}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Trạng thái:
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="button"
              color={
                bill_State == 1
                  ? theme.palette.success.main
                  : bill_State == 0
                  ? theme.palette.error.main
                  : theme.palette.common.black
              }
            >
              {bill_State == 1
                ? 'Thanh toán thành công'
                : bill_State == 0
                ? 'Chờ thanh toán'
                : 'Hủy đơn hàng'}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{
            borderBottom: '1.5px solid',
            borderColor: theme.palette.text.secondary,
            my: 1.5,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Hình thức thanh toán:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {bill_HinhThucThanhToan}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Thời gian thanh toán:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {bill_PaymentTime}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Ghi chú:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {bill_Note}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{
            borderBottom: '1.5px solid',
            borderColor: theme.palette.text.secondary,
            my: 1.5,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Tổng tiền:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {formatPrice(bill_TongTien)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Khuyến mãi:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {formatPrice(-1 * bill_KhuyenMai)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{
            borderBottom: '1.5px solid',
            borderColor: theme.palette.text.secondary,
            my: 1.5,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Thành tiền:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {formatPrice(bill_ThanhTien)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
