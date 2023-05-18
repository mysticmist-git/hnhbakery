import {
  AppBar,
  Box,
  Drawer,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import logo from '@/assets/Logo.png';
import React, { createContext, useState, useContext, useEffect } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CustomIconButton from '../Inputs/Buttons/customIconButton';
import CustomButton from '../Inputs/Buttons/customButton';
import Skeleton_img from '../Skeletons/skeleton_img';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import NavbarAvatar from '../NavbarAvatar';

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
            color:
              i === hoveredIndex
                ? theme.palette.common.white
                : theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.common.white,
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
          color: theme.palette.common.white,
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

export default withAuthUser()(Navbar);
