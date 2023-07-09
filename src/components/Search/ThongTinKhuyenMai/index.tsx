import { formatPrice } from '@/lib/utils';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import React, { memo, useContext } from 'react';
import { SearchContext } from '../../../pages/search';

const ThongTinKhuyenMai = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);
  const imageHeight = '240px';

  const {
    sale_Id,
    sale_Name,
    sale_Code,
    sale_Percent,
    sale_MaxSalePrice,
    sale_Description,
    sale_StartAt,
    sale_EndAt,
    sale_Image,
  } = context.billInfor.saleDetail;

  return (
    <Grid container direction={'row'} justifyContent={'center'} spacing={1}>
      <Grid item xs={12} height={imageHeight}>
        <Box
          height={'100%'}
          width={'100%'}
          component={'img'}
          loading="lazy"
          alt=""
          src={sale_Image}
          sx={{
            objectFit: 'cover',
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          borderBottom: '1.5px solid',
          borderColor: theme.palette.text.secondary,
          my: 1.5,
        }}
      ></Grid>

      <Grid item xs={12}>
        <Typography
          align="center"
          variant="body1"
          color={theme.palette.secondary.main}
        >
          {sale_Name}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography
          align="center"
          variant="button"
          color={theme.palette.secondary.main}
        >
          {`Giảm ${sale_Percent}%, tối đa ${formatPrice(sale_MaxSalePrice)}`}
        </Typography>
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
              Mã code:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {sale_Code}
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
              Thời gian áp dụng:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {sale_StartAt + ' - ' + sale_EndAt}
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
              Mô tả:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" color={theme.palette.common.black}>
              {sale_Description}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default ThongTinKhuyenMai;
