import { ContactWrapper } from '@/components/Contact';
import Imagebackground from '@/components/Imagebackground';
import { auth } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import {
  Box,
  Button,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { memo, useMemo, useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

const ForgetPasswordPage = () => {
  const wrapperTitle = useMemo(
    () => 'Đừng lo lắng, hãy cùng tìm lại mật khẩu của bạn',
    []
  );

  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const [mail, setMaili] = useState('');

  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const handleSend = async () => {
    if (!mail) {
      handleSnackbarAlert('error', 'Vui lòng nhập email');
      return;
    }

    try {
      const success = await sendPasswordResetEmail(mail ?? '');

      if (success) {
        handleSnackbarAlert('info', 'Email reset mật khẩu đã được gửi');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box>
        <Imagebackground>
          <Grid
            sx={{ px: 6 }}
            height={'100%'}
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12} md={8}>
              <Link href="#" style={{ textDecoration: 'none' }}>
                <Typography
                  align="center"
                  variant="h2"
                  color={theme.palette.primary.main}
                  sx={{
                    '&:hover': {
                      color: theme.palette.common.white,
                    },
                  }}
                >
                  Quên mật khẩu
                </Typography>
                <Typography
                  align="center"
                  variant="body2"
                  color={theme.palette.common.white}
                >
                  {wrapperTitle}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Imagebackground>

        <Box sx={{ pt: 0, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Grid item xs={12}>
              <ContactWrapper>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <TextField
                    value={mail}
                    onChange={(e) => setMaili(e.target.value)}
                    placeholder="Email"
                    helperText="Hãy nhập Email đã dùng để đăng ký tài khoản"
                  />
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleSend}
                  >
                    Nhận mã xác nhận
                  </Button>
                </Stack>
              </ContactWrapper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(ForgetPasswordPage);
