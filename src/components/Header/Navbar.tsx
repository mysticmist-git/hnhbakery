import {
  AppBar,
  Box,
  Grid,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import logo from '@/assets/Logo.png';
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  memo,
} from 'react';
import Menu from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import Skeleton_img from '../Skeletons/skeleton_img';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { CustomIconButton } from '../Inputs/Buttons';
import { CustomTab, NavbarContextType } from '.';
import CustomDrawer from './CustomDrawer';
import RightMenu from './RightMenu';

//#region Tab

const initTabs = {
  value: 0,
  tabItems: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Tìm kiếm', href: '/search' },
    { label: 'Giới thiệu', href: '/introduce' },
    { label: 'Liên hệ', href: '/contact' },
  ],
};

//#endregion

// #region Context

const initNavbarContext: NavbarContextType = {
  tabs: {},
  drawerOpen: false,
  isSignIn: false,
  handleSetTabState: () => {},
  handleSetDrawerOpenState: () => {},
};

export const NavbarContext =
  createContext<NavbarContextType>(initNavbarContext);
// #endregion

function Navbar() {
  //#region States

  const [tabState, setTabState] = useState({
    ...initTabs,
    value: initialTab(),
  });

  const [drawerOpenState, setDrawerOpenState] = useState(false);

  const [isSignInState, setIsSignInState] = useState(false);

  //#endregion

  //#region Hooks

  const router = useRouter();
  const AuthUser = useAuthUser();
  const theme = useTheme();

  //#endregion

  // #region useMemos

  const { email } = useMemo(() => AuthUser, [AuthUser]);
  const styles = useMemo(
    () => ({
      appBar: {
        top: 16,
        left: 0,
        right: 0,
        bgcolor: theme.palette.secondary.dark,
      },
      gridDesktop: { display: { xs: 'none', lg: 'block' } },
      gridPhone: { display: { xs: 'block', lg: 'none' } },
      boxLogo: {
        position: 'absolute',
        top: -16,
        left: 44,
        width: 117,
        height: 166,
      },
    }),
    [theme],
  );

  // #endregion

  //#region UseEffects

  useEffect(() => {
    setIsSignInState(() => Boolean(email));
    console.log('User Signed In!');
  }, [email]);

  //#endregion

  //#region Handlers

  function handleSetTabState(value: number) {
    setTabState((prev) => ({ ...prev, value: value }));
  }

  const handleSetDrawerOpenState = (open: boolean) => {
    setDrawerOpenState(() => open);
  };

  //#endregion

  //#region Functions

  function initialTab() {
    const router = useRouter();
    const pathname = router.pathname;
    let temp = initTabs.tabItems.findIndex((item) => {
      return item.href === pathname;
    });
    return temp;
  }

  //#endregion

  return (
    <>
      <NavbarContext.Provider
        value={{
          tabs: tabState,
          handleSetTabState: handleSetTabState,
          drawerOpen: drawerOpenState,
          handleSetDrawerOpenState: handleSetDrawerOpenState,
          isSignIn: isSignInState,
        }}
      >
        <AppBar sx={styles.appBar} position="absolute">
          <Toolbar>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item md={3} sx={styles.gridDesktop}>
                <Box sx={styles.boxLogo}>
                  <Skeleton_img src={logo.src} />
                </Box>
              </Grid>

              <Grid item md={6} sx={styles.gridDesktop}>
                <CustomTab />
              </Grid>

              <Grid item md={3} sx={styles.gridDesktop}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <RightMenu />
                </Grid>
              </Grid>

              <Grid item xs={6} sx={styles.gridPhone}>
                <Typography variant="h3" color={theme.palette.common.white}>
                  <a href="#">H&H Bakery</a>
                </Typography>
              </Grid>

              <Grid item xs={6} sx={styles.gridPhone}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <CustomIconButton
                    sx={{ color: theme.palette.common.white }}
                    onClick={() => handleSetDrawerOpenState(true)}
                    children={() => <Menu />}
                  />

                  <CustomDrawer />
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </NavbarContext.Provider>
    </>
  );
}

export default withAuthUser()(memo(Navbar));
