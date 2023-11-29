import { statusTextResolver, userAccountTypeParse } from '@/lib/manage/manage';
// import { SuperDetail_UserObject } from '@/lib/models';
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
import { CustomLinearProgres } from '../../../pages/manager/customers';
import { UserTableRow } from '@/models/user';

export default function CustomerTable({
  usersData,
  handleViewUser,
  handleViewUserModalState,
}: {
  usersData: UserTableRow[];
  handleViewUser: any;
  handleViewUserModalState: any;
}) {
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã khách',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'mail',
      headerName: 'Email',
      align: 'left',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Họ và tên',
      align: 'left',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'birth',
      headerName: 'Ngày sinh',
      align: 'left',
      headerAlign: 'center',
      flex: 1,

      valueFormatter(params) {
        return new Date(params.value).toLocaleString('vi-VI', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      field: 'tel',
      headerName: 'Số điện thoại',
      align: 'center',
      headerAlign: 'center',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
    },
    {
      field: 'totalPaid',
      headerName: 'Đã thanh toán',
      align: 'left',
      headerAlign: 'center',
      flex: 1,

      valueFormatter(params) {
        return formatPrice(params.value);
      },
      valueGetter(params) {
        var total = 0;
        params.row.bills.forEach((item: any) => {
          if (item.state == 'paid') {
            return (total += item.final_price);
          }
        });
        return total;
      },
    },
    {
      field: 'active',
      headerName: 'Trạng thái',
      align: 'center',
      headerAlign: 'center',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
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
      field: 'type',
      headerName: 'Kiểu tài khoản',
      align: 'left',
      headerAlign: 'center',
      flex: 1,

      valueFormatter(params) {
        return userAccountTypeParse(params.value);
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      align: 'left',
      width: 200,
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
                handleViewUser(params.row);
              }}
            >
              Chi tiết
            </Button>
            <Button
              variant="contained"
              color={params.row.active ? 'error' : 'success'}
              size="small"
              onClick={() => {
                handleViewUserModalState(params.row);
              }}
            >
              {params.row.active ? 'Vô hiệu' : 'Kích hoạt'}
            </Button>
          </Box>
        );
      },
    },
  ];

  const [rows, setRows] = useState<UserTableRow[]>(usersData);

  useEffect(() => {
    setRows(() => usersData);
  }, [usersData]);

  return (
    <>
      <DataGrid
        rows={rows}
        rowHeight={64}
        loading={false}
        columnVisibilityModel={{
          mail: false,
          birth: false,
          type: false,
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
