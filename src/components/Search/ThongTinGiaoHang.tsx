import formatPrice from '@/lib/utilities/formatCurrency';
import { Grid, Typography, useTheme } from '@mui/material';
import React, { memo, useContext } from 'react';
import { SearchContext } from '../../pages/search';

export const ThongTinGiaoHang = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);

  const {
    deli_StaffName,
    deli_StaffPhone,
    deli_StartAt,
    deli_EndAt,
    deli_State,
    deli_CustomerName,
    deli_CustomerPhone,
    deli_CustomerTime,
    deli_CustomerAddress,
    deli_CustomerNote,
  } = context.billInfor.deliveryDetail;

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
              Người giao hàng:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_StaffName}
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
              Số điện thoại:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_StaffPhone}
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
              Bắt đầu:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_StartAt}
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
              Kết thúc:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_EndAt}
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
                deli_State == 1
                  ? theme.palette.success.main
                  : deli_State == 0
                  ? theme.palette.error.main
                  : theme.palette.common.black
              }
            >
              {deli_State == 1
                ? 'Giao hàng thành công'
                : deli_State == 0
                ? 'Đang giao hàng'
                : 'Giao hàng thất bại'}
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
              Người nhận:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_CustomerName}
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
              Số điện thoại:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_CustomerPhone}
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
              Thời gian đặt giao:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_CustomerTime}
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
              Địa chỉ:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {deli_CustomerAddress}
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
              {deli_CustomerNote}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
