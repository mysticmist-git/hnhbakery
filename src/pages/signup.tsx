import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { auth } from '@/firebase/config';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import Copyright from '@/components/Copyright';
import {
  NotifierType,
  SignUpProps,
  AuthResult,
  AuthErrorCode,
} from '@/lib/signup';
import { useRouter } from 'next/router';
import useSnackbar from '@/lib/hooks/useSnackbar';
import { CustomSnackbar } from '@/components/CustomSnackbar';
import SignUpForm from '@/components/Auths/SignUpForm';
import theme from '@/styles/themes/lightTheme';

export default function SignUp() {
  const router = useRouter();

  const signUpUser = async (props: SignUpProps): Promise<AuthResult> => {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, props.email, props.password);
      const user = userCredential.user;
      return { result: 'successful', userCredential: user };
    } catch (error: any) {
      const errorCode = error?.code;
      const errorMessage = error.message;
      const returnedError: AuthResult = {
        result: 'fail',
        errorCode,
        errorMessage,
      };
      console.log(returnedError);
      return returnedError;
    }
  };

  const handleSignUp = async (props: SignUpProps): Promise<NotifierType> => {
    const result = await signUpUser(props);

    if (result.result === 'successful') {
      router.push('/');
      return NotifierType.SUCCESSFUL;
    } else {
      switch (result.errorCode) {
        case AuthErrorCode.EMAIL_ALREADY_IN_USE:
          return NotifierType.EMAIL_EXISTED;
        case AuthErrorCode.NETWORK_REQUEST_FAILED:
          return NotifierType.NETWORK_ERROR;
        // case
        default:
          return NotifierType.ERROR;
      }
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
