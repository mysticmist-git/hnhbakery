import logo from '@/assets/Logo.png';
import { CustomIconButton } from '@/components/buttons';
import {
  CustomTab,
  NavbarContextType,
  RightMenu,
} from '@/components/navigation/Header';
import CustomDrawer from '@/components/navigation/Header/CustomDrawer';
import { LOCAL_CART_KEY } from '@/lib/constants';
import Menu from '@mui/icons-material/Menu';
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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

//#region Tab

const initTabs = {
  value: 0,
  tabItems: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Đặt bánh', href: '/booking' },
    // { label: 'Tìm kiếm', href: '/search' },
    { label: 'Về H&H', href: '/about' },
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
            component={'div'}
            sx={{
              position: 'absolute',
              top: 0,
              left: 44,
              width: 117,
              height: 166,
            }}
          >
            <Box
              fill={true}
              sx={{
                objectFit: 'cover',
              }}
              component={Image}
              loading="lazy"
              alt=""
              src={logo.src}
            />
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
  cartCount: 0,
};

export const NavbarContext =
  createContext<NavbarContextType>(initNavbarContext);
// #endregion

function Navbar() {
  //#region States

  const router = useRouter();

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

  // #region useEffects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignInState(() => true);
      } else {
        setIsSignInState(() => false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

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
    const pathname = router.pathname;
    let temp = initTabs.tabItems.findIndex((item) => {
      return item.href === pathname;
    });
    return temp === -1 ? 0 : temp;
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

  //#region CartCount Hên ở đây nè Hên!
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const currentLocalCart = localStorage.getItem(LOCAL_CART_KEY);
    if (!currentLocalCart) {
      if (cartCount != 0) {
        setCartCount(0);
      }
    } else {
      const currentCart = JSON.parse(currentLocalCart);

      const total = currentCart.reduce((acc: number, item: any) => {
        return acc + item._quantity;
      }, 0);

      if (cartCount != total) {
        setCartCount(total);
      }
    }
  });

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
          cartCount,
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
                0.7
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
