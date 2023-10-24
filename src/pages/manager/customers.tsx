import { ModalState, MyModal } from '@/components/customer/MyModal';
import CustomerTable from '@/components/customer/MyTable';
import { getAddress, getAddresses } from '@/lib/DAO/addressDAO';
import { getBatchById } from '@/lib/DAO/batchDAO';
import { getBills } from '@/lib/DAO/billDAO';
import { getBillItems } from '@/lib/DAO/billItemDAO';
import { getDeliveryById } from '@/lib/DAO/deliveryDAO';
import { getFeedbacks } from '@/lib/DAO/feedbackDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import { getPaymentMethodById } from '@/lib/DAO/paymentMethodDAO';
import { getProduct, getProducts } from '@/lib/DAO/productDAO';
import { getProductTypeById, getProductTypes } from '@/lib/DAO/productTypeDAO';
import { getSaleById } from '@/lib/DAO/saleDAO';
import { getUserTableRows, getUsers } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';

import { BillTableRow } from '@/models/bill';
import { FeedbackTableRow } from '@/models/feedback';
import { UserTableRow } from '@/models/user';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Customer = () => {
  const [usersData, setUsersData] = useState<UserTableRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUsersData(await getUserTableRows());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //#region Phần phụ
  const theme = useTheme();
  const handleUserDataChange = (value: UserTableRow) => {
    setUsersData(() => {
      return usersData.map((user) => {
        if (user.id === value.id) {
          return value;
        } else {
          return user;
        }
      });
    });
  };
  //#endregion

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = React.useState(false);
  const [currentViewUser, setCurrentViewUser] = useState<UserTableRow | null>(
    null
  );

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewUserModalChiTiet = (value: UserTableRow) => {
    handleOpenModalChiTiet();
    setCurrentViewUser(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = React.useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [userState, setUserState] = useState<UserTableRow | null>(null);

  const handleViewUserModalState = (user: UserTableRow) => {
    handleOpenModalState();
    setUserState(() => user);
  };
  //#endregion

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
              Quản lý khách hàng
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
              *Tìm kiếm theo mã, họ tên, email, số điện thoại, ngày sinh, trạng
              thái...
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {/* Table */}
            <CustomerTable
              usersData={usersData}
              handleViewUser={handleViewUserModalChiTiet}
              handleViewUserModalState={handleViewUserModalState}
            />

            {/* Modal chi tiết */}
            <MyModal
              open={openModalChiTiet}
              handleClose={handleCloseModalChiTiet}
              user={currentViewUser}
              handleUserDataChange={handleUserDataChange}
            />

            {/* Modal state */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              userState={userState}
              setUserState={setUserState}
              handleUserDataChange={handleUserDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Customer;
