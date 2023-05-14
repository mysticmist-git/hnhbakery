import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import logo from '../assets/Logo.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Skeleton_img from './skeleton_img';

export default function Navbar() {
  //#region Style
  const theme = useTheme();
  const styles = {
    white: {
      color: theme.palette.common.white,
    },
    gray: {
      color: theme.palette.text.secondary,
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
  interface LinkTabProps {
    label: string;
    href: string;
  }

  const listLinkTab: Array<LinkTabProps> = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Tìm kiếm', href: '/search' },
    { label: 'Giới thiệu', href: '/introduce' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  function initialTab() {
    const router = useRouter();
    const pathname = router.pathname;
    let temp = listLinkTab.findIndex((item) => {
      return item.href === pathname;
    });
    return temp;
  }

  function CustomTab(props: any) {
    const [tabValue, settabValue] = React.useState(initialTab());
    const handletabValueChange = (
      event: React.SyntheticEvent,
      newValue: number,
    ) => {
      settabValue(newValue);
    };

    const [hoveredIndex, setHoveredIndex] = React.useState(-1);

    return (
      <Tabs
        orientation={props.orientation ? props.orientation : 'horizontal'}
        textColor="primary"
        indicatorColor="primary"
        value={tabValue}
        onChange={handletabValueChange}
        centered
      >
        {listLinkTab.map((linktab, index) => (
          <Tab
            component={Link}
            key={index}
            label={linktab.label}
            href={linktab.href}
            sx={{
              color: index === hoveredIndex ? styles.white : styles.gray,
              '&.Mui-selected': {
                color: styles.white,
              },
            }}
            onMouseEnter={() => {
              setHoveredIndex(index);
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

  //#region Logo

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
