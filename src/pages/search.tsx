import {
  Box,
  Typography,
  Grid,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import React, { useState, createContext, useContext, memo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import banh1 from '../assets/Carousel/3.jpg';
import bfriday from '../assets/blackfriday.jpg';
import formatPrice from '@/utilities/formatCurrency';
import ImageBackground from '@/components/imageBackground';
import CustomTextField from '@/components/Inputs/CustomTextField';
import { CustomButton } from '@/components/Inputs/Buttons';
import { CustomAccordionFrame } from '../components/Layouts/components/CustomAccordionFrame';
import { useSnackbarService } from '@/lib/contexts';
import { getDocFromFirestore } from '@/lib/firestore/firestoreLib';
import { FirebaseError } from 'firebase/app';
import { ListBillItem } from '../components/Search/ListBillItem';
import { ChiTietHoaDon } from '../components/Search/ChiTietHoaDon';
import { ThongTinGiaoHang } from '../components/Search/ThongTinGiaoHang';
import { ThongTinKhuyenMai } from '../components/Search/ThongTinKhuyenMai';

const MSG_NOTIFY_EMPTY_SEARCH_TEXT =
  'Vui lòng nhập mã đơn hàng để tiến hành tìm kiếm';

const initBillInfor = {
  billDetail: {
    bill_Id: 'GUEST-123',
    bill_State: 'Thanh toán thành công',
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
    deli_State: 'Giao hàng thành công',
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
    sale_Percent: 0.5,
    sale_MaxSalePrice: 500000,
    sale_Description:
      'Thứ Sáu Đen là tên gọi không chính thức cho ngày thứ sáu sau Lễ Tạ Ơn và được coi là ngày mở hàng cho mùa mua sắm Giáng sinh của Mỹ.',
    sale_StartAt: '06/01/2023',
    sale_EndAt: '07/01/2023',
    sale_Image: bfriday.src,
  },
};
//#endregion

//#region Danh sách sản phẩm
const ListProductItem = memo((props: any) => {
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
        {context.productInfor.map((item: any, index: number) => (
          <Accordion
            key={index}
            sx={{
              '&.MuiPaper-root': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
              width: '100%',
            }}
            disableGutters
            defaultExpanded={item.isOpen ? true : false}
          >
            <AccordionSummary
              sx={{
                bgcolor: theme.palette.primary.main,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.85,
                },
              }}
              expandIcon={
                <ExpandMoreIcon sx={{ color: theme.palette.text.secondary }} />
              }
            >
              <Grid container justifyContent={'center'} alignItems={'center'}>
                <Grid item xs="auto">
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={'inline'}
                  >
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        color={theme.palette.common.black}
                      >
                        {item.heading.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                      >
                        {item.heading.size} + {item.heading.material}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={true} pr={2}>
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Grid item xs={true}>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                        align="right"
                        noWrap
                      >
                        x {item.heading.amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={'auto'} pl={{ sm: 4, xs: 2 }}>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                      >
                        {formatPrice(item.heading.price)}/bánh
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                bgcolor: theme.palette.common.white,
              }}
            >
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                spacing={1}
              >
                <ProductContent content={item.content} />
                <Product item={item} />
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
});

const ProductContent = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);
  return (
    <>
      {props.content.map((item: any, i: number) => (
        <Grid key={i} item xs={12}>
          <Grid
            container
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{
              borderBottom: item.isDivider ? '1.5px solid' : 0,
              borderColor: item.isDivider
                ? theme.palette.text.secondary
                : 'transparent',
              my: item.isDivider ? 1.5 : 0,
            }}
          >
            <Grid item>
              <Typography variant="body2" color={theme.palette.common.black}>
                {item.heading}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="button"
                color={
                  item.color == 'success'
                    ? theme.palette.success.main
                    : theme.palette.common.black
                }
              >
                {typeof item.content === 'number'
                  ? formatPrice(item.content)
                  : item.content}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </>
  );
});

const Product = memo((props: any) => {
  const theme = useTheme();
  const item = props.item;
  return (
    <>
      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
          height={'auto'}
        >
          <Grid item xs={5} alignSelf={'stretch'}>
            <Box
              height={'100%'}
              width={'100%'}
              component={'img'}
              loading="lazy"
              alt=""
              src={item.product.image}
              sx={{
                objectFit: 'cover',
                borderRadius: '16px',
              }}
            />
          </Grid>
          <Grid item xs={7}>
            <Grid
              container
              justifyContent={'center'}
              alignItems={'center'}
              spacing={1}
              py={2}
            >
              <Grid item xs={12}>
                <Typography variant="h3" color={theme.palette.secondary.main}>
                  {item.product.name}
                </Typography>
              </Grid>

              {item.product.items.map((product_item: any, i: number) => (
                <Grid key={i} item xs={12}>
                  <Grid
                    container
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    sx={{
                      borderBottom: product_item.isDivider ? '1.5px solid' : 0,
                      borderColor: product_item.isDivider
                        ? theme.palette.text.secondary
                        : 'transparent',
                      my: product_item.isDivider ? 1.5 : 0,
                    }}
                  >
                    <Grid item>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                      >
                        {product_item.heading}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="button"
                        color={
                          product_item.color == 'success'
                            ? theme.palette.success.main
                            : theme.palette.common.black
                        }
                      >
                        {typeof product_item.content === 'number'
                          ? formatPrice(product_item.content)
                          : product_item.content}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12}>
                <CustomButton>
                  <Link
                    href={item.product.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography
                      variant="button"
                      color={theme.palette.common.white}
                    >
                      Xem chi tiết
                    </Typography>
                  </Link>
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
});

const initProductInfor = [
  {
    heading: {
      name: 'Bánh Croissant',
      size: 'Size lớn',
      material: 'Mức dâu',
      amount: 1,
      price: 150000,
    },
    isOpen: true,
    content: [
      {
        heading: 'Ngày sản xuất:',
        content: '07/01/2023',
      },
      {
        heading: 'Hạn sử dụng:',
        content: '07/01/2023',
      },
      {
        heading: 'Khuyến mãi:',
        content: 'Giảm 50.000 đồng (30%)/sản phẩm',
      },
      {
        heading: 'Thành tiền:',
        content: 200000,
      },
      {
        isDivider: true,
      },
    ],
    product: {
      name: 'Bánh Croissant',
      image: banh1.src,
      href: '#',
      items: [
        {
          heading: 'Giá tiền:',
          content: 150000,
        },
        {
          heading: 'Thương hiệu:',
          content: 'H&H',
        },
        {
          heading: 'Loại:',
          content: 'Bánh mặn',
        },
        {
          heading: 'Trạng thái:',
          content: 'Còn hàng',
          color: 'success',
        },
        {
          heading: 'Mô tả:',
          content:
            'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
        },
      ],
    },
  },
  {
    heading: {
      name: 'Bánh Croissant',
      size: 'Size lớn',
      material: 'Mức dâu',
      amount: 1,
      price: 150000,
    },
    isOpen: false,
    content: [
      {
        heading: 'Ngày sản xuất:',
        content: '07/01/2023',
      },
      {
        heading: 'Hạn sử dụng:',
        content: '07/01/2023',
      },
      {
        heading: 'Khuyến mãi:',
        content: 'Giảm 50.000 đồng (30%)/sản phẩm',
      },
      {
        heading: 'Thành tiền:',
        content: 200000,
      },
      {
        isDivider: true,
      },
    ],
    product: {
      name: 'Bánh Croissant',
      image: banh1.src,
      href: '#',
      items: [
        {
          heading: 'Giá tiền:',
          content: 150000,
        },
        {
          heading: 'Thương hiệu:',
          content: 'H&H',
        },
        {
          heading: 'Loại:',
          content: 'Bánh mặn',
        },
        {
          heading: 'Trạng thái:',
          content: 'Còn hàng',
          color: 'success',
        },
        {
          heading: 'Mô tả:',
          content:
            'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
        },
      ],
    },
  },
];
//#endregion

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
            pt: 4,
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
