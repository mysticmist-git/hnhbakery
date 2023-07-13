import MyModal from '@/components/order/MyModal';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import { billStatusParse } from '@/lib/manage/manage';
import {
  BillObject,
  CustomBill,
  DeliveryObject,
  PaymentObject,
  SaleObject,
  SuperDetail_BillObject,
  UserObject,
} from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
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
import { type } from 'os';
import React, { useEffect, useMemo, useState } from 'react';
import stringHash from 'string-hash';

const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function BillTable({
  billsData,
  handleViewBill,
}: {
  billsData: SuperDetail_BillObject[];
  handleViewBill: any;
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
      headerName: 'Thành tiền',
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
              console.log(params.row);
            }}
          >
            Chi tiết
          </Button>
        );
      },
    },
  ];

  const [rows, setRows] = useState<SuperDetail_BillObject[]>(billsData);

  useEffect(() => {
    setRows(billsData);
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

const Order = ({ finalBills }: { finalBills: string }) => {
  //#region Bảng
  const [billsData, setBillsData] = useState([]);

  //#endregion

  //#region Modal
  const [open, setOpen] = React.useState(false);
  const [currentViewBill, setCurrentViewBill] =
    useState<SuperDetail_BillObject | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewBill = (value: SuperDetail_BillObject) => {
    handleOpen();
    setCurrentViewBill(() => value);
  };

  const handleBillDataChange = (value: SuperDetail_BillObject) => {
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

  useEffect(() => {
    const parsedBills = JSON.parse(finalBills) ?? [];
    setBillsData(() => parsedBills);
  }, []);

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
            <BillTable billsData={billsData} handleViewBill={handleViewBill} />
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
    const users = await getCollection<UserObject>(COLLECTION_NAME.USERS);
    const sales = await getCollection<SaleObject>(COLLECTION_NAME.SALES);
    const deliveries = await getCollection<DeliveryObject>(
      COLLECTION_NAME.DELIVERIES
    );

    const finalBills: SuperDetail_BillObject[] = bills.map(
      (bill: BillObject) => {
        const finalBill: SuperDetail_BillObject = {
          ...bill,
          paymentObject: payments.find((payment: PaymentObject) => {
            return payment.id === bill.payment_id;
          }),
          userObject: users.find((user: UserObject) => {
            return user.id === bill.user_id;
          }),
          saleObject: sales.find((sale: SaleObject) => {
            return sale.id === bill.sale_id;
          }),
          deliveryObject: deliveries.find((delivery: DeliveryObject) => {
            return delivery.bill_id === bill.id;
          }),
        };

        return {
          ...finalBill,
        };
      }
    );

    return {
      props: {
        finalBills: JSON.stringify(finalBills),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        finalBills: [],
      },
    };
  }
};

export default Order;
