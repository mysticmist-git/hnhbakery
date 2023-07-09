import banh1 from '@/assets/Carousel/3.jpg';
import bg2 from '@/assets/Decorate/bg2.png';
import { CustomButton } from '@/components/buttons';
import {
  CustomTextField,
  CustomTextFieldPassword,
} from '@/components/Inputs/textFields';
import { auth } from '@/firebase/config';
import { handleLoginWithGoogle } from '@/lib/auth/auth';
import { authMessages } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { SignInInfo } from '@/lib/types/auth';
import theme from '@/styles/themes/lightTheme';
import { Google } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/system';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { memo, useRef } from 'react';

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

  // #region UseRefs

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // #endregion

  //#region Handlers

  const getSigninInfo = (): SignInInfo => {
    return {
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
    };
  };

  const validateSigninInfo = (props: SignInInfo) => {
    if (props.email === '' || props.password === '') {
      handleSnackbarAlert('error', 'Vui lòng nhập đầy đủ thông tin');
      return false;
    }
    return true;
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    const signinInfo = getSigninInfo();

    if (!validateSigninInfo(signinInfo)) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signinInfo.email,
        signinInfo.password
      );

      handleSnackbarAlert('success', 'Đăng nhập thành công');
      router.push('/');
    } catch (error) {
      console.log(error);
      handleSnackbarAlert('error', `Lỗi: ${error}`);
    }
  };

  //#endregion

  return (
    <Box
      sx={{
        backgroundImage: `url(${bg2.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          height: 'auto',
          pt: 8,
          pb: 16,
          minHeight: '650px',
          px: { xs: 3, sm: 3, md: 5, lg: 9 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(to bottom, ${alpha(
            theme.palette.common.black,
            0.4
          )}, ${alpha(theme.palette.primary.main, 0.6)})`,
          backdropFilter: 'blur(1px)',
        }}
      >
        <Grid
          container
          alignItems={'center'}
          direction={'row'}
          justifyContent={'center'}
        >
          <Grid item xs={12} sm={9} md={10} lg={9}>
            <Grid
              container
              justifyContent={'center'}
              alignItems={'center'}
              direction={'row'}
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                bgcolor: theme.palette.common.white,
                border: 3,
                borderColor: theme.palette.secondary.main,
                boxShadow: 3,
              }}
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
                        Mời bạn một miếng bánh ngon, một tách trà nóng, một ngày
                        an yên.
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid
                      container
                      justifyContent={'center'}
                      alignItems={'center'}
                      direction={'row'}
                      spacing={1}
                    >
                      <Grid item xs={12}>
                        <CustomTextField
                          ref={emailRef}
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
                        <CustomTextFieldPassword
                          ref={passwordRef}
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
                          onClick={handleLogin}
                          fullWidth
                          sx={{
                            py: 1.5,
                            borderRadius: '8px',
                          }}
                        >
                          <Typography
                            sx={{ color: theme.palette.common.white }}
                            variant="body2"
                          >
                            Đăng nhập
                          </Typography>
                        </CustomButton>
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
                              Bạn chưa có tài khoản?
                            </Typography>
                          </Grid>
                          <Grid item>
                            <NextLink
                              href="/auth/signup"
                              passHref
                              legacyBehavior
                            >
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
                                  {' '}
                                  Đăng ký ngay
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(Login);
