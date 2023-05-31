import { Typography, useTheme } from '@mui/material';
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
