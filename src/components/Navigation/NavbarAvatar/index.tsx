import { auth, db } from '@/firebase/config';
import { permissionRouteMap, useAvailablePermissions } from '@/lib/authorize';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getDocFromFirestore } from '@/lib/firestore';
import {
  PermissionObject,
  UserGroup,
  UserObject,
  permissionConverter,
  userGroupConverter,
} from '@/lib/models';
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
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/router';
import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
  const { available, loading, user } = useAvailablePermissions();

  //#region States

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isManager, setIsManager] = useState(false);

  //#endregion

  //#region Hooks

  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

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
    router.push(permissionRouteMap.get(available![0]) ?? '/');
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

  useEffect(() => {
    const execute = async () => {
      try {
        if (!loading && user) {
          const userData = await getDocFromFirestore<UserObject>(
            COLLECTION_NAME.USERS,
            user.uid
          );

          setIsManager(userData.role_id === 'manager');
        }
      } catch (error) {
        console.log(error);
      }
    };

    execute();
  }, [user, loading]);

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
        {isManager && available && available.length > 0 && (
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
