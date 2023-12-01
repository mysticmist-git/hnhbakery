import { CanNotAccess } from '@/components/cannotAccess/CanNotAccess';
import MyModal from '@/components/order/MyModal';
import ModalState from '@/components/order/MyModal/ModalState';
import BillTable from '@/components/order/MyTable/BillTable';
import { auth } from '@/firebase/config';
import { getAddress } from '@/lib/DAO/addressDAO';
import { getBatchById, getBatches } from '@/lib/DAO/batchDAO';
import { getBillTableRows, getBills } from '@/lib/DAO/billDAO';
import { getBillItems } from '@/lib/DAO/billItemDAO';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getDeliveryById } from '@/lib/DAO/deliveryDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import { getPaymentMethodById } from '@/lib/DAO/paymentMethodDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import { getProductTypeById } from '@/lib/DAO/productTypeDAO';
import { getSaleById } from '@/lib/DAO/saleDAO';
import { getUserByUid, getUsers } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import useLoadingService from '@/lib/hooks/useLoadingService';
import { BillTableRow } from '@/models/bill';
import User from '@/models/user';
import { LockPersonRounded } from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Order = () => {
  const [load, stop] = useLoadingService();

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

  //#region UserData - Trường hợp là quản lý chi nhánh - Check xem họ là quản lý của chi nhánh nào?
  const [user, userLoading, userError] = useAuthState(auth);
  const [canBeAccessed, setCanBeAccessed] = useState<boolean | undefined>(
    undefined
  );
  // const [userData, setUserData] = React.useState<User | undefined>(undefined);

  //#endregion

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        if (!user) {
          setCanBeAccessed(false);
          stop();
          return;
        }
        const userData = await getUserByUid(user?.uid);
        if (!userData) {
          setCanBeAccessed(false);
          stop();
          return;
        }
        const branch = await getBranchByManager(userData);

        if (!branch) {
          setCanBeAccessed(false);
          stop();
          return;
        }
        setCanBeAccessed(true);

        const finalBills: BillTableRow[] = await getBillTableRows(branch);
        setBillsData(() => finalBills || []);
        stop();
      } catch (error) {
        console.log(error);
        setCanBeAccessed(false);
        stop();
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const theme = useTheme();

  return (
    <>
      <Box
        component={'div'}
        width={'100%'}
        sx={{ p: 2, pr: 3, overflow: 'hidden' }}
      >
        {canBeAccessed == true && (
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                sx={{ color: theme.palette.common.black }}
                variant="h4"
              >
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
              <Box component={'div'} width={'100%'}>
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
        )}

        {canBeAccessed == false && <CanNotAccess />}
      </Box>
    </>
  );
};

export default Order;
