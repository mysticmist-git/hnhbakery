import ImageBackground from '@/components/Imagebackground/Imagebackground';
import { LeftProfileColumn } from '@/components/Profile';
import RightProfileColumn from '@/components/Profile/RightProfileColumn/RightProfileColumn';
import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { auth } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import useUserData from '@/lib/hooks/userUserData';
import { billStatusParse } from '@/lib/manage/manage';
import { BillObject, UserObject } from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import {
  Box,
  Grid,
  InputAdornment,
  Link,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile = ({ billData }: { billData: string }) => {
  const router = useRouter();

  // #region states

  const [user, userLoading, userError] = useAuthState(auth);

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/');
    }
  }, [router, user, userLoading]);

  const { userData, userDataLoading, userDataError } = useUserData(
    user?.uid ?? '1'
  );

  // #endregion

  // #region Hooks

  const theme = useTheme();

  // #endregion

  const handleUpdateUserData = async (
    field: keyof UserObject,
    value: UserObject[keyof UserObject]
  ) => {
    const updateData = { ...userData, [field]: value };

    console.log(updateData);

    await updateDocToFirestore(updateData, COLLECTION_NAME.USERS);
  };

  const myBills = useMemo(() => {
    if (userData && !userDataLoading) {
      const bills: BillObject[] = JSON.parse(billData);
      return bills.filter((bill) => {
        return bill.user_id === userData.id;
      });
    }
  }, [userData, userDataLoading]);
  const handleSnackbarAlert = useSnackbarService();

  return (
    <>
      <ImageBackground>
        <Grid
          sx={{ px: 6 }}
          height={'100%'}
          container
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item>
            <Link href="#" style={{ textDecoration: 'none' }}>
              <Typography
                align="center"
                variant="h1"
                color={theme.palette.primary.main}
                sx={{
                  '&:hover': {
                    color: theme.palette.common.white,
                  },
                }}
              >
                Tài khoản
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </ImageBackground>

      {!user ? undefined : (
        <Box
          sx={{
            pt: 6,
            pb: 12,
            px: { xs: 2, sm: 2, md: 4, lg: 8 },
            overflow: 'visible',
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent={'center'}
            alignItems={'flex-start'}
          >
            <Grid item xs={12} sm={4} md={3}>
              {userLoading ? (
                <Skeleton
                  animation="wave"
                  width={'100%'}
                  height={320}
                  variant="rounded"
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: theme.palette.common.white,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 3,
                    p: 2,
                  }}
                >
                  <LeftProfileColumn
                    image={userData?.image ?? ''}
                    userId={userData?.id ?? ''}
                    onUpdateUserData={handleUpdateUserData}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              {userLoading ? (
                <Skeleton
                  animation="wave"
                  width={'100%'}
                  height={520}
                  variant="rounded"
                />
              ) : (
                <RightProfileColumn
                  user={user}
                  userData={userData}
                  onUpdateUserData={handleUpdateUserData}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Box
                sx={{
                  backgroundColor: theme.palette.common.white,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 3,
                  p: 2,
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={12}>
                    <Typography
                      align="center"
                      variant="button"
                      color={theme.palette.common.black}
                    >
                      Đơn hàng của bạn
                    </Typography>
                  </Grid>

                  {myBills?.map((bill) => {
                    return (
                      <Grid item xs={12} key={bill.id}>
                        <Outlined_TextField
                          textStyle={{
                            fontSize: theme.typography.body2.fontSize,
                            color: theme.palette.common.black,
                            fontWeight: theme.typography.body2.fontWeight,
                            fontFamily: theme.typography.body2.fontFamily,
                          }}
                          label={'Mã hóa đơn: ' + bill.id}
                          value={getBillValue(bill)}
                          multiline
                          InputProps={{
                            readOnly: true,
                            style: {
                              pointerEvents: 'auto',
                              borderRadius: '8px',
                            },
                            endAdornment: bill?.id && (
                              <InputAdornment position="end">
                                <CustomIconButton
                                  edge="end"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      bill?.id ?? 'Trống'
                                    );
                                    handleSnackbarAlert(
                                      'success',
                                      'Đã sao chép mã hóa đơn vào clipboard!'
                                    );
                                  }}
                                >
                                  <Tooltip title="Sao chép mã hóa đơn vào clipboard">
                                    <ContentCopyRounded fontSize="small" />
                                  </Tooltip>
                                </CustomIconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
  function getBillValue(bill: BillObject) {
    var result = '';
    result += 'Ngày đặt: ' + formatDateString(bill.created_at);
    if (bill.state == 1 && bill.paymentTime) {
      result += '\nNgày thanh toán: ' + formatDateString(bill.paymentTime);
    }

    result += '\nThành tiền: ' + formatPrice(bill.totalPrice);
    result += '\nGhi chú: ' + bill.note;
    result += '\nTrạng thái: ' + billStatusParse(bill.state);

    return result;
  }
};

export default Profile;

export const getServerSideProps = async () => {
  try {
    const bills = await getCollection<BillObject>(COLLECTION_NAME.BILLS);
    return {
      props: {
        billData: JSON.stringify(bills),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        billData: '',
      },
    };
  }
};
