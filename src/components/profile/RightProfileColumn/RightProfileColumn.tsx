import DoiMKTextField from '@/components/search/DoiMKTextField';
import { getAddresses } from '@/lib/DAO/addressDAO';
import { useSnackbarService } from '@/lib/contexts';
import Address from '@/models/address';
import User, { UserTableRow } from '@/models/user';
import { Google } from '@mui/icons-material';
import { Box, Grid, TextField, Typography, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { User as FirebaseUser } from 'firebase/auth';
import React, { useEffect, useMemo, useState } from 'react';
import AddressList from '../AddressList';
import TelTextField from '../TelTextField';

interface RightProfileColumnProps {
  user: FirebaseUser;
  userData: UserTableRow | undefined;
  reload: () => void;
  onUpdateUserData: (field: keyof User, value: User[keyof User]) => void;
}

const RightProfileColumn = ({
  user,
  userData,
  reload,
  onUpdateUserData,
}: RightProfileColumnProps) => {
  //#region Hooks

  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region UseMemos

  const textStyle = useMemo(
    () => ({
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.common.black,
      fontWeight: theme.typography.body2.fontWeight,
      fontFamily: theme.typography.body2.fontFamily,
    }),
    [theme]
  );

  //#endregion

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
          component={'div'}
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
                value={dayjs(userData?.birth ?? new Date())}
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
          component={'div'}
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
                user={user}
              />
            </Grid>
            <Grid item xs={12}>
              {userData?.type === 'google' && (
                <Box
                  component={'div'}
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
              {userData?.type === 'mail' && (
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
          component={'div'}
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: '16px',
            boxShadow: 3,
            p: 2,
          }}
        >
          <AddressList
            textStyle={textStyle}
            userData={userData}
            reload={reload}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default RightProfileColumn;
