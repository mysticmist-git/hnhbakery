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

//#region Hóa đơn của bạn
const CustomAccordion = memo((props: any) => {
  const theme = useTheme();
  const heading = props.heading;
  const Content = props.content;
  return (
    <Accordion
      sx={{
        '&.MuiPaper-root': {
          backgroundColor: 'transparent',
          borderRadius: '8px',
          boxShadow: 'none',
        },
        width: '100%',
      }}
      disableGutters
      defaultExpanded
    >
      <AccordionSummary
        sx={{
          bgcolor: theme.palette.secondary.main,
          borderRadius: '8px 8px 0px 0px',
        }}
        expandIcon={
          <ExpandMoreIcon sx={{ color: theme.palette.common.white }} />
        }
      >
        <Typography variant="button" color={theme.palette.common.white}>
          {heading}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          bgcolor: theme.palette.common.white,
          border: 3,
          borderTop: 0,
          borderColor: theme.palette.secondary.main,
          borderRadius: '0 0 8px 8px',
          p: 0,
          overflow: 'hidden',
        }}
      >
        <Content />
      </AccordionDetails>
    </Accordion>
  );
});

const CustomAccordionItem = memo((props: any) => {
  const theme = useTheme();
  const heading = props.heading;
  const Content = props.content;
  return (
    <Accordion
      sx={{
        '&.MuiPaper-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        width: '100%',
      }}
      disableGutters
      defaultExpanded={props.defaultExpanded}
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
        <Typography variant="button" color={theme.palette.common.black}>
          {heading}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          bgcolor: theme.palette.common.white,
        }}
      >
        <Content />
      </AccordionDetails>
    </Accordion>
  );
});

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
        {context.billInfor.map((item: any, i: number) =>
          item.valid ? (
            <CustomAccordionItem
              key={i}
              heading={item.heading}
              content={item.content}
              defaultExpanded={item.isOpen ? true : false}
            />
          ) : (
            <></>
          ),
        )}
      </Grid>
    </Grid>
  );
});

const ChiTietHoaDon = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);
  const heading_value = 'billDetail';
  return (
    <Grid container direction={'row'} justifyContent={'center'} spacing={1}>
      {context.billInfor
        .find((item: any) => item.heading_value === heading_value)
        .items.map((item: any, i: number) => (
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
    </Grid>
  );
});

const ThongTinGiaoHang = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);
  const heading_value = 'delivery';
  return (
    <Grid container direction={'row'} justifyContent={'center'} spacing={1}>
      {context.billInfor
        .find((item: any) => item.heading_value === heading_value)
        .items.map((item: any, i: number) => (
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
    </Grid>
  );
});

const ThongTinKhuyenMai = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);
  const heading_value = 'sale';
  const saleInfor = context.billInfor.find(
    (item: any) => item.heading_value === heading_value,
  );

  const imageHeight = '240px';

  return (
    <Grid container direction={'row'} justifyContent={'center'} spacing={1}>
      <Grid item xs={12} height={imageHeight}>
        <Box
          height={'100%'}
          width={'100%'}
          component={'img'}
          loading="lazy"
          alt=""
          src={saleInfor.image}
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
          {saleInfor.name}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography
          align="center"
          variant="button"
          color={theme.palette.secondary.main}
        >
          {saleInfor.description}
        </Typography>
      </Grid>

      {saleInfor.items.map((item: any, i: number) => (
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
    </Grid>
  );
});

const initBillInfor = [
  {
    heading: 'Chi tiết hóa đơn',
    heading_value: 'billDetail',
    content: ChiTietHoaDon,
    valid: true,
    isOpen: true,
    items: [
      {
        heading: 'Mã hóa đơn:',
        content: 'GUEST-123',
      },
      {
        heading: 'Trạng thái:',
        content: 'Thanh toán thành công',
        color: 'success',
      },
      {
        isDivider: true,
      },
      {
        heading: 'Hình thức thanh toán:',
        content: 'MoMo',
      },
      {
        heading: 'Thời gian thanh toán:',
        content: '07:30 07/01/2023',
      },
      {
        heading: 'Ghi chú:',
        content: 'Giảm 50% đường các loại bánh.',
      },
      {
        isDivider: true,
      },
      {
        heading: 'Tổng tiền:',
        content: 1000000,
      },
      {
        heading: 'Khuyến mãi:',
        content: -500000,
      },
      {
        isDivider: true,
      },
      {
        heading: 'Thành tiền:',
        content: 500000,
      },
    ],
  },
  {
    heading: 'Thông tin giao hàng',
    heading_value: 'delivery',
    content: ThongTinGiaoHang,
    valid: true,
    items: [
      {
        heading: 'Người giao hàng:',
        content: 'Terisa',
      },
      {
        heading: 'Số điện thoại:',
        content: '0343214971',
      },
      {
        heading: 'Bắt đầu:',
        content: '07:30 07/01/2023',
      },
      {
        heading: 'Kết thúc:',
        content: '07:55 07/01/2023',
      },
      {
        heading: 'Trạng thái:',
        content: 'Giao hàng thành công',
        color: 'success',
      },
      {
        isDivider: true,
      },
      {
        heading: 'Người nhận:',
        content: 'Trường Huy',
      },
      {
        heading: 'Số điện thoại:',
        content: '0343214971',
      },
      {
        heading: 'Thời gian đặt giao:',
        content: '08:00 07/01/2023',
      },
      {
        heading: 'Địa chỉ:',
        content:
          '157 Đ. Nguyễn Chí Thanh, Phường 12, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
      },
      {
        heading: 'Ghi chú:',
        content: 'Tới nơi nhấn chuông hoặc liên lạc qua SDT',
      },
    ],
  },
  {
    heading: 'Thông tin khuyến mãi',
    heading_value: 'sale',
    content: ThongTinKhuyenMai,
    valid: true,
    image: bfriday.src,
    name: 'SALE BLACK FRIDAY',
    description: 'Giảm 50%, tối đa 500,000 đ',
    items: [
      {
        heading: 'Mã code:',
        content: 'BFD',
      },
      {
        heading: 'Thời gian áp dụng:',
        content: '06/01/2023 - 07/01/2023',
      },
      {
        heading: 'Mô tả:',
        content:
          'Thứ Sáu Đen là tên gọi không chính thức cho ngày thứ sáu sau Lễ Tạ Ơn và được coi là ngày mở hàng cho mùa mua sắm Giáng sinh của Mỹ.',
      },
    ],
  },
];
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
        {context.productInfor.map((item: any, i: number) => (
          <Accordion
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
                <CustomButton
                  children={() => (
                    <Link href={item.product.href}>
                      <Typography
                        variant="button"
                        color={theme.palette.common.white}
                      >
                        Xem chi tiết
                      </Typography>
                    </Link>
                  )}
                />
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
export interface SearchContextType {
  billInfor: any;
  productInfor: any;
}

const initSearchContext: SearchContextType = {
  billInfor: [],
  productInfor: [],
};

export const SearchContext =
  createContext<SearchContextType>(initSearchContext);
// #endregion

const Search = () => {
  const theme = useTheme();
  const styles = {
    gridDesktop: { display: { xs: 'none', lg: 'block' } },
    gridPhone: { display: { xs: 'block', lg: 'none' } },
  };

  const [billInforState, setBillInforState] = useState<any>(initBillInfor);
  const [productInforState, setProductInforState] =
    useState<any>(initProductInfor);

  return (
    <SearchContext.Provider
      value={{
        billInfor: billInforState,
        productInfor: productInforState,
      }}
    >
      <Box>
        <ImageBackground
          children={() => (
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
                <Link href="#">
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
          )}
        />

        <Box sx={{ py: 8, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
          <Typography
            align="center"
            variant="h1"
            color={theme.palette.secondary.main}
          >
            Tìm kiếm và tra cứu
          </Typography>
          <Typography
            align="center"
            variant="body2"
            color={theme.palette.common.black}
          >
            Tìm kiếm loại bánh, tên bánh, mã hóa đơn, các chính sách, điều khoản
            dịch vụ, …
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
                fullWidth
                placeholder="Loại bánh, tên bánh, mã hóa đơn,..."
                type="email"
              />
            </Grid>
            <Grid item>
              <CustomButton
                sx={{ height: '100%', borderRadius: '8px', py: 1.5, px: 3 }}
                children={() => (
                  <Typography variant="button">Tìm kiếm</Typography>
                )}
              />
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
              <CustomAccordion
                heading="Hóa đơn của bạn"
                content={ListBillItem}
              />
            </Grid>
            <Grid item md={8} xs={12}>
              <CustomAccordion
                heading="Danh sách sản phẩm"
                content={ListProductItem}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SearchContext.Provider>
  );
};

export default memo(Search);
