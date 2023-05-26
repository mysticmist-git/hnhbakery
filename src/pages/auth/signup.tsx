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
import { useSnackbarService } from '@/lib/contexts';
import { SignUpForm } from '@/components/Auths';
import { alpha, Grid } from '@mui/material';
import bg2 from '../../assets/Decorate/bg2.png';
import banh1 from '../../assets/Carousel/3.jpg';
import { UserObject } from '@/lib/models/User';
import {
  addUserWithEmailAndPassword,
  SignupData,
  SignupUser,
} from '@/lib/auth/auth';
import { Timestamp } from 'firebase/firestore';
import { generateKey } from 'crypto';

enum SignupValidationMsg {
  Success = 'Đăng ký thành công',
  Error = 'Đăng ký thất bại',
  EMPTY_NAME = 'Vui lòng nhập tên',
  EMPTY_MAIL = 'Vui lòng nhập Mail',
  EMPTY_BIRTH = 'Vui lòng nhập ngày sinh',
  SHORT_PASSWORD = 'Mật khẩu phải có ít nhất 6 ký tự',
  EMPTY_PASSWORD = 'Vui lòng nhập mật khẩu',
  EMTPY_CONFIRM_PASSWORD = 'Vui lòng nhập lại mật khẩu',
  CONFIRM_PASSWORD_NOT_MATCH = 'Nhập lại mật khẩu không khớp',
  EMPTY_TEL = 'Vui lòng nhập số điện thoại',
}

enum SignupErrorCode {
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  NETWORK_REQUEST_FAILED = 'auth/network-request-failed',
}

enum SignupErrorMsg {
  EMAIL_ALREADY_IN_USE = 'Email đã được sử dụng.',
  NETWORK_REQUEST_FAILED = 'Lỗi mạng',
  DEFAULT = 'Lỗi không biết',
}

const SignUp = () => {
  // #region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();

  // #endregion

  // #region Handlers

  const validateSignupData = (data: SignupData) => {
    console.log(data);

    if (!data.name || data.name === '') {
      handleSnackbarAlert('error', SignupValidationMsg.EMPTY_NAME);
      return false;
    }

    if (!data.mail || data.mail === '') {
      handleSnackbarAlert('error', SignupValidationMsg.EMPTY_MAIL);
      return false;
    }

    if (!data.tel || data.tel === '') {
      handleSnackbarAlert('error', SignupValidationMsg.EMPTY_TEL);
      return false;
    }

    if (!data.birthday) {
      handleSnackbarAlert('error', SignupValidationMsg.EMPTY_BIRTH);
      return false;
    }

    if (!data.password || data.password === '') {
      handleSnackbarAlert('error', SignupValidationMsg.EMPTY_PASSWORD);
      return false;
    }

    if (data.password.length < 6) {
      handleSnackbarAlert('error', SignupValidationMsg.SHORT_PASSWORD);
      return false;
    }

    if (!data.confirmPassword || data.confirmPassword === '') {
      handleSnackbarAlert('error', SignupValidationMsg.EMTPY_CONFIRM_PASSWORD);
      return false;
    }

    if (data.password !== data.confirmPassword) {
      handleSnackbarAlert(
        'error',
        SignupValidationMsg.CONFIRM_PASSWORD_NOT_MATCH,
      );
      return false;
    }

    return true;
  };

  const createUserObjectFromUSignupData = (
    userData: SignupData,
  ): SignupUser => {
    return {
      mail: userData.mail,
      password: userData.password,
      name: userData.name,
      birthday: Timestamp.fromDate(userData.birthday as Date),
      tel: userData.tel,
      isActive: true,
      role_id: 'customer',
      accountType: 'email_n_password',
    } as SignupUser;
  };

  const handleSignup = async (createData: () => SignupData) => {
    const signupData = createData();

    const validateResult = validateSignupData(signupData);

    if (!validateResult) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.mail!,
        signupData.password!,
      );

      const user = createUserObjectFromUSignupData(signupData);

      addUserWithEmailAndPassword(userCredential.user.uid, user);

      handleSnackbarAlert('success', 'Đăng ký thành công!');

      router.push('/');
    } catch (error: any) {
      console.log(error);
      handleSignupError(error.code);
    }
  };

  const handleSignupError = (errorCode: string) => {
    if (!errorCode || errorCode === '') return;

    switch (errorCode) {
      case SignupErrorCode.EMAIL_ALREADY_IN_USE:
        handleSnackbarAlert('error', SignupErrorMsg.EMAIL_ALREADY_IN_USE);
        break;
      case SignupErrorCode.NETWORK_REQUEST_FAILED:
        handleSnackbarAlert('error', SignupErrorMsg.NETWORK_REQUEST_FAILED);
        break;
      default:
        handleSnackbarAlert('error', SignupErrorMsg.DEFAULT);
        break;
    }
  };

  // #endregion

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
                    <SignUpForm handleSignUp={handleSignup} />
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
