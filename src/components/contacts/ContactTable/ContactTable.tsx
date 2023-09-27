import Contact from '@/models/contact';
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

function ContactTable({
  contactData,
  handleViewContact,
}: {
  contactData: Contact[];
  handleViewContact: any;
}) {
  const theme = useTheme();

  const [rows, setRows] = useState<Contact[]>(contactData);

  useEffect(() => {
    setRows(() => contactData);
  }, [contactData]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã liên hệ',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'title',
      headerName: 'Tiêu đề',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'content',
      headerName: 'Nội dung',
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
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Tên khách hàng',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'tel',
      headerName: 'Số điện thoại',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'isRead',
      headerName: 'Trạng thái',
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueFormatter(params) {
        return getStatusContact(params.value);
      },
      renderCell(params) {
        return (
          <Box
            sx={{
              color: params.value ? 'success.main' : 'error.main',
            }}
          >
            {getStatusContact(params.value)}
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
                handleViewContact(params.row);
              }}
            >
              Chi tiết
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

function getStatusContact(value: boolean) {
  return value ? 'Đã đọc' : 'Chưa đọc';
}

export default ContactTable;
