import { LeftProfileColumn, RightProfileColumn } from '@/components/Profile';
import { Card, Container, Grid, useTheme } from '@mui/material';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import avatar from '@/assets/avatar-gau-cute.jpg';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { UserObject } from '@/lib/models/User';

const Profile = () => {
  // #region states

  const [userData, setUserData] = useState<UserObject>({} as UserObject);

  // #endregion

  // #region Hooks

  const theme = useTheme();
  const authUserContext = useAuthUser();

  // #endregion

  // #region useMemos

  const avatarSrc = useMemo(() => {
    return authUserContext.photoURL ?? avatar.src;
  }, [authUserContext.photoURL]);

  // #endregion

  // #region useEffects

  useEffect(() => {
    const getUser = async () => {
      if (!authUserContext.id) return null;

      // Get users
      const userDoc = await getDoc(doc(db, 'users', authUserContext.id));

      const userData = {
        id: userDoc.id,
        ...userDoc.data(),
        lastLogin: (
          (userDoc.data()?.lastLogin as Timestamp) ?? new Date()
        ).toDate(),
      } as UserObject;

      setUserData(() => userData);
    };

    getUser();
  }, []);

  // #endregion

  console.log(userData);

  return (
    <Container
      sx={{
        mt: 10,
      }}
    >
      <Grid container columnSpacing={1}>
        <Grid
          item
          xs={4}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <LeftProfileColumn
            LeftProfileBasicInfo={{
              avatarSrc: avatarSrc,
              address: userData.address ?? 'Không',
              email: userData.email ?? 'Không',
              name: userData.name ?? 'Không',
              phone: userData.phone ?? 'Không',
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <RightProfileColumn />
        </Grid>
      </Grid>
    </Container>
  );
};

export default withAuthUser()(memo(Profile));
