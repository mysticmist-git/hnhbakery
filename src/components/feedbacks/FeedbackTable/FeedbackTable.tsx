import { SuperDetail_FeedbackObject } from '@/lib/models';
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

export default function FeedbackTable({
  feedbackData,
  handleViewFeedback,
  handleViewFeedbackModalState,
}: {
  feedbackData: SuperDetail_FeedbackObject[];
  handleViewFeedback: (value: SuperDetail_FeedbackObject) => void;
  handleViewFeedbackModalState: (value: SuperDetail_FeedbackObject) => void;
}) {
  const theme = useTheme();

  const [rows, setRows] = useState<SuperDetail_FeedbackObject[]>(feedbackData);

  useEffect(() => {
    setRows(() => feedbackData);
  }, [feedbackData]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã feedback',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'time',
      headerName: 'Thời gian',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 150,
      valueFormatter(params) {
        return formatDateString(params.value);
      },
    },
    {
      field: 'productName',
      headerName: 'Tên sản phẩm',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      valueGetter(params) {
        return params.row.productObject.name;
      },
    },
    {
      field: 'rating',
      headerName: 'Số sao',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 80,
      valueFormatter(params) {
        return params.value + '/5';
      },
    },

    {
      field: 'comment',
      headerName: 'Bình luận',
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      width: 350,
    },

    {
      field: 'product_id',
      headerName: 'Mã sản phẩm',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
    {
      field: 'user_id',
      headerName: 'Mã người dùng',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
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
                handleViewFeedback(params.row);
              }}
            >
              Chi tiết
            </Button>

            <Button
              variant="contained"
              color={'error'}
              size="small"
              onClick={() => {
                handleViewFeedbackModalState(params.row);
              }}
            >
              Xóa
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
          product_id: false,
          user_id: false,
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
