import { formatDateString } from '@/lib/utils';
import { BillTableRow } from '@/models/bill';
import {
  deliveryStateColorParse,
  deliveryStateContentParse,
} from '@/models/delivery';
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
  deliveryData: BillTableRow[];
  handleViewDelivery: any;
  handleViewDeliveryModalState: any;
}) {
  const theme = useTheme();

  const [rows, setRows] = useState<BillTableRow[]>(deliveryData);

  useEffect(() => {
    setRows(() => deliveryData);
  }, [deliveryData]);

  const columns: GridColDef[] = [
    {
      field: 'delivery_id',
      headerName: 'Mã giao hàng',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return params.row.deliveryTableRow.id;
      },
    },
    {
      field: 'delivery_name',
      headerName: 'Người nhận',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return params.row.deliveryTableRow.name;
      },
    },
    {
      field: 'delivery_tel',
      headerName: 'SĐT người nhận',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return params.row.deliveryTableRow.tel;
      },
    },
    {
      field: 'delivery_mail',
      headerName: 'Email người nhận',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return params.row.deliveryTableRow.mail;
      },
    },
    {
      field: 'delivery_address',
      headerName: 'Địa chỉ giao hàng',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return params.row.deliveryTableRow.address.address;
      },
    },
    {
      field: 'delivery_note',
      headerName: 'Ghi chú giao hàng',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return params.row.deliveryTableRow.delivery_note;
      },
    },
    {
      field: 'delivery_shipdate',
      headerName: 'Ngày giao hàng',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 120,
      valueGetter: (params) => {
        return formatDateString(
          params.row.deliveryTableRow.ship_date,
          'DD/MM/YYYY'
        );
      },
    },
    {
      field: 'delivery_shiptime',
      headerName: 'Thời gian giao hàng',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 220,
      valueGetter: (params) => {
        return params.row.deliveryTableRow.ship_time;
      },
    },
    {
      field: 'delivery_startAt',
      headerName: 'Bắt đầu giao',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return formatDateString(
          params.row.deliveryTableRow.start_at,
          'DD/MM/YYYY'
        );
      },
    },
    {
      field: 'delivery_endAt',
      headerName: 'Kết thúc giao',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        return formatDateString(
          params.row.deliveryTableRow.end_at,
          'DD/MM/YYYY'
        );
      },
    },
    {
      field: 'id',
      headerName: 'Mã hóa đơn',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'delivery_state',
      headerName: 'Trạng thái',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 120,
      valueGetter: (params) => {
        return deliveryStateContentParse(params.row.deliveryTableRow.state);
      },
      renderCell(params) {
        return (
          <Box
            sx={{
              color: deliveryStateColorParse(
                theme,
                params.row.deliveryTableRow.state
              ),
            }}
          >
            {deliveryStateContentParse(params.row.deliveryTableRow.state)}
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
                params.row.deliveryTableRow.state === 'delivered' ||
                params.row.deliveryTableRow.state === 'cancelled'
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
          delivery_name: false,
          delivery_tel: false,
          delivery_mail: false,
          delivery_address: false,
          delivery_note: false,
          delivery_startAt: false,
          delivery_endAt: false,
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
