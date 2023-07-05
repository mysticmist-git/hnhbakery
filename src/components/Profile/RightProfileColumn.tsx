import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { memo, useRef } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { CustomIconButton } from '../Inputs/Buttons';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Google } from '@mui/icons-material';
import dayjs from 'dayjs';
import { TelTextField } from './TelTextField';
import { AddressList } from './AddressList';

const RightProfileColumn = (props: any) => {
  const theme = useTheme();
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };
  const { userData } = props;

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
                value={userData.name ?? ''}
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
                value={dayjs(userData.birthday ?? '')}
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
                value={userData.email ?? 'Trống'}
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
              <TelTextField textStyle={textStyle} userData={userData} />
            </Grid>
            <Grid item xs={12}>
              {userData.accountType === 'google' && (
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
              {userData.accountType === 'email_n_password' && (
                <TextField
                  label="Mật khẩu"
                  disabled
                  variant="outlined"
                  defaultValue={'1234567890'}
                  fullWidth
                  InputProps={{
                    style: {
                      borderRadius: '8px',
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <CustomIconButton
                          sx={{
                            color: theme.palette.common.black,
                          }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </CustomIconButton>
                        <CustomIconButton
                          sx={{
                            color: theme.palette.success.main,
                          }}
                        >
                          <CheckRoundedIcon fontSize="medium" />
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
