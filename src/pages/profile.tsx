import { LeftProfileColumn, RightProfileColumn } from '@/components/Profile';
import { Card, Container, Grid, useTheme } from '@mui/material';
import React, { memo, useEffect, useMemo, useState } from 'react';
import avatar from '../assets/Logo.png';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { UserObject } from '@/lib/models/User';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

  // #region Ons

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
      setAvatarSrc(user.photoURL ?? '');
    }
  });

  // #endregion

  useEffect(() => {
    const getUser = async () => {
      if (!userId || userId === '') return null;

      // Get users
      const userDoc = await getDoc(doc(db, 'users', userId));

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
  }, [userId]);

  // #endregion

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

export default memo(Profile);
