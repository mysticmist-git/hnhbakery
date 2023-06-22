import { Box, Typography, useTheme } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { useRouter } from 'next/router';
import { useContext, useMemo, memo, useState, useEffect } from 'react';
import { CustomIconButton, CustomButton } from '../Inputs/Buttons';
import NavbarAvatar from '../NavbarAvatar';
import { NavbarContext } from './Navbar';
import { Receipt, ShoppingCart } from '@mui/icons-material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const RightMenu = (props: any) => {
  //#region Hooks

  const theme = useTheme();
  const context = useContext(NavbarContext);
  const { cartCount } = context;
  const router = useRouter();
  const auth = getAuth();

  //#endregion

  // #region States

  const [photoURL, setPhotoURL] = useState('');

  // #endregion

  //#region Handlers

  function handleLoginRoute() {
    router.push('/auth/login');
  }

  function handleCart() {
    router.push('/cart');
  }

  //#endregion

  // #region UseEffects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPhotoURL(user.photoURL ?? '');
      }
    });

    return () => unsubscribe();
  }, []);

  // #endregion

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
      >
        <ShoppingCart />
        {cartCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              right: '60%',
              top: 0,
              width: 'auto',
              minWidth: '50%',
              minHeight: '50%',
              height: 'auto',
              bgcolor: !props.down
                ? theme.palette.secondary.main
                : theme.palette.common.white,
              border: '1.5px solid',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                color: props.down
                  ? theme.palette.secondary.main
                  : theme.palette.common.white,
              }}
            >
              {cartCount}
            </Typography>
          </Box>
        )}
      </CustomIconButton>
      {context.isSignIn ? (
        <NavbarAvatar photoURL={photoURL ?? ''} />
      ) : (
        <CustomButton onClick={handleLoginRoute}>
          <Typography variant="button" color={theme.palette.common.white}>
            Đăng nhập
          </Typography>
        </CustomButton>
      )}
    </>
  );
};

export default memo(RightMenu);
