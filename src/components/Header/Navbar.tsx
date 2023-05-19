import {
  AppBar,
  Box,
  Grid,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  alpha,
  useScrollTrigger,
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
import Link from 'next/link';

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
  const styles = useMemo(
    () => ({
      appBar: {},
      gridDesktop: { display: { xs: 'none', lg: 'block' } },
      gridPhone: { display: { xs: 'block', lg: 'none' } },
      boxLogo: {
        position: 'absolute',
        top: 0,
        left: 44,
        width: 117,
        height: 166,
      },
    }),
    [theme],
  );

  //#endregion

  // #region useMemos

  const { email } = useMemo(() => AuthUser, [AuthUser]);

  // #endregion

  //#region UseEffects

  useEffect(() => {
    setIsSignInState(() => Boolean(email));
    console.log('User Signed In!');
  }, [email]);

  //#endregion

  //#region Handlers

  function handleSetTabState(value: number) {
    setTabState((currentTabState) => ({ ...currentTabState, value: value }));
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
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > 310) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
        <Slide appear={false} direction="down" in={!isScrolled}>
          <AppBar
            sx={{
              top: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(to bottom, ${alpha(
                theme.palette.common.black,
                0.5,
              )}, ${alpha(theme.palette.common.black, 0)})`,
              boxShadow: 'none',
            }}
            position="fixed"
          >
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
                  <CustomTab down={isScrolled} />
                </Grid>

                <Grid item md={3} sx={styles.gridDesktop}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <RightMenu down={isScrolled} />
                  </Grid>
                </Grid>

                <Grid item xs={6} sx={styles.gridPhone}>
                  <Link href="#" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="h3"
                      color={
                        isScrolled
                          ? theme.palette.secondary.main
                          : theme.palette.common.white
                      }
                    >
                      H&H Bakery
                    </Typography>
                  </Link>
                </Grid>

                <Grid item xs={6} sx={styles.gridPhone}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <CustomIconButton
                      sx={{
                        color: isScrolled
                          ? theme.palette.secondary.main
                          : theme.palette.common.white,
                      }}
                      onClick={() => handleSetDrawerOpenState(true)}
                      children={() => <Menu />}
                    />

                    <CustomDrawer />
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Slide>
        <Slide appear={false} direction="down" in={isScrolled}>
          <AppBar
            sx={{
              top: { lg: 0, xs: 0 },
              left: 0,
              right: 0,
              background: theme.palette.common.white,
              borderBottom: 1,
              borderColor: theme.palette.text.secondary,
              boxShadow: isScrolled ? 'none' : 3,
            }}
            position="fixed"
          >
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
                  <CustomTab down={isScrolled} />
                </Grid>

                <Grid item md={3} sx={styles.gridDesktop}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <RightMenu down={isScrolled} />
                  </Grid>
                </Grid>

                <Grid item xs={6} sx={styles.gridPhone}>
                  <Link href="#" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="h3"
                      color={
                        isScrolled
                          ? theme.palette.secondary.main
                          : theme.palette.common.white
                      }
                    >
                      H&H Bakery
                    </Typography>
                  </Link>
                </Grid>

                <Grid item xs={6} sx={styles.gridPhone}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <CustomIconButton
                      sx={{
                        color: isScrolled
                          ? theme.palette.secondary.main
                          : theme.palette.common.white,
                      }}
                      onClick={() => handleSetDrawerOpenState(true)}
                      children={() => <Menu />}
                    />

                    <CustomDrawer />
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Slide>
      </NavbarContext.Provider>
    </>
  );
}

export default memo(withAuthUser()(Navbar));
