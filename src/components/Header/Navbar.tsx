import {
  AppBar,
  Box,
  Grid,
  Slide,
  Toolbar,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import logo from '@/assets/Logo.png';
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  memo,
  useContext,
} from 'react';
import Menu from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import Skeleton_img from '../Skeletons/skeleton_img';
import { CustomIconButton } from '../Inputs/Buttons';
import { CustomTab, NavbarContextType } from '.';
import CustomDrawer from './CustomDrawer';
import RightMenu from './RightMenu';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

//#region ToolBarContent
function CustomToolBarContent(props: any) {
  const theme = useTheme();
  const context = useContext(NavbarContext);
  const { isScrolled, handleSetDrawerOpenState } = context;
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item md={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 44,
              width: 117,
              height: 166,
            }}
          >
            <Skeleton_img src={logo.src} />
          </Box>
        </Grid>

        <Grid item md={6} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <CustomTab down={isScrolled} />
        </Grid>

        <Grid item md={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <RightMenu down={isScrolled} />
          </Grid>
        </Grid>

        <Grid item xs={6} sx={{ display: { xs: 'block', lg: 'none' } }}>
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

        <Grid item xs={6} sx={{ display: { xs: 'block', lg: 'none' } }}>
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
            >
              <Menu />
            </CustomIconButton>

            <CustomDrawer />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
//#endregion

// #region Context

const initNavbarContext: NavbarContextType = {
  tabs: {},
  drawerOpen: false,
  isSignIn: false,
  handleSetTabState: () => {},
  handleSetDrawerOpenState: () => {},
  isScrolled: false,
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

  const auth = getAuth();
  const theme = useTheme();

  //#endregion

  // #region Ons

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsSignInState(true);
    } else {
      setIsSignInState(false);
    }
  });

  // #endregion

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

  //#region Scroll
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > 180) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
          isScrolled,
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
                0.7,
              )}, ${alpha(theme.palette.common.black, 0)})`,
              backdropFilter: 'blur(1px)',
              boxShadow: 'none',
            }}
            position="fixed"
          >
            <Toolbar>
              <CustomToolBarContent />
            </Toolbar>
          </AppBar>
        </Slide>
        <Slide appear={false} direction="down" in={isScrolled}>
          <AppBar
            sx={{
              top: 0,
              left: 0,
              right: 0,
              background: alpha(theme.palette.common.white, 0.95),
              borderBottom: 1,
              borderColor: theme.palette.text.secondary,
              backdropFilter: 'blur(2px)',
              boxShadow: 'none',
            }}
            position="fixed"
          >
            <Toolbar>
              <CustomToolBarContent />
            </Toolbar>
          </AppBar>
        </Slide>
      </NavbarContext.Provider>
    </>
  );
}

export default memo(Navbar);
