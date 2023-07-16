import { SearchContext } from '@/lib/contexts/search';
import { Grid, useTheme } from '@mui/material';
import React, { memo, useContext } from 'react';
import { CustomAccordionItem } from '../../accordions/CustomAccordionItem/CustomAccordionItem';
import ChiTietHoaDon from '../ChiTietHoaDon/ChiTietHoaDon';
import ThongTinGiaoHang from '../ThongTinGiaoHang/ThongTinGiaoHang';
import ThongTinKhuyenMai from '../ThongTinKhuyenMai/ThongTinKhuyenMai';

const ListBillItem = memo((props: any) => {
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
        {/* <CustomAccordionItem
          heading={'Thông tin giao hàng'}
          children={ThongTinGiaoHang}
          defaultExpanded={true}
        /> */}
        <CustomAccordionItem
          heading={'Thông tin khuyến mãi'}
          children={ThongTinKhuyenMai}
          defaultExpanded={true}
        />
      </Grid>
    </Grid>
  );
});

export default ListBillItem;
