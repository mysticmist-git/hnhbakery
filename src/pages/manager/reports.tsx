import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import {
  ChonNgayThangNam,
  ReportTable,
  SanPhamDoanhThu as SanPhamDoanhThu_Component,
  SanPhamHaoHut,
} from '@/components/report';
import { getAddress } from '@/lib/DAO/addressDAO';
import { getBatchById, getBatches } from '@/lib/DAO/batchDAO';
import { getBillTableRows, getBills } from '@/lib/DAO/billDAO';
import { getBillItems } from '@/lib/DAO/billItemDAO';
import { getDeliveryById } from '@/lib/DAO/deliveryDAO';
import { getFeedbacks } from '@/lib/DAO/feedbackDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import {
  getPaymentMethodById,
  getPaymentMethods,
} from '@/lib/DAO/paymentMethodDAO';
import { getProduct, getProducts } from '@/lib/DAO/productDAO';
import {
  getProductTypeById,
  getProductTypeTableRows,
  getProductTypes,
} from '@/lib/DAO/productTypeDAO';
import { getSaleById, getSales } from '@/lib/DAO/saleDAO';
import { getUsers } from '@/lib/DAO/userDAO';
import { getVariant, getVariants } from '@/lib/DAO/variantDAO';
// import { COLLECTION_NAME } from '@/lib/constants';
// import { getCollection } from '@/lib/firestore';
// import {
//   BatchObject,
//   BillDetailObject,
//   BillObject,
//   DeliveryObject,
//   FeedbackObject,
//   PaymentObject,
//   ProductObject,
//   SaleObject,
//   SuperDetail_ReportObject,
// } from '@/lib/models';
import { formatPrice } from '@/lib/utils';
import Batch from '@/models/batch';
import { BillTableRow } from '@/models/bill';
import PaymentMethod from '@/models/paymentMethod';
import { ProductTableRow } from '@/models/product';
import { ProductTypeTableRow } from '@/models/productType';
import ReportTableRow from '@/models/report';
import Sale from '@/models/sale';
import { SearchRounded } from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export type SanPhamDoanhThuType = Batch & {
  revenue: number;
  percentage: number;
  product: ProductTableRow;
};

const Report = () => {
  const [reportData, setReportData] = useState<ReportTableRow>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalData: ReportTableRow = {};

        const billTableRows: BillTableRow[] = await getBillTableRows();

        const productTypeTableRows: ProductTypeTableRow[] =
          await getProductTypeTableRows();

        const batches: Batch[] = await getBatches();

        const sales: Sale[] = await getSales();
        const paymentMethods: PaymentMethod[] = await getPaymentMethods();

        finalData.productTypes = productTypeTableRows;
        finalData.bills = billTableRows;
        finalData.batches = batches;
        finalData.sales = sales;
        finalData.paymentMethods = paymentMethods;

        setReportData(() => finalData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const [reportDate, setReportDate] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const handleReportDateChange = (
    day = 0,
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear()
  ) => {
    setReportDate(() => {
      return {
        day,
        month,
        year,
      };
    });
  };

  const [revenue, setRevenue] = useState(0);
  const handleRevenueChange = (value: number) => {
    setRevenue(() => value);
  };

  const [realRevenue, setRealRevenue] = useState(0);
  const handleRealRevenueChange = (value: number) => {
    setRealRevenue(() => value);
  };

  const [spDoanhThu, setSpDoanhThu] = useState<SanPhamDoanhThuType[]>([]);
  const handleSpDoanhThuChange = (value: SanPhamDoanhThuType[]) => {
    setSpDoanhThu(() => value);
  };
  const [spDoanhThuSearch, setSpDoanhThuSearch] = useState('');

  const [spHaoHut, setSpHaoHut] = useState<SanPhamDoanhThuType[]>([]);
  const handleSpHaoHutChange = (value: SanPhamDoanhThuType[]) => {
    setSpHaoHut(() => value);
  };
  const [spHaoHutSearch, setSpHaoHutSearch] = useState('');

  const theme = useTheme();
  const StyleCuaCaiBox = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: 1,
    borderColor: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    opacity: 0.8,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      opacity: 1,
      boxShadow: 10,
    },
  };
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };
  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'start'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Báo cáo doanh thu
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            {reportData && (
              <ChonNgayThangNam
                reportData={reportData}
                reportDate={reportDate}
                handleReportDateChange={handleReportDateChange}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                mx: 2,
                p: 2,
                boxShadow: 3,
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: theme.palette.secondary.main,
              }}
            >
              <Typography variant="body2" color={theme.palette.common.white}>
                Tổng doanh thu:
              </Typography>
              <Typography variant="button" color={theme.palette.common.white}>
                {formatPrice(revenue)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                mx: 2,
                p: 2,
                boxShadow: 3,
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: theme.palette.success.main,
              }}
            >
              <Typography variant="body2" color={theme.palette.common.white}>
                Doanh thu thật sự:
              </Typography>
              <Typography variant="button" color={theme.palette.common.white}>
                {formatPrice(realRevenue)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              align="right"
              variant="body2"
              color={theme.palette.text.secondary}
              sx={{ fontStyle: 'italic' }}
            >
              *Doanh thu thực sự = Tổng doanh thu - Tổng tiền khuyến mãi
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {reportData && (
              <ReportTable
                reportData={reportData}
                reportDate={reportDate}
                handleRevenueChange={handleRevenueChange}
                handleRealRevenueChange={handleRealRevenueChange}
                handleSpDoanhThuChange={handleSpDoanhThuChange}
                handleSpHaoHutChange={handleSpHaoHutChange}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} lg={12}>
            <Box
              sx={{
                ...StyleCuaCaiBox,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="button" color={theme.palette.common.black}>
                  Sản phẩm bán được
                </Typography>
                <Box>
                  <Outlined_TextField
                    size="small"
                    textStyle={textStyle}
                    label={''}
                    onChange={(e: any) => {
                      setSpDoanhThuSearch(() => e.target.value);
                    }}
                    placeholder="Tìm kiếm"
                    InputProps={{
                      readOnly: false,
                      style: {
                        pointerEvents: 'auto',
                        borderRadius: '8px',
                      },
                      endAdornment: true && (
                        <InputAdornment position="end">
                          <CustomIconButton edge="end" disabled>
                            <SearchRounded fontSize="small" />
                          </CustomIconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  justifyContent: 'flex-start',
                  overflow: 'auto',
                  height: '250px',
                }}
              >
                <SanPhamDoanhThu_Component
                  spDoanhThu={spDoanhThu}
                  spDoanhThuSearch={spDoanhThuSearch}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Box
              sx={{
                ...StyleCuaCaiBox,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="button" color={theme.palette.common.black}>
                  Sản phẩm hao hụt
                </Typography>
                <Box>
                  <Outlined_TextField
                    size="small"
                    textStyle={textStyle}
                    label={''}
                    placeholder="Tìm kiếm"
                    onChange={(e: any) => {
                      setSpHaoHutSearch(e.target.value);
                    }}
                    InputProps={{
                      readOnly: false,
                      style: {
                        pointerEvents: 'auto',
                        borderRadius: '8px',
                      },
                      endAdornment: true && (
                        <InputAdornment position="end">
                          <CustomIconButton edge="end" disabled>
                            <SearchRounded fontSize="small" />
                          </CustomIconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  justifyContent: 'flex-start',
                  overflow: 'auto',
                  height: '250px',
                }}
              >
                <SanPhamHaoHut
                  spHaoHut={spHaoHut}
                  spHaoHutSearch={spHaoHutSearch}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Report;
