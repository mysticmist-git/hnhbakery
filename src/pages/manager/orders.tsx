import { CustomButton, CustomIconButton } from '@/components/buttons';
import MyModal from '@/components/order/MyModal';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import {
  BillObject,
  CustomBill,
  DeliveryObject,
  PaymentObject,
  SaleObject,
  SuperDetail_BillObject,
  UserObject,
} from '@/lib/models';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import { GridActionsCellItem, GridApi } from '@mui/x-data-grid';
import { documentId, where } from 'firebase/firestore';
import { type } from 'os';
import React, { useEffect, useMemo, useState } from 'react';
import stringHash from 'string-hash';
import { BillTable } from '../../components/order/MyTable/BillTable';
import { useSnackbarService } from '@/lib/contexts';
import { Close } from '@mui/icons-material';
import { billStatusParse } from '@/lib/manage/manage';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function ModalState({
  open,
  handleClose,
  setBillState,
  deliveryObject,
}: {
  open: boolean;
  handleClose: () => void;
  setBillState: (prev: any) => void;
  deliveryObject: DeliveryObject | null;
}) {
  const clearData = () => {
    setBillState(() => 0);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  const getIsCancel = () => {
    const deliveryState = deliveryObject?.state;
    if (deliveryState === 'inTransit') {
      return false;
    } else if (deliveryState === 'inProcress') {
      return true;
    } else if (deliveryState === 'fail') {
      return true;
    } else if (deliveryState === 'success') {
      return false;
    }
  };

  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    setIsCancel(getIsCancel() ?? false);
  }, [deliveryObject]);

  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        fullWidth
        maxWidth="xs"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
          },
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <DialogTitle>
          <Box>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <Close />
            </CustomIconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography
            align="center"
            variant="body1"
            sx={{
              fontWeight: 'bold',
              px: 4,
            }}
            color={theme.palette.common.black}
          >
            {isCancel
              ? 'Xác nhận hủy?'
              : 'Không thể hủy đơn hàng! Đơn hàng đang được vận chuyển.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                handleClose();
              }}
            >
              {isCancel ? 'Hủy' : 'Đóng'}
            </Button>
            {isCancel && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  // const data = {
                  //   ...deliveryObject,
                  //   state: 'fail',
                  // } as DeliveryObject;

                  // updateDocToFirestore(data, COLLECTION_NAME.DELIVERIES);
                  // Hủy đơn thì nhớ hủy luôn vận chuyển
                  handleSnackbarAlert('success', 'Hủy đơn thành công!');
                  handleClose();
                }}
              >
                Xác nhận
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

const Order = ({ finalBills }: { finalBills: string }) => {
  const [billsData, setBillsData] = useState<SuperDetail_BillObject[]>([]);

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = React.useState(false);
  const [currentViewBill, setCurrentViewBill] =
    useState<SuperDetail_BillObject | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewBillModalChiTiet = (value: SuperDetail_BillObject) => {
    handleOpenModalChiTiet();
    setCurrentViewBill(() => value);
  };

  const handleBillDataChange = (value: SuperDetail_BillObject) => {
    setBillsData(() => {
      return billsData.map((bill) => {
        if (bill.id === value.id) {
          return value;
        } else {
          return bill;
        }
      });
    });
  };
  //#endregion

  //#region Modal hủy
  const [openModalState, setOpenModalState] = React.useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [billState, setBillState] = useState<number>(0);
  const [deliveryObject, setDeliveryObject] = useState<DeliveryObject | null>(
    null
  );

  const handleViewBillModalState = (
    billState: number,
    deliveryObject: DeliveryObject
  ) => {
    handleOpenModalState();
    setBillState(() => billState);
    setDeliveryObject(() => deliveryObject);
  };
  //#endregion

  useEffect(() => {
    const parsedBills =
      (JSON.parse(finalBills) as SuperDetail_BillObject[]) ?? [];
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
            <Box width={'100%'}>
              <BillTable
                billsData={billsData}
                handleViewBill={handleViewBillModalChiTiet}
                handleViewBillModalState={handleViewBillModalState}
              />
            </Box>

            {/* Modals */}
            <MyModal
              open={openModalChiTiet}
              handleClose={handleCloseModalChiTiet}
              bill={currentViewBill}
              handleBillDataChange={handleBillDataChange}
            />

            {/* State modal */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              deliveryObject={deliveryObject}
              setBillState={setBillState}
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
