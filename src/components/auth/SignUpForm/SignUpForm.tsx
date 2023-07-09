import {
  CustomTextField,
  CustomTextFieldPassword,
} from '@/components/Inputs/textFields';
import CustomButton from '@/components/buttons/CustomButton';
import { SignupData } from '@/lib/types/auth';
import theme from '@/styles/themes/lightTheme';
import { Box, Grid, Link, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { default as NextLink } from 'next/link';
import { memo, useRef } from 'react';

const USER_ROLE_ID = 'user';

const SignUpForm = ({
  handleSignUp,
}: {
  handleSignUp: (createData: () => SignupData) => Promise<void>;
}) => {
  // #region Refs

  const nameRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // #endregion

  const createSignupData = (): SignupData => {
    return {
      name: nameRef.current?.value,
      birthday: new Date(birthdayRef.current?.value as string),
      tel: telRef.current?.value,
      mail: emailRef.current?.value,
      password: passwordRef.current?.value,
      confirmPassword: confirmPasswordRef.current?.value,
    };
  };

  const handleSignup = () => {
    handleSignUp(createSignupData);
  };

  //#endregion

  return (
    <Box component="form" noValidate sx={{ mt: 3 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={12}>
          <CustomTextField
            ref={nameRef}
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
        <Grid item xs={12} md={6}>
          <DatePicker
            format="DD/MM/YYYY"
            inputRef={birthdayRef}
            views={['day', 'month', 'year']}
            sx={{
              overflow: 'hidden',
              width: '100%',
              bgcolor: theme.palette.common.white,
              borderRadius: '8px',
              border: 3,
              borderColor: theme.palette.secondary.main,
              fontSize: '16px',
            }}
            slotProps={{
              textField: {
                autoComplete: 'bday',
                InputProps: {
                  disableUnderline: true,
                },
                inputProps: {
                  sx: {
                    py: 1.5,
                    fontSize: theme.typography.body2.fontSize,
                    color: theme.palette.common.black,
                    fontWeight: theme.typography.body2.fontWeight,
                    fontFamily: theme.typography.body2.fontFamily,
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            ref={telRef}
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
            ref={emailRef}
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
          <CustomTextFieldPassword
            ref={passwordRef}
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
          <CustomTextFieldPassword
            ref={confirmPasswordRef}
            placeholder="Nhập lại mật khẩu"
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
            onClick={handleSignup}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
            }}
          >
            <Typography variant="button" color={theme.palette.common.white}>
              Đăng ký
            </Typography>
          </CustomButton>
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
