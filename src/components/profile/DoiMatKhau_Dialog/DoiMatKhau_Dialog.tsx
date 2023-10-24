import { CustomButton, CustomIconButton } from '@/components/buttons';
import { CustomDialog } from '@/components/dialogs';
import { auth } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FirebaseError } from 'firebase/app';
import {
  User,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import React, { useState } from 'react';

function DoiMatKhau_Dialog({
  open,
  handleClose,
  textStyle,
  user,
}: {
  open: boolean;
  handleClose: () => void;
  textStyle: any;
  user: User;
}) {
  const theme = useTheme();

  const handleSnackbarAlert = useSnackbarService();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleXacNhan = async () => {
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      handleSnackbarAlert('warning', 'Vui lòng điền đầy đủ trường!');
      return;
    }

    if (newPassword !== confirmPassword) {
      handleSnackbarAlert('warning', 'Xác nhận mật khẩu không đúng!');
      return;
    }

    try {
      const email = (user as User).email;

      if (!email) {
        handleSnackbarAlert('error', 'Đã có lỗi xảy ra');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        oldPassword
      );

      await updatePassword(userCredential.user, newPassword);
    } catch (error: any) {
      console.log(error);
      if (error instanceof FirebaseError) {
        let msg = '';
        switch (error.code) {
          case 'auth/wrong-password':
            msg = 'Mật khẩu cũ sai';
            break;
          case 'auth/weak-password':
            msg = 'Xác nhận mật khẩu phải ít nhất 6 kí tự!';
            break;
          case 'auth/requires-recent-login':
            msg = 'Vui lòng đăng nhập lại!';
            break;
          default:
            msg = 'Đổi mật khẩu thất bại!';
            break;
        }
        handleSnackbarAlert('error', msg);
        return;
      } else {
        handleSnackbarAlert('error', 'Đổi mật khẩu thất bại!');
        return;
      }
    }

    handleSnackbarAlert('success', 'Đổi mật khẩu thành công!');
    handleClose();
  };

  const [showMKCu, setShowMKCu] = React.useState(false);
  const handleClickShowMKCu = () => setShowMKCu((show) => !show);

  const [showMKMoi, setShowMKMoi] = React.useState(false);
  const handleClickShowMKMoi = () => setShowMKMoi((show) => !show);

  const [showMKMoiLai, setShowMKMoiLai] = React.useState(false);
  const handleClickShowMKMoiLai = () => setShowMKMoiLai((show) => !show);

  return (
    <>
      <CustomDialog
        title="Đổi mật khẩu"
        open={open}
        handleClose={handleClose}
        width={{ md: '35vw', xs: '65vw' }}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{
            pt: 2,
          }}
        >
          <Grid item xs={12}>
            <TextField
              label="Mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              variant="outlined"
              FormHelperTextProps={{
                sx: {
                  color: theme.palette.error.main,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                },
              }}
              fullWidth
              InputProps={{
                style: {
                  borderRadius: '8px',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomIconButton onClick={handleClickShowMKCu} edge="end">
                      {showMKCu ? <VisibilityOff /> : <Visibility />}
                    </CustomIconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                sx: {
                  ...textStyle,
                },
              }}
              type={showMKCu ? 'text' : 'password'}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                style: {
                  borderRadius: '8px',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomIconButton onClick={handleClickShowMKMoi} edge="end">
                      {showMKMoi ? <VisibilityOff /> : <Visibility />}
                    </CustomIconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                sx: {
                  ...textStyle,
                },
              }}
              type={showMKMoi ? 'text' : 'password'}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Nhập lại mật khẩu mới"
              FormHelperTextProps={{
                sx: {
                  color: theme.palette.error.main,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                },
              }}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                style: {
                  borderRadius: '8px',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomIconButton
                      onClick={handleClickShowMKMoiLai}
                      edge="end"
                    >
                      {showMKMoiLai ? <VisibilityOff /> : <Visibility />}
                    </CustomIconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                sx: {
                  ...textStyle,
                },
              }}
              type={showMKMoiLai ? 'text' : 'password'}
            />
          </Grid>

          <Grid item xs={'auto'}>
            <CustomButton
              onClick={handleClose}
              sx={{ bgcolor: theme.palette.text.secondary }}
            >
              <Typography variant="button" color={theme.palette.common.white}>
                Hủy
              </Typography>
            </CustomButton>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton onClick={handleXacNhan}>
              <Typography variant="button" color={theme.palette.common.white}>
                Xác nhận
              </Typography>
            </CustomButton>
          </Grid>
        </Grid>
      </CustomDialog>
    </>
  );
}

export default DoiMatKhau_Dialog;
