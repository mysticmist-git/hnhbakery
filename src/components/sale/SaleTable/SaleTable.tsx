import { statusTextResolver } from '@/lib/manage/manage';
import { formatDateString, formatPrice } from '@/lib/utils';
import { SaleTableRow } from '@/models/sale';
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

export default function SaleTable({
  saleData,
  handleViewSale,
  handleViewSaleModalState,
}: {
  saleData: SaleTableRow[];
  handleViewSale: any;
  handleViewSaleModalState: any;
}) {
  const theme = useTheme();

  const [rows, setRows] = useState<SaleTableRow[]>(saleData);

  useEffect(() => {
    setRows(() => saleData);
  }, [saleData]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã quản lý',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Tên khuyến mãi',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'code',
      headerName: 'Code khuyến mãi',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 120,
    },
    {
      field: 'percent',
      headerName: 'Phần trăm',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 200,
      valueGetter(params) {
        return (
          'Giảm ' +
          params.value +
          '% (' +
          'Tối đa ' +
          formatPrice(params.row.maxSalePrice)
        );
      },
    },
    {
      field: 'limit',
      headerName: 'Giảm tối đa',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'start_at',
      headerName: 'Thời gian',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 150,
      renderCell: (params: any) => {
        return (
          <div>
            BĐ: {formatDateString(params.value, 'DD/MM/YYYY')}
            <br />
            KT: {formatDateString(params.row.end_at, 'DD/MM/YYYY')}
          </div>
        );
      },
    },
    {
      field: 'numberOfUse',
      headerName: 'Lượt sử dụng',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 110,
    },
    {
      field: 'totalSalePrice',
      headerName: 'Đã giảm',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 130,
      valueFormatter(params) {
        return formatPrice(params.value);
      },
    },
    {
      field: 'end_at',
      headerName: 'Kết thúc',
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
      field: 'active',
      headerName: 'Trạng thái',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 100,
      valueFormatter(params) {
        return statusTextResolver(params.value);
      },
      renderCell: (params: any) => {
        return (
          <span
            style={{
              color: params.value
                ? theme.palette.success.main
                : theme.palette.error.main,
            }}
          >
            {statusTextResolver(params.value)}
          </span>
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
                handleViewSale(params.row);
              }}
            >
              Chi tiết
            </Button>

            <Button
              variant="contained"
              color={'error'}
              size="small"
              disabled={!params.row.active}
              onClick={() => {
                handleViewSaleModalState(params.row);
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
          maxSalePrice: false,
          description: false,
          code: false,
          percent: false,
          end_at: false,
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

// id?: string;
// name: string;
// code: string;
// percent: number;
// maxSalePrice: number;
// description: string;
// start_at: Date;
// end_at: Date;
// image: string;
// isActive: boolean;
