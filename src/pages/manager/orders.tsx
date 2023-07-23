import MyModal from '@/components/order/MyModal';
import ModalState from '@/components/order/MyModal/ModalState';
import BillTable from '@/components/order/MyTable/BillTable';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import {
  BillObject,
  DeliveryObject,
  PaymentObject,
  SaleObject,
  SuperDetail_BillObject,
  UserObject,
} from '@/lib/models';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import React, { useEffect, useMemo, useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Order = () => {
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

  //#endregion

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

  //#region Modal hủy
  const [openModalState, setOpenModalState] = React.useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [billState, setBillState] = useState<SuperDetail_BillObject | null>(
    null
  );

  const handleViewBillModalState = (bill: SuperDetail_BillObject) => {
    handleOpenModalState();
    setBillState(() => bill);
  };
  //#endregion

  useEffect(() => {
    const fetchData = async () => {
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

        const finalBills: SuperDetail_BillObject[] = bills
          .map((bill: BillObject) => {
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
          })
          .sort((a, b) => {
            return (
              new Date(b.created_at ?? '').getTime() -
              new Date(a.created_at ?? '').getTime()
            );
          });

        setBillsData(() => finalBills || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              *Tìm kiếm theo hóa đơn, giao hàng, người mua hàng, người nhận
              hàng, khuyến mãi...
            </Typography>
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
              billState={billState}
              setBillState={setBillState}
              handleBillDataChange={handleBillDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Order;
