import { auth } from '@/firebase/config';
import { UserObject } from '@/lib/models';
import { Google } from '@mui/icons-material';
import { Box, Grid, TextField, Typography, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { UserProfile } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import React, { memo, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import AddressList from '../AddressList';
import TelTextField from '../TelTextField/TelTextField';

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
  const { user, userData, onUpdateUserData } = props;

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
                  user={user}
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
