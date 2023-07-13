import { CustomButton } from '@/components/buttons';
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
  Card,
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
import { GridActionsCellItem, GridApi } from '@mui/x-data-grid';
import { documentId, where } from 'firebase/firestore';
import { type } from 'os';
import React, { useEffect, useMemo, useState } from 'react';
import stringHash from 'string-hash';
import { BillTable } from '../../components/order/MyTable/BillTable';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

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
