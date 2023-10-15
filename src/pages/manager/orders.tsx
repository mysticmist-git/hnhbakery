import MyModal from '@/components/order/MyModal';
import ModalState from '@/components/order/MyModal/ModalState';
import BillTable from '@/components/order/MyTable/BillTable';
import { getAddress } from '@/lib/DAO/addressDAO';
import { getBatchById, getBatches } from '@/lib/DAO/batchDAO';
import { getBillTableRows, getBills } from '@/lib/DAO/billDAO';
import { getBillItems } from '@/lib/DAO/billItemDAO';
import { getDeliveryById } from '@/lib/DAO/deliveryDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import { getPaymentMethodById } from '@/lib/DAO/paymentMethodDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import { getProductTypeById } from '@/lib/DAO/productTypeDAO';
import { getSaleById } from '@/lib/DAO/saleDAO';
import { getUsers } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import { BillTableRow } from '@/models/bill';
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
  const [billsData, setBillsData] = useState<BillTableRow[]>([]);

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = React.useState(false);
  const [currentViewBill, setCurrentViewBill] = useState<BillTableRow | null>(
    null
  );

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewBillModalChiTiet = (value: BillTableRow) => {
    handleOpenModalChiTiet();
    setCurrentViewBill(() => value);
  };

  //#endregion

  const handleBillDataChange = (value: BillTableRow) => {
    setBillsData(() => {
      return billsData.map((bill) => {
        if (bill.id === value.id && bill.customer_id === value.customer_id) {
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

  const [billState, setBillState] = useState<BillTableRow | null>(null);

  const handleViewBillModalState = (bill: BillTableRow) => {
    handleOpenModalState();
    setBillState(() => bill);
  };
  //#endregion

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalBills: BillTableRow[] = await getBillTableRows();
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
