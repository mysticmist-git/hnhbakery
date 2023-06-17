import formatPrice from '@/lib/utilities/formatCurrency';
import { Grid, Typography, useTheme } from '@mui/material';
import React, { memo, useContext } from 'react';
import { SearchContext } from '../../pages/search';

export const ProductContent = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);
  const item = props.item;
  return (
    <>
      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Typography variant="body2" color={theme.palette.common.black}>
              Ngày sản xuất:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {item.bill_ProductDetail.MFG}
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
              Hạn sử dụng:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {item.bill_ProductDetail.EXP}
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
              {`Giảm ${formatPrice(
                (item.bill_ProductDetail.price *
                  item.bill_ProductDetail.discount) /
                  100
              )} (${item.bill_ProductDetail.discount}%)/sản phẩm`}
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
              Thành tiền:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {formatPrice(
                item.bill_ProductDetail.discountPrice *
                  item.bill_ProductDetail.amount
              )}
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
        ></Grid>
      </Grid>
    </>
  );
});
