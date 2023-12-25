import DoiMKTextField from '@/components/search/DoiMKTextField';
import { getAddresses } from '@/lib/DAO/addressDAO';
import { useSnackbarService } from '@/lib/contexts';
import Address from '@/models/address';
import User, { UserTableRow } from '@/models/user';
import { CampaignRounded, Google } from '@mui/icons-material';
import {
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { User as FirebaseUser } from 'firebase/auth';
import React, { useMemo } from 'react';
import AddressList from '../AddressList';
import TelTextField from '../TelTextField';
import { formatPrice } from '@/lib/utils';
import { Stack } from '@mui/system';

import Cake2 from '@/assets/Decorate/Cake2.png';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';

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

      {userData?.rankId && userData.paidMoney && (
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
                  Thông tin tài khoản
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Bậc tài khoản"
                  disabled
                  variant="outlined"
                  defaultValue={'Đồng'}
                  value={userData.customerRank?.name ?? 'Đồng'}
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
                <TextField
                  label="Số tiền đã thanh toán"
                  disabled
                  variant="outlined"
                  defaultValue={'0 đồng'}
                  value={formatPrice(userData?.paidMoney) ?? ''}
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

              <Grid item xs={12} md={12}>
                <Box
                  component={'div'}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    backgroundImage: `url(${Cake2.src})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                    p: 2,
                    border: 1,
                    borderColor: 'grey.400',
                    width: '100%',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{
                      width: 'fit-content',
                      borderRadius: '100px',
                      boxShadow: 6,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        backgroundColor: 'rgba(127, 20, 22, 0.95)',
                        color: 'white',
                        px: 2,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ color: 'inherit', pointerEvents: 'none' }}
                      >
                        <CampaignRounded fontSize="inherit" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'inherit',
                          ml: 1,
                        }}
                      >
                        {userData?.customerRank
                          ? formatPrice(
                              userData.customerRank.maxPaidMoney -
                                userData.paidMoney
                            )
                          : '0 đồng'}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'secondary.main',
                        p: 1,
                        px: 2,
                      }}
                    >
                      tiếp theo để thăng cấp và nhận nhiều khuyến mãi hơn!
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}

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

      {userData?.group_id == DEFAULT_GROUP_ID && (
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
      )}
    </Grid>
  );
};

export default RightProfileColumn;
