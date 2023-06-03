import { Grid, useTheme } from '@mui/material';
import React, { useContext, memo } from 'react';
import { CustomAccordionItem } from '../Layouts/components/CustomAccordionItem';
import { SearchContext } from '../../pages/search';
import { ChiTietHoaDon } from './ChiTietHoaDon';
import { ThongTinGiaoHang } from './ThongTinGiaoHang';
import { ThongTinKhuyenMai } from './ThongTinKhuyenMai';

export const ListBillItem = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);

  return (
    <Grid
      container
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      width={'100%'}
    >
      <Grid item width={'100%'} sx={{ bgcolor: theme.palette.common.black }}>
        <CustomAccordionItem
          heading={'Chi tiết hóa đơn'}
          children={ChiTietHoaDon}
          defaultExpanded={true}
        />
        <CustomAccordionItem
          heading={'Thông tin giao hàng'}
          children={ThongTinGiaoHang}
          defaultExpanded={false}
        />
        <CustomAccordionItem
          heading={'Thông tin khuyến mãi'}
          children={ThongTinKhuyenMai}
          defaultExpanded={false}
        />
      </Grid>
    </Grid>
  );
});
