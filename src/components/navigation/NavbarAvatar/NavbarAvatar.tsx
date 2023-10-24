import { auth } from '@/firebase/config';
import {
  Path,
  PermissionCode,
  permissionRouteMap,
  permissionToCodeMap,
} from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import useGrantedPermissions from '@/lib/hooks/useGrantedPermissions';
import theme from '@/styles/themes/lightTheme';
import { AccountCircle, Logout, ViewInAr } from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
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

  console.log(grantedPermissions);

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
    let path: PermissionCode | undefined = undefined;

    permissionToCodeMap.forEach((value, key) => {
      if (path) return;
      if (grantedPermissions![0] === value) {
        path = key;
      }
    });

    router.push(permissionRouteMap.get(path!) ?? '/');
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
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box
          sx={{
            boxShadow: 2,
          }}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleOpenProfile}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2">Thông tin cá nhân</Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>

            {isManager && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleOpenManagement}>
                  <ListItemIcon>
                    <ViewInAr fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">Quản lý</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )}

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2">Đăng xuất</Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default memo(NavbarAvatar);
