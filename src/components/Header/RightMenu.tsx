import { Typography, useTheme } from '@mui/material';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useContext, useMemo, memo } from 'react';
import { CustomIconButton, CustomButton } from '../Inputs/Buttons';
import NavbarAvatar from '../NavbarAvatar';
import { NavbarContext } from './Navbar';
import { ShoppingCart } from '@mui/icons-material';

const RightMenu = (props: any) => {
  //#region Hooks

  const theme = useTheme();
  const context = useContext(NavbarContext);
  const router = useRouter();
  const AuthUser = useAuthUser();
  const { photoURL } = useMemo(() => AuthUser, [AuthUser]);

  //#endregion

  //#region Handlers

  function handleLoginRoute() {
    router.push('/auth/login');
  }

  function handleCart() {
    router.push('/cart');
  }

  //#endregion

  return (
    <>
      <CustomIconButton
        onClick={handleCart}
        sx={{
          mr: props.orientation == 'vertical' ? 0 : 1,
          mb: props.orientation == 'vertical' ? 1 : 0,
          color: props.down
            ? theme.palette.secondary.main
            : theme.palette.common.white,
        }}
        children={() => <ShoppingCart />}
      />
      {context.isSignIn ? (
        <NavbarAvatar photoURL={photoURL} />
      ) : (
        <CustomButton
          children={() => (
            <Typography variant="button" color={theme.palette.common.white}>
              Đăng nhập
            </Typography>
          )}
          onClick={handleLoginRoute}
        />
      )}
    </>
  );
};

export default memo(RightMenu);
