import { billStatusParse } from '@/lib/manage/manage';
import { SuperDetail_BillObject } from '@/lib/models';
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
import { CustomLinearProgres } from '../../../pages/manager/orders';

export function BillTable({
  billsData,
  handleViewBill,
  handleViewBillModalState,
}: {
  billsData: SuperDetail_BillObject[];
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
      // valueFormatter: (params: any) => {
      //   return stringHash(params.value);
      // },
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
      field: 'totalPrice',
      headerName: 'Tổng tiền',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      valueFormatter: (params: any) => {
        return formatPrice(params.value);
      },
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 0.2,
            }}
          >
            {params.row.saleAmount > 0 && (
              <span
                style={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(params.row.originalPrice)}
              </span>
            )}

            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {formatPrice(params.value)}
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
        return billStatusParse(params.value);
      },
      renderCell: (params: any) => {
        return (
          <span
            style={{
              color:
                params.value === 1
                  ? theme.palette.success.main
                  : params.value === 0
                  ? theme.palette.text.secondary
                  : theme.palette.error.main,
            }}
          >
            {billStatusParse(params.value)}
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                console.log(params.row);

                handleViewBill(params.row);
              }}
            >
              Chi tiết
            </Button>
            <Button
              variant="contained"
              color="secondary"
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
      field: 'payment_id',
      headerName: 'Mã HTTT',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'payment_name',
      headerName: 'Tên HTTT',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.paymentObject?.name ?? '';
      },
    },
    {
      field: 'user_id',
      headerName: 'Mã khách hàng',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'user_name',
      headerName: 'Tên khách hàng',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.userObject?.name ?? 'GUEST';
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
        return params.row.saleObject?.name ?? '';
      },
    },
    {
      field: 'delivery_id',
      headerName: 'Mã giao hàng',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.deliveryObject?.id ?? '';
      },
    },
    {
      field: 'delivery_name',
      headerName: 'Tên người nhận',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.deliveryObject?.name ?? '';
      },
    },
    {
      field: 'delivery_tel',
      headerName: 'SDT người nhận',
      align: 'left',
      headerAlign: 'center',
      valueGetter(params) {
        return params.row.deliveryObject?.tel ?? '';
      },
    },
  ];

  const [rows, setRows] = useState<SuperDetail_BillObject[]>(billsData);

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
          payment_id: false,
          payment_name: false,
          user_id: false,
          user_name: false,
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
        pageSizeOptions={[5, 10]}
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
