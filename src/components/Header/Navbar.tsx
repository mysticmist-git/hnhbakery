//#region Imports

import { ShoppingCart } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { NavbarButton } from '@/components/Header';
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import NavbarAvatar from '@/components/NavbarAvatar';

//#endregion

function Navbar() {
  //#region Hooks

  const router = useRouter();
  const AuthUser = useAuthUser();
  const { email, photoURL } = AuthUser;

  //#endregion

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.dark,
      }}
    >
      <Container>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" passHref legacyBehavior>
            <a
              style={{
                textDecoration: 'none',
              }}
            >
              <Typography
                variant="h5"
                fontWeight={'bold'}
                sx={{
                  color: (theme) => theme.palette.common.white,
                }}
              >
                H&H Bakery
              </Typography>
            </a>
          </Link>

          <Box display={'flex'} justifyContent={'space-between'}>
            <Link href={'/'}>
              <NavbarButton variant="text" isActive={router.pathname === '/'}>
                Trang chủ
              </NavbarButton>
            </Link>
            <Link href={'/products'}>
              <NavbarButton
                variant="text"
                isActive={router.pathname === '/products'}
              >
                Sản phẩm
              </NavbarButton>
            </Link>
            <Link href={'/about'}>
              <NavbarButton
                variant="text"
                isActive={router.pathname === '/about'}
              >
                Giới thiệu
              </NavbarButton>
            </Link>
            <Link href={'/contact'}>
              <NavbarButton
                variant="text"
                isActive={router.pathname === '/contact'}
              >
                Liên hệ
              </NavbarButton>
            </Link>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link href="/cart">
              <IconButton
                sx={{
                  color: (theme) => theme.palette.common.white,
                }}
                aria-label="open cart"
                component="label"
              >
                <ShoppingCart />
              </IconButton>
            </Link>
            {!email ? (
              <Link href="/auth">
                <Button
                  variant="contained"
                  sx={{
                    '&&': {
                      backgroundColor: (theme) => theme.palette.secondary.main,
                    },
                  }}
                >
                  Đăng nhập
                </Button>
              </Link>
            ) : (
              <NavbarAvatar photoURL={photoURL} />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// Note that this is a higher-order function.
// export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Navbar);
