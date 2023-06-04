import { SignupData, SignupUser } from '@/lib/auth/auth';
import { UserObject } from '@/lib/models/User';
import theme from '@/styles/themes/lightTheme';
import { Box, Grid, Link, TextField, Typography, alpha } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { default as NextLink } from 'next/link';
import { memo, useRef } from 'react';
import { CustomTextField, CustomTextFieldPassWord } from '../Inputs';
import CustomButton from '../Inputs/Buttons/customButton';

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
        <Grid item xs={12} sm={6}>
          <DatePicker
            format="DD/MM/YYYY"
            inputRef={birthdayRef}
            defaultValue={dayjs(new Date('2000-01-01'))}
            sx={{
              overflow: 'hidden',
              bgcolor: theme.palette.common.white,
              borderRadius: '8px',
              border: 3,
              borderColor: theme.palette.secondary.main,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
          <CustomTextFieldPassWord
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
          <CustomTextFieldPassWord
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
