import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import {
  BillObject,
  FeedbackObject,
  Role,
  SuperDetail_UserObject,
  UserObject,
} from '@/lib/models';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomerTable } from '../../components/customer/MyTable/CustomerTable';
import { MyModal } from '../../components/customer/MyModal/MyModal';
import { useSnackbarService } from '@/lib/contexts';
import { CustomIconButton } from '@/components/buttons';
import { Close } from '@mui/icons-material';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Customer = ({ finalUsers }: { finalUsers: string }) => {
  const [usersData, setUsersData] = useState<SuperDetail_UserObject[]>([]);

  useEffect(() => {
    const parsedUsers =
      (JSON.parse(finalUsers) as SuperDetail_UserObject[]) ?? [];
    setUsersData(() => parsedUsers);
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
  //#region Modal state

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
              Tìm gì?
              {/* *Tìm kiếm theo hóa đơn, giao hàng, người mua hàng, người nhận
              hàng, khuyến mãi... */}
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

export const getServerSideProps = async () => {
  try {
    const users = (
      await getCollection<UserObject>(COLLECTION_NAME.USERS)
    ).filter((user) => user.role_id === 'customer');

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
        return totalA - totalB;
      });

    return {
      props: {
        finalUsers: JSON.stringify(finalUsers),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        finalUsers: '',
      },
    };
  }
};

export default Customer;

function ModalState({
  open,
  handleClose,
  userState,
  setUserState,
  handleUserDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  userState: SuperDetail_UserObject | null;
  setUserState: React.Dispatch<
    React.SetStateAction<SuperDetail_UserObject | null>
  >;
  handleUserDataChange: (value: SuperDetail_UserObject) => void;
}) {
  const clearData = () => {
    setUserState(() => null);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
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
            {userState?.isActive
              ? 'Xác nhận vô hiệu tài khoản?'
              : 'Xác nhận kích hoạt tài khoản?'}
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
              Hủy
            </Button>
            <Button
              variant="contained"
              color={userState?.isActive ? 'error' : 'success'}
              onClick={async () => {
                const data = (
                  await getCollection<UserObject>(COLLECTION_NAME.USERS)
                ).find((user) => user.id === userState?.id);
                if (data) {
                  data.isActive = !data.isActive;
                  await updateDocToFirestore(data, COLLECTION_NAME.USERS);
                  if (data.isActive) {
                    handleSnackbarAlert(
                      'success',
                      'Kích hoạt tài khoản thành công!'
                    );
                  } else {
                    handleSnackbarAlert('success', 'Vô hiệu khoản thành công!');
                  }
                  handleUserDataChange({
                    ...userState,
                    ...data,
                  });
                  handleClose();
                } else {
                  handleSnackbarAlert('error', 'Lỗi.');
                  handleClose();
                }
              }}
            >
              {userState?.isActive ? 'Vô hiệu' : 'Kích hoạt'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
