import ImageBackground from '@/components/Imagebackground';
import { LeftProfileColumn } from '@/components/Profile';
import RightProfileColumn from '@/components/Profile/RightProfileColumn/RightProfileColumn';
import { auth } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { updateDocToFirestore } from '@/lib/firestore';
import useUserData from '@/lib/hooks/userUserData';
import { UserObject } from '@/lib/models';
import { Box, Grid, Link, Skeleton, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile = () => {
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
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Profile;
