import {
  Box,
  Typography,
  alpha,
  Grid,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import React, { useState, createContext, useContext } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import banh1 from '../assets/Carousel/3.jpg';
import bfriday from '../assets/blackfriday.jpg';
import formatPrice from '@/utilities/formatCurrency';
import Skeleton_img from '@/components/skeleton_img';
import ImageBackground from '@/components/imageBackground';
import CustomTextField from '@/components/CustomTextField';
import CustomButton from '@/components/customButton';

//#region Hóa đơn của bạn
function CustomAccordion(props: any) {
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
}

function CustomAccordionItem(props: any) {
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
}

function ListBillItem(props: any) {
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
}

function ChiTietHoaDon(props: any) {
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
}

function ThongTinGiaoHang(props: any) {
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
}

function ThongTinKhuyenMai(props: any) {
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
}

interface BillInforItem {
  isDivider?: boolean;
  heading?: string;
  content?: string | number;
  color?: string;
}

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

// #region Context
export interface SearchContextType {
  billInfor: any;
}

const initSearchContext: SearchContextType = {
  billInfor: [],
};

export const SearchContext =
  createContext<SearchContextType>(initSearchContext);
// #endregion

export default function Search() {
  const theme = useTheme();
  const styles = {
    gridDesktop: { display: { xs: 'none', lg: 'block' } },
    gridPhone: { display: { xs: 'block', lg: 'none' } },
  };

  const [billInforState, setBillInforState] = useState<any>(initBillInfor);

  return (
    <SearchContext.Provider
      value={{
        billInfor: billInforState,
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
                <a href="#">
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
                </a>
              </Grid>
            </Grid>
          )}
        />

        <Box sx={{ pt: 8, px: { md: 8, xs: 3 } }}>
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
                placeholder="Loại bánh, tên bánh, mã hóa đơn,..."
                type="email"
              />
            </Grid>
            <Grid item>
              <CustomButton
                sx={{ height: '100%', borderRadius: '8px', py: '12px', px: 3 }}
                children={() => (
                  <Typography variant="button">Đăng ký</Typography>
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
              {/*  */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SearchContext.Provider>
  );
}
