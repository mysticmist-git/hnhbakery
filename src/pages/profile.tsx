import avatar from '@/assets/Logo.png';
import ImageBackground from '@/components/Imagebackground';
import { LeftProfileColumn } from '@/components/profile';
import RightProfileColumn from '@/components/profile/RightProfileColumn';
import { db } from '@/firebase/config';
import { UserObject } from '@/lib/models';
import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import React, { memo, useEffect, useMemo, useState } from 'react';

const Profile = () => {
  // #region states

  const [userData, setUserData] = useState<UserObject>({} as UserObject);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [userId, setUserId] = useState('');

  // #endregion

  // #region Hooks

  const theme = useTheme();
  const auth = getAuth();

  // #endregion

  // #region useEffects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setAvatarSrc(user.photoURL ?? '');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      if (!userId || userId === '') return null;

      // Get users
      const userDoc = await getDoc(doc(db, 'users', userId));

      var userData = {
        id: userDoc.id,
        ...userDoc.data(),
        birthday: userDoc.data()?.birthday
          ? new Date(
              (userDoc.data()?.birthday as Timestamp).seconds * 1000 +
                7 * 60 * 60 * 1000
            )
          : new Date(),
        lastLogin: userDoc.data()?.lastLogin
          ? new Date(
              (userDoc.data()?.lastLogin as Timestamp).seconds * 1000 +
                7 * 60 * 60 * 1000
            )
          : new Date(),
        addresses: userDoc.data()?.addresses ?? [],
      } as UserObject;

      console.log(userData);

      setUserData(() => userData);
    };

    getUser();
  }, [userId]);

  // #endregion

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
                LeftProfileBasicInfo={{
                  avatarSrc: avatarSrc,
                  // address: userData.addresses ?? 'Không',
                  address: 'Không',
                  email: userData.mail ?? 'Không',
                  name: userData.name ?? 'Không',
                  phone: userData.tel ?? 'Không',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <RightProfileColumn userData={userData} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default memo(Profile);
