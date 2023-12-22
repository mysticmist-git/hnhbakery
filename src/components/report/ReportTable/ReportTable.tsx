import { formatPrice } from '@/lib/utils';
import Batch from '@/models/batch';
import ReportTableRow from '@/models/report';
import { CustomLinearProgres } from '@/pages/manager/orders';
import { SanPhamDoanhThuType } from '@/pages/manager/reports';
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

type ReportTableProps = {
  rows: dataRow[];
};

export default function ReportTable({ rows }: ReportTableProps) {
  const theme = useTheme();

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
