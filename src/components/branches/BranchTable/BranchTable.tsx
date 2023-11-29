import { statusTextResolver } from '@/lib/manage/manage';
import { formatDateString } from '@/lib/utils';
import { BranchTableRow } from '@/models/branch';
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

export default function BranchTable({
  branchData,
  handleViewBranch,
  handleViewBranchModalEdit,
  handleViewBranchModalState,
}: {
  branchData: BranchTableRow[];
  handleViewBranch: (value: BranchTableRow) => void;
  handleViewBranchModalEdit: (value: BranchTableRow) => void;
  handleViewBranchModalState: (value: BranchTableRow) => void;
}) {
  const theme = useTheme();

  const [rows, setRows] = useState<BranchTableRow[]>(branchData);

  useEffect(() => {
    setRows(() => branchData);
  }, [branchData]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã chi nhánh',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Tên chi nhánh',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 80,
    },

    {
      field: 'manager_id',
      headerName: 'Mã quản lý',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 350,
      valueGetter: (params) => {
        if (params.row.manager) {
          return params.row.manager.id;
        } else {
          return '';
        }
      },
    },
    {
      field: 'manager_tel',
      headerName: 'Số điện thoại quản lý',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        if (params.row.manager) {
          return params.row.manager.tel;
        } else {
          return '';
        }
      },
    },

    {
      field: 'manager_name',
      headerName: 'Tên quản lý',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        if (params.row.manager) {
          return params.row.manager.name;
        } else {
          return '';
        }
      },
    },
    {
      field: 'manager_mail',
      headerName: 'Email quản lý',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter: (params) => {
        if (params.row.manager) {
          return params.row.manager.mail;
        } else {
          return '';
        }
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
      flex: 1,
      valueFormatter: (params) => {
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
      width: 250,
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
                handleViewBranch(params.row);
              }}
            >
              Chi tiết
            </Button>

            <Button
              variant="contained"
              color={'info'}
              size="small"
              onClick={() => {
                handleViewBranchModalEdit(params.row);
              }}
            >
              Sửa
            </Button>
            <Button
              variant="contained"
              color={params.row.active ? 'error' : 'success'}
              size="small"
              onClick={() => {
                handleViewBranchModalState(params.row);
              }}
            >
              {params.row.active ? 'Vô hiệu' : 'Kích hoạt'}
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
          address: false,
          manager_id: false,
          manager_name: false,
          manager_mail: false,
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
