import CustomIconButton from '@/components/Inputs/Buttons/customIconButton';
import MyModal from '@/components/Order/MyModal';
import { COLLECTION_NAME } from '@/lib/constants';
import { CustomBill, billStatusParse } from '@/lib/contexts/orders';
import {
  getCollection,
  getCollectionWithQuery,
  getDocFromFirestore,
} from '@/lib/firestore/firestoreLib';
import { BillObject } from '@/lib/models/Bill';
import { DeliveryObject } from '@/lib/models/Delivery';
import { PaymentObject } from '@/lib/models/Payment';
import formatPrice from '@/lib/utilities/formatCurrency';
import { Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridApi,
  GridColDef,
  GridLogicOperator,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { documentId, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';

const MyTable = ({
  billsData,
  handleViewBill,
}: {
  billsData: CustomBill[];
  handleViewBill: (value: CustomBill) => void;
}) => {
  const isBillEmpty = useMemo(() => {
    return billsData.length === 0;
  }, [billsData]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell align="right">Khách hàng</TableCell>
              <TableCell align="center">Ngày đặt</TableCell>
              <TableCell align="right">Tổng đơn</TableCell>
              <TableCell align="right">Tình trạng</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billsData.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.customerName}</TableCell>
                <TableCell align="right">
                  {new Date(row.created_at ?? new Date()).toLocaleString(
                    'vi-VI',
                    {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }
                  )}
                </TableCell>
                <TableCell align="right">
                  {formatPrice(row?.totalPrice ?? 0)}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{
                      color: row.state === 1 ? 'green' : 'red',
                    }}
                  >
                    {billStatusParse(row.state ?? -2)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2} justifyContent={'center'}>
                    <Button
                      variant="contained"
                      onClick={() => handleViewBill(row)}
                    >
                      Xem
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isBillEmpty && (
        <Typography variant="body2">Không tồn tại hóa đơn nào.</Typography>
      )}
    </>
  );
};

const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function BillTable(props: any) {
  const theme = useTheme();
  const { billsData, payments, handleViewBill } = props;

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã đơn',
      flex: 1,
      align: 'center',
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
    },
    {
      field: 'paid_at',
      headerName: 'Thanh toán lúc',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
    },
    {
      field: 'payment_id',
      headerName: 'Thanh toán qua',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      valueFormatter: (params: any) => {
        return (
          payments.find((item: any) => item.id === params.value)?.name ?? 'Lỗi'
        );
      },
    },
    {
      field: 'totalPrice',
      headerName: 'Thành tiền',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: false,
      valueFormatter: (params: any) => {
        return formatPrice(params.value);
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
      headerName: 'Chi tiết',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      hideable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleViewBill(params.row);
            }}
          >
            Chi tiết
          </Button>
        );
      },
    },
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatRow = billsData.map((bill: any) => {
      return {
        id: bill.id,
        created_at: new Date(bill.created_at).toLocaleString('vi-VI', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        paid_at: new Date(bill.paymentTime).toLocaleString('vi-VI', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        payment_id: bill.payment_id,
        totalPrice: bill.totalPrice,
        state: bill.state,
      };
    });

    setRows(formatRow);
  }, [billsData]);

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

const Order = ({
  bills,
  payments,
}: {
  bills: string;
  payments: PaymentObject[];
}) => {
  //#region States

  const [open, setOpen] = React.useState(false);
  const [currentViewBill, setCurrentViewBill] = useState<CustomBill | null>(
    null
  );
  const [billsData, setBillsData] = useState([]);

  //#endregion

  //#region  UseEffects

  useEffect(() => {
    const parsedBills = JSON.parse(bills) ?? [];
    setBillsData(() => parsedBills);
  }, []);

  //#endregion

  //#region Handlers

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewBill = (value: CustomBill) => {
    handleOpen();
    setCurrentViewBill(() => value);
  };

  const handleBillDataChange = (value: CustomBill) => {
    // setBillsData(() => {
    //   // Find the id and alter the value of it with new value
    //   return billsData.map((bill) => {
    //     if (bill.id === value.id) {
    //       return value;
    //     } else {
    //       return bill;
    //     }
    //   });
    // });
  };

  //#endregion

  const theme = useTheme();

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Quản lý hóa đơn
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            {/* Table */}
            <BillTable
              billsData={billsData}
              payments={payments}
              handleViewBill={handleViewBill}
            />
            {/* <MyTable billsData={billsData} handleViewBill={handleViewBill} /> */}

            {/* Modals */}
            <MyModal
              open={open}
              handleClose={handleClose}
              bill={currentViewBill}
              handleBillDataChange={handleBillDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const bills = await getCollection<BillObject>(COLLECTION_NAME.BILLS);
    const payments = await getCollection<PaymentObject>(
      COLLECTION_NAME.PAYMENTS
    );

    return {
      props: {
        bills: JSON.stringify(bills),
        payments: payments,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        bills: [],
      },
    };
  }
};

export default Order;
