import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import {
  ChonNgayThangNam,
  ReportTable,
  SanPhamDoanhThu as SanPhamDoanhThu_Component,
  SanPhamHaoHut,
} from '@/components/report';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getBillTableRows } from '@/lib/DAO/billDAO';
import { getPaymentMethods } from '@/lib/DAO/paymentMethodDAO';
import { getProductTypeTableRows } from '@/lib/DAO/productTypeDAO';
import { getSales } from '@/lib/DAO/saleDAO';
import { formatPrice } from '@/lib/utils';
import Batch from '@/models/batch';
import { ProductTableRow } from '@/models/product';
import ReportTableRow from '@/models/report';
import { Preview, SearchRounded } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  All_All_All,
  All_All_So,
  All_So_All,
  All_So_So,
  So_So_So,
} from '@/components/report/HamXuLy/HamXuLy';
import { dataRow } from '@/components/report/ReportTable/ReportTable';
import useBranches from '@/lib/hooks/useBranches';
import { BillTableRow } from '@/models/bill';
import Branch from '@/models/branch';
import {
  CategoryScale,
  Chart,
  ChartData,
  LineElement,
  LinearScale,
  PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

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
  //#region mode: DoanhThu or HangHoa

  const [mode, setMode] = useState<'Revenue' | 'Product'>('Revenue');

  // Revenue Tab
  const [chartMode, setChartMode] = useState<'Revenue' | 'Bill'>('Revenue');

  //#endregion
  //#region Branches

  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  //#endregion
  //#region Data

  const [bills, setBills] = useState<BillTableRow[]>([]);
  const [reportData, setReportData] = useState<ReportTableRow>();
  const [reportDate, setReportDate] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (reportData) {
          setReportData((prev) => ({
            ...prev,
            bills: bills.filter(
              (bill) => !selectedBranch || bill.branch_id === selectedBranch.id
            ),
          }));
          return;
        }

        const finalData: ReportTableRow = {};

        const [
          billTableRows,
          productTypeTableRows,
          batches,
          sales,
          paymentMethods,
        ] = await Promise.all([
          await getBillTableRows(),
          await getProductTypeTableRows(),
          await getBatches(),
          await getSales(),
          await getPaymentMethods(),
        ]);

        finalData.productTypes = productTypeTableRows;
        finalData.bills = billTableRows.filter(
          (bill) => !selectedBranch || bill.branch_id === selectedBranch.id
        );
        finalData.batches = batches;
        finalData.sales = sales;
        finalData.paymentMethods = paymentMethods;

        setReportData(finalData);
        setBills(finalData.bills);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [bills, reportData, selectedBranch]);

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

  //#endregion
  //#region Styling

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

  //#endregion
  //#region Chart

  const [rows, setRows] = useState<dataRow[]>([]);

  const handle = useCallback(
    (batches_HaoHut: Batch[]) => {
      if (!reportData) {
        setRows([]);
        return;
      }
      var spHaoHut: SanPhamDoanhThuType[] = [];
      batches_HaoHut.forEach((batch) => {
        const productType = reportData.productTypes?.find(
          (item) => item.id == batch.product_type_id
        );
        const product = productType?.products?.find(
          (item) => item.id == batch.product_id
        );
        if (productType) {
          spHaoHut.push({
            ...batch,
            revenue: 0,
            percentage: 0,
            product: product!,
          });
        }
      });
      handleSpHaoHutChange(spHaoHut);
    },
    [reportData]
  );

  useEffect(() => {
    if (!reportData) {
      setRows([]);
      return;
    }

    const isDayAll = reportDate.day == 0;
    const isMonthAll = reportDate.month == 0;
    const isYearAll = reportDate.year == 0;

    if (isDayAll && isMonthAll && isYearAll) {
      // all - all - all
      setRows(() =>
        All_All_All({
          reportData,
          reportDate,
          handleRevenueChange,
          handleRealRevenueChange,
          handleSpDoanhThuChange,
        })
      );

      const batches_HaoHut = reportData.batches?.filter((batch) => {
        return new Date(batch.exp) <= new Date();
      });
      handle(batches_HaoHut ? batches_HaoHut : []);
    }

    if (isDayAll && !isMonthAll && isYearAll) {
      // all - số - all
      setRows(() =>
        All_So_All({
          reportData,
          reportDate,
          handleRevenueChange,
          handleRealRevenueChange,
          handleSpDoanhThuChange,
        })
      );

      const batches_HaoHut = reportData.batches?.filter((batch) => {
        return (
          new Date(batch.exp) <= new Date() &&
          new Date(batch.exp).getMonth() + 1 == reportDate.month
        );
      });
      handle(batches_HaoHut ? batches_HaoHut : []);
    }

    if (isDayAll && isMonthAll && !isYearAll) {
      // all - all - số
      setRows(() =>
        All_All_So({
          reportData,
          reportDate,
          handleRevenueChange,
          handleRealRevenueChange,
          handleSpDoanhThuChange,
        })
      );

      const batches_HaoHut = reportData.batches?.filter((batch) => {
        if (new Date() <= new Date(reportDate.year, 12, 0)) {
          return (
            new Date(batch.exp) <= new Date() &&
            new Date(batch.exp).getFullYear() == reportDate.year
          );
        } else {
          return new Date(batch.exp).getFullYear() == reportDate.year;
        }
      });
      handle(batches_HaoHut ? batches_HaoHut : []);
    }

    if (isDayAll && !isMonthAll && !isYearAll) {
      // all - số - số
      setRows(() =>
        All_So_So({
          reportData,
          reportDate,
          handleRevenueChange,
          handleRealRevenueChange,
          handleSpDoanhThuChange,
        })
      );

      const batches_HaoHut = reportData.batches?.filter((batch) => {
        if (new Date() <= new Date(reportDate.year, reportDate.month, 0)) {
          return (
            new Date(batch.exp) <= new Date() &&
            new Date(batch.exp).getMonth() + 1 == reportDate.month &&
            new Date(batch.exp).getFullYear() == reportDate.year
          );
        } else {
          return (
            new Date(batch.exp).getMonth() + 1 == reportDate.month &&
            new Date(batch.exp).getFullYear() == reportDate.year
          );
        }
      });
      handle(batches_HaoHut ? batches_HaoHut : []);
    }

    if (!isDayAll && !isMonthAll && !isYearAll) {
      // số - số - số
      setRows(() =>
        So_So_So({
          reportData,
          reportDate,
          handleRevenueChange,
          handleRealRevenueChange,
          handleSpDoanhThuChange,
        })
      );

      const batches_HaoHut = reportData.batches?.filter((batch) => {
        if (
          new Date() <=
          new Date(
            reportDate.year,
            reportDate.month,
            reportDate.day,
            23,
            59,
            59
          )
        ) {
          return (
            new Date(batch.exp) <= new Date() &&
            new Date(batch.exp).getDate() == reportDate.day &&
            new Date(batch.exp).getMonth() + 1 == reportDate.month &&
            new Date(batch.exp).getFullYear() == reportDate.year
          );
        } else {
          return (
            new Date(batch.exp).getDate() == reportDate.day &&
            new Date(batch.exp).getMonth() + 1 == reportDate.month &&
            new Date(batch.exp).getFullYear() == reportDate.year
          );
        }
      });
      handle(batches_HaoHut ? batches_HaoHut : []);
    }
  }, [handle, reportData, reportDate]);

  const chartData: ChartData<'line', number[], string> = useMemo(
    () => ({
      labels: rows.map((_, index) => (index + 1).toString()),
      datasets: [
        {
          label: 'Doanh thu',
          data: rows.map((row) =>
            chartMode === 'Revenue' ? row.realRevenue : row.numberBills
          ),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    }),
    [chartMode, rows]
  );

  //#endregion

  return (
    <>
      <Box
        component={'div'}
        width={'100%'}
        sx={{ p: 2, pr: 3, overflow: 'hidden' }}
      >
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
            <Button
              color="secondary"
              variant={mode === 'Revenue' ? 'contained' : 'outlined'}
              onClick={() => setMode('Revenue')}
              sx={{ mr: 1 }}
            >
              Doanh thu
            </Button>
            <Button
              color="secondary"
              variant={mode === 'Product' ? 'contained' : 'outlined'}
              onClick={() => setMode('Product')}
            >
              Hàng hóa
            </Button>
          </Grid>

          {mode === 'Revenue' && (
            <>
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
                <Autocomplete
                  value={selectedBranch}
                  onChange={(_, value) => setSelectedBranch(value)}
                  disablePortal
                  id="branches"
                  options={[null, ...branches]}
                  getOptionLabel={(o) => o?.name ?? 'Tất cả'}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Chi nhánh" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} lg={6}>
                <Box
                  component={'div'}
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
                  <Typography
                    variant="body2"
                    color={theme.palette.common.white}
                  >
                    Tổng doanh thu:
                  </Typography>
                  <Typography
                    variant="button"
                    color={theme.palette.common.white}
                  >
                    {formatPrice(revenue)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box
                  component={'div'}
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
                  <Typography
                    variant="body2"
                    color={theme.palette.common.white}
                  >
                    Doanh thu thật sự:
                  </Typography>
                  <Typography
                    variant="button"
                    color={theme.palette.common.white}
                  >
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
                <Button
                  variant="contained"
                  color={chartMode === 'Revenue' ? 'secondary' : 'primary'}
                  onClick={() => setChartMode('Revenue')}
                >
                  Doanh thu
                </Button>
                <Button
                  variant="contained"
                  color={chartMode === 'Bill' ? 'secondary' : 'primary'}
                  onClick={() => setChartMode('Bill')}
                >
                  Số đơn hàng
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Line data={chartData} />
              </Grid>
              <Grid item xs={12}>
                {reportData && <ReportTable rows={rows} />}
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} lg={12}>
                <Box
                  component={'div'}
                  sx={{
                    ...StyleCuaCaiBox,
                  }}
                >
                  <Box
                    component={'div'}
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
                    <Typography
                      variant="button"
                      color={theme.palette.common.black}
                    >
                      Sản phẩm bán được
                    </Typography>
                    <Box component={'div'}>
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
                    component={'div'}
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
                  component={'div'}
                  sx={{
                    ...StyleCuaCaiBox,
                  }}
                >
                  <Box
                    component={'div'}
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
                    <Typography
                      variant="button"
                      color={theme.palette.common.black}
                    >
                      Sản phẩm hao hụt
                    </Typography>
                    <Box component={'div'}>
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
                    component={'div'}
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
            </>
          )}

          {mode === 'Product' && <></>}
        </Grid>
      </Box>
    </>
  );
};

export default Report;
