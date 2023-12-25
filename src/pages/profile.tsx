import ImageBackground from '@/components/Imagebackground';
import { LeftProfileColumn } from '@/components/profile';
import RightProfileColumn from '@/components/profile/RightProfileColumn';
import { auth } from '@/firebase/config';
import { getUserTableRowByUID, updateUser } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import useLoadingService from '@/lib/hooks/useLoadingService';
import { BillState as BillStateType } from '@/models/bill';
import User, { UserTableRow } from '@/models/user';
import {
  Box,
  Grid,
  Link,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Profile_Orders } from '../components/profile/Profile_Orders';
import CustomerRank from '@/models/customerRank';
import { getCustomerRank } from '@/lib/DAO/customerRankDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';

export const BoxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

export const TypoStyle: TypographyProps = {
  variant: 'caption',
  fontWeight: 'regular',
};

const Profile = () => {
  //#region Hooks

  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  const [load, stop] = useLoadingService();

  //#endregion

  // #region states

  const [user, userLoading, userError] = useAuthState(auth);
  // const [myBills, setMyBills] = useState<BillObject[]>([]);
  const [userData, setUserData] = useState<UserTableRow>();
  console.log(userData);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/');
    }
  }, [router, user, userLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        if (user && user.uid && user.uid != '') {
          const userData = await getUserTableRowByUID(user.uid);
          if (userData) {
            setUserData(userData);
          }
        }
        stop();
      } catch (error) {
        console.log(error);
        stop();
      }
    };

    fetchData();
  }, [load, stop, user]);

  // #endregion

  //#region Methods

  const reload = useCallback(() => {
    const fetchData = async () => {
      load();
      setUserData(await getUserTableRowByUID(user?.uid ?? ''));
      stop();
    };

    fetchData();
  }, [load, stop, user?.uid]);

  //#endregion

  //#region Handlers

  const handleUpdateUserData = async (
    field: keyof User,
    value: User[keyof User]
  ) => {
    if (!userData) return;
    const { bills, addresses, feedbacks, ...data } = userData;
    const updateData = { ...data, [field]: value };

    await updateUser(data.group_id, data.id, updateData);
    setUserData({ ...userData, [field]: value });
    handleSnackbarAlert('success', 'Cập nhật thành công');
  };

  //#endregion

  //#region Tab
  const [tabValue, setTabValue] = useState('1');

  const handleTabValueChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTabValue(newValue);
  };
  //#endregion

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
                Thông tin cá nhân
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </ImageBackground>

      {!user ? undefined : (
        <Box
          component={'div'}
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
            <Grid item xs={12}>
              <Tabs
                value={tabValue}
                onChange={handleTabValueChange}
                textColor="secondary"
                indicatorColor="secondary"
                centered
              >
                <Tab value="1" label="Thông tin cá nhân" />
                <Tab
                  value="2"
                  disabled={userData?.group_id != DEFAULT_GROUP_ID}
                  label="Lịch sử mua hàng"
                />
              </Tabs>
            </Grid>

            {tabValue === '1' && (
              <>
                <Grid item xs={12} sm={4} md={3}>
                  <Box
                    component={'div'}
                    sx={{
                      backgroundColor: theme.palette.common.white,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: 3,
                      p: 2,
                    }}
                  >
                    <LeftProfileColumn
                      image={userData?.avatar ?? ''}
                      userId={userData?.id ?? ''}
                      onUpdateUserData={handleUpdateUserData}
                      customerRandImage={userData?.customerRank?.image}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={8} md={9}>
                  <RightProfileColumn
                    user={user}
                    userData={userData}
                    reload={reload}
                    onUpdateUserData={handleUpdateUserData}
                  />
                </Grid>
              </>
            )}

            {tabValue === '2' && (
              <Grid item xs={12}>
                <Profile_Orders userData={userData} />
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Profile;
