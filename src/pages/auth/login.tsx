//#region Import

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { Google } from '@mui/icons-material';
import { authMessages } from '@/lib/constants/authConstants';
import { SxProps, Theme } from '@mui/system';
import { SignInProps, AuthErrorCode, SignInPropsFromObject } from '@/lib/auth';
import { handleLoginWithGoogle } from '@/lib/auth';
import { signUserInWithEmailAndPassword } from '@/lib/auth/auth';
import { useSnackbarService } from '@/lib/contexts';

//#endregion

//#region Top

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

//#endregion

export default function Login() {
  //#region Hooks

  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region Handlers

  const handleSignIn = async (props: SignInProps) => {
    const result = await signUserInWithEmailAndPassword(props);

    // console.log(result);

    if (result.result === 'successful') {
      router.push('/');
      handleSnackbarAlert('success', authMessages.signInSucesful);
    } else {
      switch (result.errorCode) {
        case AuthErrorCode.EMAIL_ALREADY_IN_USE:
          handleSnackbarAlert('error', authMessages.emailExisted);
          break;
        case AuthErrorCode.NETWORK_REQUEST_FAILED:
          handleSnackbarAlert('error', authMessages.networkError);
          break;
        default:
          handleSnackbarAlert('error', authMessages.error);
          break;
      }
      return;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const dataObject = Object.fromEntries(data.entries());

    const signInData = SignInPropsFromObject(dataObject);

    console.log(signInData);

    if (signInData.email === '' || signInData.password === '') {
      handleSnackbarAlert('error', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // The notification will be handle by this function
    await handleSignIn(signInData);
  };

  //#endregion

  //#region Styles

  const linkSx: SxProps<Theme> = {
    color: (theme) => theme.palette.secondary.main,
    '&:hover': {
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  //#endregion

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left picture */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Right form */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              color: (theme) => theme.palette.secondary.main,
            }}
          >
            Đăng nhập
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ Email"
              name="email"
              autoComplete="email"
              autoFocus
              color="secondary"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              color="secondary"
            />
            <FormControlLabel
              control={<Checkbox value="remember" />}
              label={
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) => theme.palette.common.black,
                  }}
                >
                  Ghi nhớ đăng nhập
                </Typography>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={(theme) => ({
                mt: 3,
                mb: 2,
                backgroundnColor: theme.palette.secondary.main,
                color: theme.palette.common.white,
              })}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item xs>
                <NextLink href="/auth/forgot-password" passHref legacyBehavior>
                  <Link variant="body2" sx={linkSx}>
                    Quên mật khẩu
                  </Link>
                </NextLink>
              </Grid>
              <Grid item>
                <NextLink href="/auth/signup" passHref legacyBehavior>
                  <Link variant="body2" sx={linkSx}>
                    {'Không có tài khoản? Đăng ký ngay'}
                  </Link>
                </NextLink>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  startIcon={<Google />}
                  variant="outlined"
                  color="secondary"
                  sx={{
                    mt: '1rem',
                  }}
                  onClick={handleLoginWithGoogle}
                >
                  <Typography variant="body2">Đăng nhập với Google</Typography>
                </Button>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
