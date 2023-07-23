import { ModalState, MyModal } from '@/components/customer/MyModal';
import CustomerTable from '@/components/customer/MyTable';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import {
  BillObject,
  FeedbackObject,
  Role,
  SuperDetail_UserObject,
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
import React, { useEffect, useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Customer = () => {
  const [usersData, setUsersData] = useState<SuperDetail_UserObject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = (
          await getCollection<UserObject>(COLLECTION_NAME.USERS)
        ).filter(
          (user) => user.role_id === 'customer' || user.role_id === 'manager'
        );

        const bills = await getCollection<BillObject>(COLLECTION_NAME.BILLS);

        const feedbacks = await getCollection<FeedbackObject>(
          COLLECTION_NAME.FEEDBACKS
        );

        const finalUsers: SuperDetail_UserObject[] = users
          .map((user) => {
            const finalUser: SuperDetail_UserObject = {
              ...user,
              billObjects: bills.filter((bill) => bill.user_id === user.id),
              feedbackObjects: feedbacks.filter(
                (feedback) => feedback.user_id === user.id
              ),
            };
            return {
              ...finalUser,
            };
          })
          .sort((a, b) => {
            var totalA = 0;
            var totalB = 0;
            a.billObjects?.forEach((bill) => {
              totalA += bill.totalPrice ?? 0;
            });
            b.billObjects?.forEach((bill) => {
              totalB += bill.totalPrice ?? 0;
            });
            return totalB - totalA;
          });
        setUsersData(() => finalUsers || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //#region Phần phụ
  const theme = useTheme();
  const handleUserDataChange = (value: SuperDetail_UserObject) => {
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
  const [currentViewUser, setCurrentViewUser] =
    useState<SuperDetail_UserObject | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewUserModalChiTiet = (value: SuperDetail_UserObject) => {
    handleOpenModalChiTiet();
    setCurrentViewUser(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = React.useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [userState, setUserState] = useState<SuperDetail_UserObject | null>(
    null
  );

  const handleViewUserModalState = (user: SuperDetail_UserObject) => {
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
