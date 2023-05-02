import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import Image from 'next/image';
import logo from '../assets/Logo.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '@mui/icons-material/Menu';

export default function Navbar() {
  //#region Style
  const theme = useTheme();
  const styles = {
    white: {
      color: theme.palette.common.white,
    },
    black: {
      color: theme.palette.common.black,
    },
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

  //#region Tab
  class LinkTabProps {
    label?: string;
    href?: string;
  }

  const listLinkTab: Array<LinkTabProps> = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Tìm kiếm', href: '/search' },
    { label: 'Giới thiệu', href: '' },
    { label: 'Liên hệ', href: '' },
  ];

  function LinkTab(props: LinkTabProps) {
    return (
      <Tab
        component="a"
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          //event.preventDefault();
        }}
        {...props}
      />
    );
  }

  const [tabValue, settabValue] = React.useState(0);
  const handletabValueChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ) => {
    settabValue(newValue);
  };

  function CustomTab(props: any) {
    return (
      <Tabs
        orientation={props.orientation ? props.orientation : 'horizontal'}
        textColor="primary"
        indicatorColor="primary"
        value={tabValue}
        onChange={handletabValueChange}
        centered
      >
        {listLinkTab.map((linktab) => (
          <LinkTab
            key={linktab.href}
            label={linktab.label}
            href={linktab.href}
          />
        ))}
      </Tabs>
    );
  }
  //#endregion

  //#region Drawer
  const [drawerOpen, setdrawerOpen] = React.useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setdrawerOpen(open);
    };

  function CustomDrawer(props: any) {
    return (
      <Drawer
        anchor={'right'}
        open={drawerOpen}
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
  const [isSignIn, setisSignIn] = React.useState(false);

  function CustomAva(props: any) {
    return (
      <Avatar
        src="/src/assets/avatar-gau-cute.jpg"
        sx={
          props.orientation == 'vertical'
            ? { width: 56, height: 56 }
            : { width: 40, height: 40 }
        }
      ></Avatar>
    );
  }

  function RightMenu(props: any) {
    return (
      <>
        <IconButton
          sx={{
            mr: props.orientation == 'vertical' ? 0 : 1,
            mb: props.orientation == 'vertical' ? 1 : 0,
            color: styles.white,
          }}
        >
          <ShoppingCartIcon />
        </IconButton>

        {isSignIn ? (
          <CustomAva orientation={props.orientation} />
        ) : (
          <Button
            style={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.common.white,
            }}
            variant="contained"
          >
            <Typography variant="button">Đăng nhập</Typography>
          </Button>
        )}
      </>
    );
  }
  //#endregion

  return (
    <>
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
                <Image src={logo} alt="Picture of the author" fill priority />
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
              <Typography variant="h3" color={styles.white}>
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
                <IconButton
                  sx={{ color: styles.white }}
                  onClick={toggleDrawer(true)}
                >
                  <Menu />
                </IconButton>
                <CustomDrawer />
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
