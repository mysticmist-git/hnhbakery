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

export default function SignUp() {
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

    console.log(result.errorCode);

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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          sx={{ color: theme.palette.common.black }}
          component="h1"
          variant="h5"
          textTransform={'uppercase'}
        >
          Đăng ký
        </Typography>
        <SignUpForm handleSignUp={handleSignUp} validate={validate} />
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
