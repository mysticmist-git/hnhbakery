import { auth } from '@/firebase/config';
import { Path, permissionRouteMap } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import useGrantedPermissions from '@/lib/hooks/useGrantedPermissions';
import theme from '@/styles/themes/lightTheme';
import { AccountCircle, Logout, ViewInAr } from '@mui/icons-material';
import { SxProps, Theme, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import * as React from 'react';
import { memo, useMemo } from 'react';

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
  //#region Hooks

  const grantedPermissions: string[] = useGrantedPermissions();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  //#endregion

  //#region UseMemos

  const isManager = useMemo(
    () => grantedPermissions.length > 0,
    [grantedPermissions]
  );

  //#endregion

  //#region Handlers

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(() => event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(() => null);
  };

  const handleOpenProfile = () => {
    router.push(Path.PROFILE);
    setAnchorEl(() => null);
  };

  const handleOpenManagement = () => {
    router.push(permissionRouteMap.get(grantedPermissions![0]) ?? '/');
    setAnchorEl(() => null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleClose();
    handleSnackbarAlert('success', 'Đã đăng xuất tài khoản');
    router.push(Path.LOGIN);
  };

  //#endregion

  // #region

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
        {isManager && (
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
