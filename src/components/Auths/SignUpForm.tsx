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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomTextFieldWithLabel
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="Tên"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextFieldWithLabel
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="Họ"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextFieldWithLabel
            required
            fullWidth
            id="email"
            label="Địa chỉ Email"
            name="email"
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextFieldWithLabel
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="new-password"
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
          }}
          onClick={handleLoginWithGoogle}
        >
          Đăng ký với Google
        </Button>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <NextLink href="/auth/login" passHref legacyBehavior>
            <Link variant="body2" style={{ textDecoration: 'none' }}>
              Đã có tài khoản? Đăng nhập ngay!
            </Link>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(SignUpForm);
