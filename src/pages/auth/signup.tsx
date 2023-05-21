import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { auth } from '@/firebase/config';
import {
  createUserWithEmailAndPassword,
  User,
  UserCredential,
} from 'firebase/auth';
import Copyright from '@/components/Copyright';
import { useRouter } from 'next/router';
import theme from '@/styles/themes/lightTheme';
import { SignUpProps, AuthResult, AuthErrorCode, addUser } from '@/lib/auth';
import { useSnackbarService } from '@/lib/contexts';
import { SignUpForm } from '@/components/Auths';
import { alpha, Grid } from '@mui/material';
import bg2 from '../../assets/Decorate/bg2.png';
import banh1 from '../../assets/Carousel/3.jpg';

const SignUp = () => {
  //region Hooks

  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region Handlers

  const handleSignUp = async (
    props: SignUpProps,
  ): Promise<UserCredential | undefined> => {
    const result: AuthResult = await signUpUser(props);

    if (result.result === 'successful') {
      router.push('/');
      handleSnackbarAlert('success', 'Đăng ký thành công');
      addUser(result.userCredential!);
      return result.userCredential;
    }

    switch (result.errorCode) {
      case AuthErrorCode.EMAIL_ALREADY_IN_USE:
        handleSnackbarAlert('error', 'Email đã được sử dụng');
      case AuthErrorCode.NETWORK_REQUEST_FAILED:
        handleSnackbarAlert('error', 'Lỗi mạng');
      default:
        handleSnackbarAlert('error', `Đã có lỗi xảy ra: ${result.errorCode}`);
    }
  };

  //#endregion

  //#region Functions

  const signUpUser = async (props: SignUpProps): Promise<AuthResult> => {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, props.email, props.password);
      const result: AuthResult = {
        result: 'successful',
        userCredential: userCredential,
      };
      return result;
    } catch (error: any) {
      const errorCode = error?.code;
      const errorMessage = error.message;
      const returnedError: AuthResult = {
        result: 'fail',
        errorCode,
        errorMessage,
      };
      return returnedError;
    }
  };

  const validate = (data: any): boolean => {
    if (
      data.firstName === '' ||
      data.lastName === '' ||
      data.email === '' ||
      data.password === ''
    ) {
      return false;
    }

    return true;
  };

  //#endregion

  return (
    <>
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
              theme.palette.primary.main,
              0.8,
            )}, ${alpha(theme.palette.primary.main, 0.8)})`,
            backdropFilter: 'blur(1px)',
          }}
        >
          <Grid
            container
            alignItems={'center'}
            direction={'row'}
            justifyContent={'center'}
          >
            <Grid item xs={12} sm={9} md={6} lg={6}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${banh1.src})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: 3,
                  borderColor: theme.palette.secondary.main,
                  boxShadow: 3,
                }}
              >
                <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  direction={'row'}
                  sx={{
                    py: 8,
                    px: 4,
                    background: alpha(theme.palette.common.black, 0.75),
                    backdropFilter: 'blur(1px)',
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant="h3"
                      align="center"
                      color={theme.palette.common.white}
                    >
                      Chào mừng đến với
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="h2"
                      align="center"
                      color={theme.palette.common.white}
                    >
                      H&H Barkery
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <SignUpForm
                      handleSignUp={handleSignUp}
                      validate={validate}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Copyright sx={{ mt: 5 }} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(SignUp);
