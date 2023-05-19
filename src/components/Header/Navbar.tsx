import {
  AppBar,
  Box,
  Drawer,
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
import React, { createContext, useState, useContext, useEffect } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Skeleton_img from '../Skeletons/skeleton_img';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import NavbarAvatar from '../NavbarAvatar';
import { CustomIconButton, CustomButton } from '../Inputs/Buttons';

//#region Tab
interface TabItem {
  label: string;
  href: string;
}

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

function CustomTab(props: any) {
  const theme = useTheme();
  const context = useContext(NavbarContext);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  return (
    <Tabs
      orientation={props.orientation ? props.orientation : 'horizontal'}
      textColor="primary"
      indicatorColor="primary"
      value={context.tabs.value}
      onChange={(e: React.SyntheticEvent, newValue: number) =>
        context.handleSetTabState(newValue)
      }
      centered
    >
      {context.tabs.tabItems.map((item: TabItem, i: number) => (
        <Tab
          component={Link}
          key={i}
          label={item.label}
          href={item.href}
          sx={{
            color: props.down
              ? i === hoveredIndex
                ? theme.palette.secondary.main
                : theme.palette.primary.dark
              : i === hoveredIndex
              ? theme.palette.common.white
              : theme.palette.primary.light,
            '&.Mui-selected': {
              color: props.down
                ? theme.palette.secondary.main
                : theme.palette.common.white,
            },
          }}
          onMouseEnter={() => {
            setHoveredIndex(i);
          }}
          onMouseLeave={() => {
            setHoveredIndex(-1);
          }}
        />
      ))}
    </Tabs>
  );
}
//#endregion

//#region Drawer
function CustomDrawer(props: any) {
  const theme = useTheme();
  const context = useContext(NavbarContext);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      context.handleSetDrawerOpenState(open);
    };

  return (
    <Drawer
      anchor={'right'}
      open={context.drawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.secondary.dark,
        },
      }}
    >
      <Grid
        sx={{ p: 1 }}
        height={'100%'}
        container
        direction={'column'}
        justifyContent={'space-between'}
        alignItems={'center'}
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Grid item>
          <CustomTab orientation="vertical" />
        </Grid>
        <Grid item sx={{ mb: 2 }}>
          <Grid container direction={'column'} alignItems={'center'}>
            <RightMenu orientation="vertical" />
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  );
}
//#endregion

//#region RightMenu
function RightMenu(props: any) {
  //#region Hooks

  const theme = useTheme();
  const context = useContext(NavbarContext);
  const router = useRouter();
  const AuthUser = useAuthUser();
  const { photoURL } = AuthUser;

  //#endregion

  //#region Handlers

  function handleLoginRoute() {
    router.push('/auth/login');
  }

  //#endregion

  return (
    <>
      <CustomIconButton
        sx={{
          mr: props.orientation == 'vertical' ? 0 : 1,
          mb: props.orientation == 'vertical' ? 1 : 0,
          color: props.down
            ? theme.palette.secondary.main
            : theme.palette.common.white,
        }}
        children={() => <ShoppingCartIcon />}
      />
      {context.isSignIn ? (
        <NavbarAvatar photoURL={photoURL} />
      ) : (
        // <Avatar
        //   src={photoURL ? photoURL : undefined}
        //   sx={
        //     props.orientation == 'vertical'
        //       ? { width: 56, height: 56 }
        //       : { width: 40, height: 40 }
        //   }
        //   onClick={() => {}}
        // />
        <CustomButton
          children={() => <Typography variant="button">Đăng nhập</Typography>}
          onClick={handleLoginRoute}
        />
      )}
    </>
  );
}
//#endregion

// #region Context
export interface NavbarContextType {
  tabs: any;
  handleSetTabState: any;
  drawerOpen: boolean;
  handleSetDrawerOpenState: any;
  isSignIn: boolean;
}

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
  const { email } = AuthUser;

  const theme = useTheme();
  const styles = {
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
  };

  //#endregion

  //#region UseEffects

  useEffect(() => {
    setIsSignInState(Boolean(email));
    console.log('User Signed In!');
  }, [email]);

  //#endregion

  //#region Handlers

  function handleSetTabState(value: number) {
    setTabState({ ...tabState, value: value });
  }

  const handleSetDrawerOpenState = (open: boolean) => {
    setDrawerOpenState(open);
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
    if (currentScrollPos > 0) {
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
              top: { lg: 0, xs: 0 },
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

export default withAuthUser()(Navbar);
