import banh1 from '@/assets/Carousel/3.jpg';
import bfriday from '@/assets/blackfriday.jpg';
import ImageBackground from '@/components/Imagebackground';
import CustomTextField from '@/components/Inputs/textFields/CustomTextField/CustomTextField';
import { ListBillItem, ListProductItem } from '@/components/Search';
import { CustomButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { getDocFromFirestore } from '@/lib/firestore';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import React, { createContext, memo, useState } from 'react';
import { CustomAccordionFrame } from '../components/accordions/CustomAccordionFrame/index';

const MSG_NOTIFY_EMPTY_SEARCH_TEXT =
  'Vui lòng nhập mã đơn hàng để tiến hành tìm kiếm';

const initBillInfor = {
  billDetail: {
    bill_Id: 'GUEST-123',
    bill_State: 1, //1:Thanh toán thành công, 0: Chờ thanh toán, -1:Hủy đơn hàng
    bill_HinhThucThanhToan: 'MoMo',
    bill_PaymentTime: '07:30 07/01/2023',
    bill_Note: 'Giảm 50% đường các loại bánh.',
    bill_TongTien: 1000000,
    bill_KhuyenMai: 500000,
    bill_ThanhTien: 500000,
  },
  deliveryDetail: {
    deli_StaffName: 'Terisa',
    deli_StaffPhone: '0343214971',
    deli_StartAt: '07:30 07/01/2023',
    deli_EndAt: '07:55 07/01/2023',
    deli_State: 1, //1:Giao thành công, 0: Đang giao, -1: Giao thất bại
    deli_CustomerName: 'Trường Huy',
    deli_CustomerPhone: '0343214971',
    deli_CustomerTime: '08:00 07/01/2023',
    deli_CustomerAddress:
      '157 Đ. Nguyễn Chí Thanh, Phường 12, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
    deli_CustomerNote: 'Tới nơi nhấn chuông hoặc liên lạc qua SDT',
  },
  saleDetail: {
    sale_Id: '123',
    sale_Name: 'SALE BLACK FRIDAY',
    sale_Code: 'BFD',
    sale_Percent: 5,
    sale_MaxSalePrice: 500000,
    sale_Description:
      'Thứ Sáu Đen là tên gọi không chính thức cho ngày thứ sáu sau Lễ Tạ Ơn và được coi là ngày mở hàng cho mùa mua sắm Giáng sinh của Mỹ.',
    sale_StartAt: '06/01/2023',
    sale_EndAt: '07/01/2023',
    sale_Image: bfriday.src,
  },
};
const initProductInfor = [
  {
    bill_ProductDetail: {
      size: 'lớn',
      material: 'dâu',
      amount: 100,
      price: 150000,
      discount: 30,
      discountPrice: 105000, //price* (1-discount/100),
      MFG: '07/01/2023',
      EXP: '07/01/2023',
    },
    productDetail: {
      name: 'Croissant',
      image: banh1.src,
      price: 150000,
      type: 'Bánh mặn',
      state: 1, // 1:Còn hàng, 0:Hết hàng, -1: Ngưng bán
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
  },
  {
    bill_ProductDetail: {
      size: 'lớn',
      material: 'dâu',
      amount: 1,
      price: 150000,
      discount: 30,
      discountPrice: 105000, //price* (1-discount/100),
      MFG: '07/01/2023',
      EXP: '07/01/2023',
    },
    productDetail: {
      name: 'Croissant',
      image: banh1.src,
      price: 150000,
      type: 'Bánh mặn',
      state: 1, // 1:Còn hàng, 0:Hết hàng, -1: Ngưng bán
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
  },
];

// #region Context
interface SearchContextType {
  billInfor: any;
  productInfor: any;
}

const initSearchContext: SearchContextType = {
  billInfor: {},
  productInfor: [],
};

interface SearchPageBill {}

export const SearchContext =
  createContext<SearchContextType>(initSearchContext);
// #endregion

const Search = () => {
  //#region Hooks

  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [billInforState, setBillInforState] = useState<any>(initBillInfor);
  const [productInforState, setProductInforState] =
    useState<any>(initProductInfor);

  const [searchText, setSearchText] = useState<string>('');

  //#endregion

  // #region scroll

  const handleClick = () => {
    const top: number = 280;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  //#endregion

  //#region Handlers

  //#endregion

  //#region

  const handleProceedSearch: React.MouseEventHandler<
    HTMLAnchorElement
  > = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    console.log('Function running...');
    if (searchText === '') {
      handleSnackbarAlert('error', MSG_NOTIFY_EMPTY_SEARCH_TEXT);
      return;
    }

    const billId = searchText;

    try {
      const gottenBill = await getDocFromFirestore('bills', billId);

      console.log(gottenBill);
    } catch (error: any) {
      let message = '';
      switch (error.code) {
        case 'nul-doc':
          message = 'Không tìm thấy hóa đơn';
          break;
        default:
          message = 'Lỗi không biết';
          break;
      }
      handleSnackbarAlert('error', message);
    }
  };

  //#endregion

  return (
    <SearchContext.Provider
      value={{
        billInfor: billInforState,
        productInfor: productInforState,
      }}
    >
      <Box>
        <ImageBackground>
          <Grid
            sx={{ px: 6 }}
            height={'100%'}
            container
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item>
              <Link href="#" style={{ textDecoration: 'none' }}>
                <Typography
                  align="center"
                  variant="h1"
                  color={theme.palette.primary.main}
                  sx={{
                    '&:hover': {
                      color: theme.palette.common.white,
                    },
                  }}
                >
                  Tìm kiếm
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </ImageBackground>

        <Box
          sx={{
            pt: 6,
            pb: 12,
            px: { xs: 2, sm: 2, md: 4, lg: 8 },
            overflow: 'visible',
          }}
        >
          <Typography
            align="center"
            variant="h1"
            color={theme.palette.secondary.main}
            overflow={'visible'}
            sx={{
              pt: 1.5,
            }}
          >
            Tìm kiếm và tra cứu
          </Typography>
          <Typography
            align="center"
            variant="body2"
            color={theme.palette.common.black}
          >
            Tìm kiếm hóa đơn, theo dõi đơn hàng, …
          </Typography>
          <Grid
            sx={{
              pt: 4,
            }}
            container
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={1}
          >
            <Grid item xs={true}>
              <CustomTextField
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchText(e.target.value)
                }
                onClick={handleClick}
                fullWidth
                placeholder="Mã hóa đơn, chính sách đổi trả, chính sách bảo mật, điều khoản dịch vụ,..."
                type="text"
              />
            </Grid>
            <Grid item>
              <CustomButton
                sx={{ height: '100%', borderRadius: '8px', py: 1.5, px: 3 }}
                onClick={handleProceedSearch}
              >
                <Typography variant="button">Tìm kiếm</Typography>
              </CustomButton>
            </Grid>
          </Grid>
          <Grid
            sx={{
              pt: 4,
            }}
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'start'}
            spacing={4}
          >
            <Grid item md={4} xs={12}>
              <CustomAccordionFrame
                heading="Hóa đơn của bạn"
                children={ListBillItem}
              />
            </Grid>
            <Grid item md={8} xs={12}>
              <CustomAccordionFrame
                heading="Danh sách sản phẩm"
                children={ListProductItem}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SearchContext.Provider>
  );
};

export default memo(Search);
