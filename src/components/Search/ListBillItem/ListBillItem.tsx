import CustomAccordionItem from '@/components/accordions/CustomAccordionItem';
import { SearchContext } from '@/lib/contexts/search';
import { Grid, useTheme } from '@mui/material';
import React, { memo, useContext } from 'react';
import ChiTietHoaDon from '../ChiTietHoaDon';
import ThongTinKhuyenMai from '../ThongTinKhuyenMai';

const ListBillItem = () => {
  const theme = useTheme();

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
          defaultExpanded={true}
        >
          <ChiTietHoaDon />
        </CustomAccordionItem>
        {/* <CustomAccordionItem
          heading={'Thông tin giao hàng'}
          children={ThongTinGiaoHang}
          defaultExpanded={true}
        /> */}
        <CustomAccordionItem
          heading={'Thông tin khuyến mãi'}
          defaultExpanded={true}
        >
          <ThongTinKhuyenMai />
        </CustomAccordionItem>
      </Grid>
    </Grid>
  );
};

export default memo(ListBillItem);
