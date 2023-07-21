import CustomButton from '@/components/buttons/CustomButton/CustomButton';
import {
  CustomTextField,
  CustomTextFieldPassword,
} from '@/components/Inputs/textFields';
import { SignupData } from '@/lib/types/auth';
import theme from '@/styles/themes/lightTheme';
import { Box, Grid, Link, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { default as NextLink } from 'next/link';
import { memo, useRef, useState } from 'react';

const USER_ROLE_ID = 'user';

const SignUpForm = ({
  handleSignUp,
}: {
  handleSignUp: (createData: () => SignupData) => Promise<void>;
}) => {
  // #region Refs

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Dayjs>(dayjs(new Date(1990, 1, 1)));
  const [tel, setTel] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // #endregion

  const createSignupData = (): SignupData => {
    return {
      name,
      birthday: birthday.toDate(),
      tel,
      mail,
      password,
      confirmPassword,
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
            value={name}
            onChange={(e: any) => setName(e.target.value)}
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
            value={birthday}
            onChange={(date) =>
              setBirthday(date ?? dayjs(new Date(1990, 1, 1)))
            }
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
            value={tel}
            onChange={(e: any) => setTel(e.target.value)}
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
            value={mail}
            onChange={(e: any) => setMail(e.target.value)}
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
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
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
