//#region Import

import * as React from 'react';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { Google } from '@mui/icons-material';
import { authMessages } from '@/lib/constants';
import { alpha } from '@mui/system';
import banh1 from '../../assets/Carousel/3.jpg';
import theme from '@/styles/themes/lightTheme';
import CustomTextFieldPassWord from '@/components/Inputs/CustomTextFieldPassWord';
import CustomTextField from '@/components/Inputs/CustomTextField';
import { SignInProps, AuthErrorCode, SignInPropsFromObject } from '@/lib/auth';
import { handleLoginWithGoogle } from '@/lib/auth';
import { signUserInWithEmailAndPassword } from '@/lib/auth/auth';
import { useSnackbarService } from '@/lib/contexts';
import { CustomButton } from '@/components/Inputs/Buttons';
import { memo } from 'react';

//#endregion

//#region Top

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link
        style={{ textDecoration: 'none' }}
        color="inherit"
        href="https://mui.com/"
      >
        H&H Barkery
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

//#endregion

const Login = () => {
  //#region Hooks

  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region Handlers

  const handleSignIn = async (props: SignInProps) => {
    const result = await signUserInWithEmailAndPassword(props);

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

    if (signInData.email === '' || signInData.password === '') {
      handleSnackbarAlert('error', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // The notification will be handle by this function
    await handleSignIn(signInData);
  };

  //#endregion

  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 3, sm: 3, md: 5, lg: 9 },
      }}
    >
      <Box
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: theme.palette.common.white,
        }}
      >
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          direction={'row'}
        >
          <Grid
            item
            xs={0}
            md={6}
            alignSelf={'stretch'}
            display={{ xs: 'none', md: 'block' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${banh1.src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: alpha(theme.palette.common.black, 0.6),
                }}
              >
                <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  direction={'column'}
                  width={'100%'}
                  height={'100%'}
                >
                  <Typography
                    sx={{ color: theme.palette.common.white }}
                    variant="h2"
                    align="center"
                  >
                    H&H
                  </Typography>
                  <Typography
                    sx={{ color: theme.palette.common.white }}
                    variant="h2"
                    align="center"
                  >
                    Barkery
                  </Typography>
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid
              container
              justifyContent={'center'}
              alignItems={'center'}
              direction={'row'}
              sx={{
                py: 8,
                px: 4,
              }}
              spacing={2}
            >
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  direction={'column'}
                >
                  <Typography
                    variant="h2"
                    align="center"
                    color={theme.palette.secondary.main}
                  >
                    Hello
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    color={theme.palette.text.secondary}
                  >
                    Mời bạn một miếng bánh ngon, một tách trà nóng, một ngày an
                    yên.
                  </Typography>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  direction={'row'}
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  spacing={1}
                >
                  <Grid item xs={12}>
                    <CustomTextField
                      required
                      fullWidth
                      id="email"
                      placeholder="Địa chỉ Email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextFieldPassWord
                      required
                      fullWidth
                      name="password"
                      placeholder="Mật khẩu"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      justifyContent={'center'}
                      alignItems={'center'}
                      direction={'row'}
                    >
                      <Grid item xs={7}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value="remember"
                              sx={{ color: theme.palette.secondary.main }}
                              color="secondary"
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.secondary.main,
                              }}
                            >
                              Ghi nhớ đăng nhập
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={5} textAlign={'right'}>
                        <NextLink
                          href="/forgot-password"
                          passHref
                          legacyBehavior
                        >
                          <Link
                            style={{ textDecoration: 'none' }}
                            variant="body2"
                            sx={{
                              color: theme.palette.secondary.main,
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            Quên mật khẩu
                          </Link>
                        </NextLink>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      type="submit"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: '8px',
                      }}
                      children={() => (
                        <Typography
                          sx={{ color: theme.palette.common.white }}
                          variant="body2"
                        >
                          Đăng nhập
                        </Typography>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      startIcon={<Google />}
                      variant="outlined"
                      sx={{
                        py: 1.5,
                        display: 'inline-flex',
                        borderRadius: '8px',
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        bgcolor: theme.palette.common.white,
                        borderWidth: 3,
                        '&:hover': {
                          color: theme.palette.common.white,
                          bgcolor: theme.palette.secondary.main,
                          borderWidth: 3,
                        },
                      }}
                      onClick={handleLoginWithGoogle}
                    >
                      <Typography variant="body2" color={'inherit'}>
                        Đăng nhập với Google
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={'row'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      spacing={1}
                    >
                      <Grid item>
                        <Typography
                          variant="body2"
                          color={theme.palette.text.secondary}
                        >
                          Bạn chưa có tài khoản?
                        </Typography>
                      </Grid>
                      <Grid item>
                        <NextLink href="/signup" passHref legacyBehavior>
                          <Link style={{ textDecoration: 'none' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'bold',
                                color: theme.palette.secondary.main,
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Đăng ký ngay
                            </Typography>
                          </Link>
                        </NextLink>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Copyright sx={{ pt: 5 }} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(Login);
