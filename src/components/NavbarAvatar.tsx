import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/config';
import { SxProps, Theme, Typography } from '@mui/material';
import { AccountCircle, Logout, ViewInAr } from '@mui/icons-material';
import { useSnackbarService } from '@/lib/contexts';
import { memo } from 'react';
import theme from '@/styles/themes/lightTheme';

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
    router.push('/manager/manage');
    setAnchorEl(() => null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleClose();
    handleSnackbarAlert('success', 'Đã đăng xuất tài khoản');
  };

  //#endregion

  // #region

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/');
    }
  });

  //#endregion

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
        <MenuItem onClick={handleOpenManagement} sx={menuItemSx}>
          <ViewInAr />
          <Typography variant="body2" color={theme.palette.common.black}>
            Quản lý
          </Typography>
        </MenuItem>
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
