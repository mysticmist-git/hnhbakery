import { deliveryStatusParse } from '@/lib/manage/manage';
import { SuperDetail_DeliveryObject } from '@/lib/models';
import { formatDateString } from '@/lib/utils';
import { CustomLinearProgres } from '@/pages/manager/orders';
import { Box, Button, Checkbox, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridLogicOperator,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

export default function DeliveryTable({
  deliveryData,
  handleViewDelivery,
  handleViewDeliveryModalState,
}: {
  deliveryData: SuperDetail_DeliveryObject[];
  handleViewDelivery: any;
  handleViewDeliveryModalState: any;
}) {
  const theme = useTheme();

  const [rows, setRows] = useState<SuperDetail_DeliveryObject[]>(deliveryData);

  useEffect(() => {
    setRows(() => deliveryData);
  }, [deliveryData]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã giao hàng',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Người nhận',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'tel',
      headerName: 'SĐT người nhận',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email người nhận',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ giao hàng',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'note',
      headerName: 'Ghi chú giao hàng',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Ngày giao hàng',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 120,
      valueFormatter(params) {
        return formatDateString(params.value, 'DD/MM/YYYY');
      },
    },
    {
      field: 'time',
      headerName: 'Thời gian giao hàng',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 220,
    },
    {
      field: 'startAt',
      headerName: 'Bắt đầu giao',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueFormatter(params) {
        return formatDateString(params.value);
      },
    },
    {
      field: 'endAt',
      headerName: 'Kết thúc giao',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueFormatter(params) {
        return formatDateString(params.value);
      },
    },
    {
      field: 'bill_id',
      headerName: 'Mã hóa đơn',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'state',
      headerName: 'Trạng thái',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 120,
      valueFormatter(params) {
        return deliveryStatusParse(params.value);
      },
      renderCell(params) {
        return (
          <Box
            sx={{
              color: () => {
                switch (params.value) {
                  case 'cancel':
                    return theme.palette.error.dark;
                  case 'fail':
                    return theme.palette.error.main;
                  case 'success':
                    return theme.palette.success.main;
                  case 'inProcress':
                    return theme.palette.text.secondary;
                  case 'inTransit':
                    return theme.palette.secondary.main;
                  default:
                    return theme.palette.common.black;
                }
              },
            }}
          >
            {deliveryStatusParse(params.value)}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      align: 'center',
      width: 150,
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
                handleViewDelivery(params.row);
              }}
            >
              Chi tiết
            </Button>

            <Button
              variant="contained"
              color={'error'}
              size="small"
              disabled={
                params.row.state === 'success' ||
                params.row.state === 'inTransit' ||
                params.row.state === 'cancel'
              }
              onClick={() => {
                handleViewDeliveryModalState(params.row);
              }}
            >
              Hủy
            </Button>
          </Box>
        );
      },
    },
  ];
  return (
    <>
      <DataGrid
        rows={rows}
        rowHeight={64}
        loading={false}
        columnVisibilityModel={{
          name: false,
          tel: false,
          email: false,
          address: false,
          note: false,
          startAt: false,
          endAt: false,
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
