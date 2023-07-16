import { CustomButton, CustomIconButton } from '@/components/buttons';
import { CustomDialog } from '@/components/dialogs';
import { useSnackbarService } from '@/lib/contexts';
import { UserObject } from '@/lib/models';
import {
  EditRounded,
  Google,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { UserProfile } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import React, { memo, useRef, useState } from 'react';
import AddressList from '../AddressList';
import TelTextField from '../TelTextField/TelTextField';

function DoiMatKhau_Dialog(props: any) {
  const theme = useTheme();
  const {
    handleClose,
    open,
    textStyle,
    sameMKMoi,
    setSameMKMoi,
    checkMKCu,
    setCheckMKCu,
    userData,
    onUpdateUserData,
  } = props;

  const handleSnackbarAlert = useSnackbarService();

  const handleXacNhan = () => {
    // cài đặt xóa địa chỉ trong db
    if (mkcuRef?.current?.value !== userData?.password) {
      setCheckMKCu('Mật khẩu không chính xác!');
      return;
    } else {
      setCheckMKCu('');
    }
    if (mkmoiRef?.current?.value !== mkmoilaiRef?.current?.value) {
      setSameMKMoi('Nhập lại mật khẩu chưa trùng khớp!');
      return;
    } else {
      setSameMKMoi('');
    }

    // Hên: cài đặt thay đổi mật khẩu
    props.onUpdateUserData('password', mkmoiRef?.current?.value);

    handleSnackbarAlert('success', 'Đổi mật khẩu thành công!');
    handleClose();
  };

  const [showMKCu, setShowMKCu] = React.useState(false);
  const handleClickShowMKCu = () => setShowMKCu((show) => !show);

  const [showMKMoi, setShowMKMoi] = React.useState(false);
  const handleClickShowMKMoi = () => setShowMKMoi((show) => !show);

  const [showMKMoiLai, setShowMKMoiLai] = React.useState(false);
  const handleClickShowMKMoiLai = () => setShowMKMoiLai((show) => !show);

  const mkcuRef = useRef<HTMLInputElement>(null);
  const mkmoiRef = useRef<HTMLInputElement>(null);
  const mkmoilaiRef = useRef<HTMLInputElement>(null);

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
              inputRef={mkcuRef}
              variant="outlined"
              helperText={checkMKCu}
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
              inputRef={mkmoiRef}
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
              helperText={sameMKMoi}
              FormHelperTextProps={{
                sx: {
                  color: theme.palette.error.main,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                },
              }}
              variant="outlined"
              inputRef={mkmoilaiRef}
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

function DoiMKTextField(props: any) {
  const theme = useTheme();
  const { textStyle, userData, onUpdateUserData } = props;
  const [openDoiMauKhau, setOpenDoiMauKhau] = useState(false);
  const handleCloseDoiMatKhau = () => {
    setOpenDoiMauKhau(false);
    setSameMKMoi('');
    setCheckMKCu('');
  };

  const [sameMKMoi, setSameMKMoi] = useState('');
  const [checkMKCu, setCheckMKCu] = useState('');

  return (
    <>
      <TextField
        label="Mật khẩu"
        disabled
        variant="outlined"
        value={userData.password ? userData.password : ''}
        fullWidth
        InputProps={{
          style: {
            borderRadius: '8px',
          },
          endAdornment: (
            <InputAdornment position="end">
              <CustomIconButton
                onClick={() => setOpenDoiMauKhau(true)}
                sx={{
                  color: theme.palette.common.black,
                }}
              >
                <EditRounded fontSize="small" />
              </CustomIconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          sx: {
            ...textStyle,
          },
        }}
        type="password"
      />
      <DoiMatKhau_Dialog
        open={openDoiMauKhau}
        handleClose={handleCloseDoiMatKhau}
        textStyle={textStyle}
        userData={userData}
        sameMKMoi={sameMKMoi}
        setSameMKMoi={setSameMKMoi}
        checkMKCu={checkMKCu}
        setCheckMKCu={setCheckMKCu}
        onUpdateUserData={onUpdateUserData}
      />
    </>
  );
}

interface RightProfileColumnProps {
  userData?: UserObject;
  onUpdateUserData: (
    field: keyof UserObject,
    value: UserObject[keyof UserObject]
  ) => void;
  [key: string]: any;
}

const RightProfileColumn = (props: RightProfileColumnProps) => {
  const theme = useTheme();
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };
  const { userData, onUpdateUserData } = props;

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 3,
            px: 2,
            py: 2,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                align="center"
                variant="button"
                color={theme.palette.common.black}
              >
                Thông tin cá nhân
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Họ và tên"
                disabled
                variant="outlined"
                defaultValue={'Họ và tên nhé'}
                value={userData?.name ?? ''}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '8px',
                  },
                }}
                inputProps={{
                  sx: {
                    ...textStyle,
                  },
                }}
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Ngày sinh"
                disabled
                views={['day', 'month', 'year']}
                sx={{
                  width: '100%',
                }}
                value={dayjs(userData?.birthday ?? new Date())}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    InputProps: {
                      style: {
                        borderRadius: '8px',
                      },
                    },
                    inputProps: {
                      sx: {
                        ...textStyle,
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 3,
            p: 2,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                align="center"
                variant="button"
                color={theme.palette.common.black}
              >
                Bảo mật
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                disabled
                variant="outlined"
                value={userData?.mail ?? 'Trống'}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '8px',
                  },
                }}
                inputProps={{
                  sx: {
                    ...textStyle,
                  },
                }}
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TelTextField
                textStyle={textStyle}
                userData={userData}
                onUpdateUserData={onUpdateUserData}
              />
            </Grid>
            <Grid item xs={12}>
              {userData?.accountType === 'google' && (
                <Box
                  sx={{
                    borderRadius: '8px',
                    border: 0.5,
                    borderColor: theme.palette.text.secondary,
                    width: '100%',
                    py: 1.9,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Google fontSize="small" />
                  <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                    sx={{ ml: 1 }}
                  >
                    Đã đăng nhập với Google
                  </Typography>
                </Box>
              )}
              {userData?.accountType === 'email_n_password' && (
                <DoiMKTextField
                  textStyle={textStyle}
                  userData={userData}
                  onUpdateUserData={onUpdateUserData}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 3,
            p: 2,
          }}
        >
          <AddressList textStyle={textStyle} userData={userData} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default memo(RightProfileColumn);
