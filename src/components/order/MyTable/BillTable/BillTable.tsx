import { formatDateString, formatPrice } from '@/lib/utils';
import { Box, Button, Checkbox, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridLogicOperator,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { CustomLinearProgres } from '../../../../pages/manager/orders';
import {
  BillTableRow,
  billStateColorParse,
  billStateContentParse,
} from '@/models/bill';

export default function BillTable({
  billsData,
  handleViewBill,
  handleViewBillModalState,
}: {
  billsData: BillTableRow[];
  handleViewBill: any;
  handleViewBillModalState: any;
}) {
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã đơn',
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
    },
    {
      field: 'created_at',
      headerName: 'Đặt lúc',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      valueFormatter: (params: any) => {
        return formatDateString(params.value);
      },
    },
    {
      field: 'final_price',
      headerName: 'Tổng tiền',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      valueFormatter: (params: any) => {
        return formatPrice(params.value, ' đ');
      },
      renderCell: (params) => {
        return (
          <Box
            component={'div'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 0.2,
            }}
          >
            {(params.row.sale_price > 0 || params.row.total_discount > 0) && (
              <span
                style={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(params.row.total_price, ' đ')}
              </span>
            )}

            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {formatPrice(params.value, ' đ')}
            </span>
          </Box>
        );
      },
    },
    {
      field: 'state',
      headerName: 'Trạng thái',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      valueFormatter: (params: any) => {
        return billStateContentParse(params.value);
      },
      renderCell: (params: any) => {
        return (
          <span
            style={{
              color: billStateColorParse(theme, params.value),
            }}
          >
            {billStateContentParse(params.value)}
          </span>
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      hideable: false,
      renderCell: (params) => {
        return (
          <Box component={'div'} sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                handleViewBill(params.row);
              }}
            >
              Chi tiết
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={params.row.state === 1 || params.row.state === -1}
              onClick={() => {
                handleViewBillModalState(params.row);
              }}
            >
              Hủy
            </Button>
          </Box>
        );
      },
    },
    {
      field: 'payment_method_id',
      headerName: 'Mã HTTT',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'payment_method_name',
      headerName: 'Tên HTTT',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.paymentMethod?.name ?? '';
      },
    },
    {
      field: 'customer_id',
      headerName: 'Mã khách hàng',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'customer_name',
      headerName: 'Tên khách hàng',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.customer?.name ?? 'GUEST';
      },
    },
    {
      field: 'sale_id',
      headerName: 'Mã khuyến mãi',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'sale_name',
      headerName: 'Tên khuyến mãi',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.sale?.name ?? '';
      },
    },
    {
      field: 'delivery_id',
      headerName: 'Mã giao hàng',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'delivery_name',
      headerName: 'Tên người nhận',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.deliveryTableRow?.name ?? '';
      },
    },
    {
      field: 'delivery_tel',
      headerName: 'SDT người nhận',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.deliveryTableRow?.tel ?? '';
      },
    },
  ];

  const [rows, setRows] = useState<BillTableRow[]>(billsData);

  useEffect(() => {
    setRows(() => billsData);
  }, [billsData]);

  return (
    <>
      <DataGrid
        rows={rows}
        rowHeight={64}
        loading={false}
        columnVisibilityModel={{
          payment_method_id: false,
          payment_method_name: false,
          customer_id: false,
          customer_name: false,
          sale_id: false,
          sale_name: false,
          delivery_id: false,
          delivery_name: false,
          delivery_tel: false,
        }}
        columns={columns}
        localeText={{
          toolbarFilters: 'Bộ lọc',
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[15, 25]}
        autoHeight
        slots={{
          loadingOverlay: CustomLinearProgres,
          baseCheckbox: (props) => {
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
