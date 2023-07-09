import { auth } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import { getDocFromFirestore } from '@/lib/firestore';
import { UserObject } from '@/lib/models';
import theme from '@/styles/themes/lightTheme';
import {
  AccountCircle,
  KeyboardReturnTwoTone,
  Logout,
  ViewInAr,
} from '@mui/icons-material';
import { SxProps, Theme, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { User, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import * as React from 'react';
import { memo, useEffect, useState } from 'react';

interface Props {
  photoURL: string | null;
}

const menuItemSx: SxProps<Theme> = {
  alignItems: 'center',
  justifyContent: 'start',
  color: (theme) => theme.palette.common.black,
  width: 160,
  gap: 1,
};

const NavbarAvatar = ({ photoURL }: { photoURL: string | null }) => {
  //#region States

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isCustomer, setIsCustomer] = useState(true);

  //#endregion

  //#region Hooks

  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();
  const auth = getAuth();

  //#endregion

  //#region Handlers

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(() => event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(() => null);
  };

  const handleOpenProfile = () => {
    router.push('/profile');
    setAnchorEl(() => null);
  };

  const handleOpenManagement = () => {
    router.push('/manager/dashboard');
    setAnchorEl(() => null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleClose();
    handleSnackbarAlert('success', 'Đã đăng xuất tài khoản');
    router.push('/');
  };

  //#endregion

  // #region

  //#endregion

  // #region Ons

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const doStuffs = async (_user: User) => {
        const userId = _user.uid;

        try {
          const user = (await getDocFromFirestore(
            'users',
            userId
          )) as UserObject;

          setIsCustomer(() => user.role_id === 'customer');
        } catch (error: any) {
          console.log(error);
          handleSnackbarAlert('error', `Lỗi: ${error.message}`);
        }
      };

      if (user) doStuffs(user);

      return () => {
        unsubscribe();
      };
    });
  }, []);

  // #endregion

  return (
    <>
      <Avatar src={photoURL as string | undefined} onClick={handleClick} />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleOpenProfile} sx={menuItemSx}>
          <AccountCircle />
          <Typography variant="body2" color={theme.palette.common.black}>
            Tài khoản
          </Typography>
        </MenuItem>
        {!isCustomer && (
          <MenuItem onClick={handleOpenManagement} sx={menuItemSx}>
            <ViewInAr />
            <Typography variant="body2" color={theme.palette.common.black}>
              Quản lý
            </Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout} sx={menuItemSx}>
          <Logout />
          <Typography variant="body2" color={theme.palette.common.black}>
            Đăng xuất
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default memo(NavbarAvatar);
