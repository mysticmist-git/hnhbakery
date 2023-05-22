import {
  NotifierType,
  SignUpProps,
  SignUpPropsFromObject,
  addUser,
  handleLoginWithGoogle,
  updateUserLogin,
} from '@/lib/auth';
import { Google } from '@mui/icons-material';
import {
  Grid,
  TextField,
  Button,
  Link,
  Divider,
  Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import { default as NextLink } from 'next/link';
import { UserCredential } from 'firebase/auth';
import { memo } from 'react';
import theme from '@/styles/themes/lightTheme';
import CustomTextFieldWithLabel from '../Inputs/CustomTextFieldWithLabel';
import { useSnackbarService } from '@/lib/contexts';
import { CustomTextField, CustomTextFieldPassWord } from '../Inputs';
import CustomButton from '../Inputs/Buttons/customButton';

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
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={12}>
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
        <Grid item xs={12} sm={6}>
          <CustomTextField
            placeholder="Số điện thoại"
            fullWidth
            required
            type="tel"
            autoComplete="tel"
            name="tel"
            id="tel"
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
          <CustomTextFieldPassWord
            placeholder="Mật khẩu"
            required
            fullWidth
            type="password"
            autoComplete="new-password"
            name="password"
            id="password"
          />
        </Grid>

        <Grid item xs={12}>
          <CustomButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
            }}
            children={() => <Typography variant="button">Đăng ký</Typography>}
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body2"
              color={theme.palette.common.white}
              sx={{ mr: 1 }}
            >
              Bạn đã có tài khoản?
            </Typography>
            <NextLink href="/auth/login" passHref legacyBehavior>
              <Box
                component={Link}
                variant="button"
                align="center"
                color={theme.palette.common.white}
                sx={{
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Đăng nhập ngay
              </Box>
            </NextLink>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(SignUpForm);
