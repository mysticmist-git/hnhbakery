import { formatPrice } from '@/lib/utils';
import { CustomLinearProgres } from '@/pages/manager/orders';
import { Checkbox, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridLogicOperator,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react';
import {
  All_All_All,
  All_All_So,
  All_So_All,
  All_So_So,
  So_So_So,
} from '../HamXuLy/HamXuLy';
import ReportTableRow from '@/models/report';
import Batch from '@/models/batch';
import { SanPhamDoanhThuType } from '@/pages/manager/reports';

export type dataRow = {
  id: string;
  time: string;
  numberBills: number;
  numberProducts: number;
  numberSales: number;
  revenue: number;
  realRevenue: number;
  percentage: number;
};

export default function ReportTable({
  reportData,
  reportDate,
  handleRevenueChange,
  handleRealRevenueChange,
  handleSpDoanhThuChange,
  handleSpHaoHutChange,
}: {
  reportData: ReportTableRow;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThuType[]) => void;
  handleSpHaoHutChange: (value: SanPhamDoanhThuType[]) => void;
}) {
  const theme = useTheme();

  const [rows, setRows] = useState<dataRow[]>([]);

  const handle = useCallback(
    (batches_HaoHut: Batch[]) => {
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
    [handleSpHaoHutChange, reportData.productTypes]
  );

  useEffect(() => {
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
  }, [
    // handle,
    // handleRealRevenueChange,
    // handleRevenueChange,
    // handleSpDoanhThuChange,
    reportData,
    reportDate,
  ]);

  const columns: GridColDef[] = [
    {
      field: 'time',
      headerName: 'Mốc thời gian',
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'numberBills',
      headerName: 'Số đơn hàng',
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'numberProducts',
      headerName: 'Số sản phẩm',
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'numberSales',
      headerName: 'Số khuyến mãi',
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'revenue',
      headerName: 'Doanh thu',
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueFormatter: (params) => {
        return formatPrice(params.value);
      },
    },
    {
      field: 'percentage',
      headerName: 'Tỉ lệ',
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueFormatter: (params) => {
        return params.value + '%';
      },
    },
  ];
  return (
    <>
      <DataGrid
        rows={rows}
        rowHeight={64}
        loading={false}
        columns={columns}
        localeText={{
          toolbarFilters: 'Bộ lọc',
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 7 },
          },
        }}
        pageSizeOptions={[7, 10]}
        autoHeight
        slots={{
          loadingOverlay: CustomLinearProgres,
          baseCheckbox: (props: any) => {
            return <Checkbox color="secondary" {...props} />;
          },
          toolbar: () => {
            return (
              <>
                <GridToolbarContainer
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingY: 1,
                    paddingX: 3,
                  }}
                >
                  <GridToolbarQuickFilter placeholder="Tìm kiếm" />
                  <GridToolbarFilterButton />
                </GridToolbarContainer>
              </>
            );
          },
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
          baseButton: {
            sx: {
              color: theme.palette.common.black,
            },
          },
          filterPanel: {
            // Force usage of "And" operator
            logicOperators: [GridLogicOperator.And],
            // Display columns by ascending alphabetical order
            columnsSort: 'asc',
            filterFormProps: {
              // Customize inputs by passing props
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
              deleteIconProps: {
                sx: {
                  '& .MuiSvgIcon-root': { color: '#d32f2f' },
                },
              },
            },
            sx: {
              // Customize inputs using css selectors
              '& .MuiDataGrid-filterForm': { p: 2 },
              '& .MuiDataGrid-filterForm:nth-child(even)': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
              },
              '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
              '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormValueInput': { width: 200 },
            },
          },
        }}
      />
    </>
  );
}
