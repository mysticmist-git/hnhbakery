import {
  NotifierType,
  SignUpProps,
  SignUpPropsFromObject,
  addUser,
  handleLoginWithGoogle,
  updateUserLogin,
} from '@/lib/auth';
import { Google } from '@mui/icons-material';
import { Grid, TextField, Button, Link, Divider } from '@mui/material';
import { Box } from '@mui/material';
import { default as NextLink } from 'next/link';
import { UserCredential } from 'firebase/auth';
import { memo } from 'react';
import theme from '@/styles/themes/lightTheme';
import CustomTextFieldWithLabel from '../Inputs/CustomTextFieldWithLabel';
import { useSnackbarService } from '@/lib/contexts';
import { CustomTextField } from '../Inputs';

const SignUpForm = ({
  handleSignUp,
  validate,
}: {
  handleSignUp: (props: SignUpProps) => Promise<UserCredential | undefined>;
  validate: (data: any) => boolean;
}) => {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region Handlers

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataObject = Object.fromEntries(data.entries());

    const signUpData = SignUpPropsFromObject(dataObject);

    console.log(signUpData);

    if (!validate(signUpData)) {
      handleSnackbarAlert('error', 'Vui lòng điền đủ thông tin');
      return;
    }

    const userCredential = await handleSignUp(signUpData);

    if (userCredential) {
      addUser(userCredential);
      updateUserLogin(userCredential);
    }
  };

  //#endregion

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} sm={6}>
          <CustomTextField
            placeholder="Họ và tên"
            fullWidth
            required
            type="text"
            autoComplete="name"
            name="name"
            id="name"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            placeholder="Ngày sinh"
            fullWidth
            required
            type="date"
            autoComplete="bday"
            name="bday"
            id="bday"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            placeholder="Email"
            fullWidth
            required
            type="email"
            autoComplete="email"
            name="email"
            id="email"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            placeholder="Mật khẩu"
            required
            fullWidth
            type="password"
            autoComplete="new-password"
            name="password"
            id="password"
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: 'secondary.main',
          '&:hover': {
            backgroundColor: 'secondary.dark',
          },
        }}
      >
        Đăng ký
      </Button>
      <Grid
        item
        xs={12}
        sx={{
          mb: '1rem',
        }}
      >
        <Divider />
        <Button
          fullWidth
          startIcon={<Google />}
          variant="outlined"
          color="secondary"
          sx={{
            mt: '1rem',
            display: 'none',
          }}
          onClick={handleLoginWithGoogle}
        >
          Đăng ký với Google
        </Button>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <NextLink href="/auth/login" passHref legacyBehavior>
            <Link
              variant="body2"
              color={theme.palette.common.black}
              style={{ textDecoration: 'none' }}
            >
              Đã có tài khoản? Đăng nhập ngay!
            </Link>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(SignUpForm);
