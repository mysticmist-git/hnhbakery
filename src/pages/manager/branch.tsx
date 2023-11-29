import StatisticTable from '@/components/branch/StatisticTable';
import BranchTable from '@/components/branches/BranchTable/BranchTable';
import { CustomIconButton } from '@/components/buttons';
import { CanNotAccess } from '@/components/cannotAccess/CanNotAccess';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { auth } from '@/firebase/config';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import { BranchTableRow } from '@/models/branch';
import { ContentCopyRounded } from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const StyleCuaCaiBox = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  border: 1,
  borderColor: 'text.secondary',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  opacity: 0.8,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    opacity: 1,
    boxShadow: 10,
  },
};

const textStyle = {
  fontSize: 'body2.fontSize',
  color: 'common.black',
  fontWeight: 'body2.fontWeight',
  fontFamily: 'body2.fontFamily',
};

const Branch = () => {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();
  const [branchData, setBranchData] = useState<BranchTableRow | undefined>(
    undefined
  );

  const [statisticDate, setStatisticDate] = useState<Dayjs | null>(null);

  //#region UserData - Trường hợp là quản lý chi nhánh - Check xem họ là quản lý của chi nhánh nào?
  const [user, userLoading, userError] = useAuthState(auth);
  const [canBeAccessed, setCanBeAccessed] = useState<boolean | undefined>(
    undefined
  );
  // const [userData, setUserData] = React.useState<User | undefined>(undefined);
  //#endregion

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setCanBeAccessed(false);
          return;
        }
        const userData = await getUserByUid(user?.uid);
        if (!userData) {
          setCanBeAccessed(false);
          return;
        }
        const branch = await getBranchByManager(userData);

        if (!branch) {
          setCanBeAccessed(false);
          return;
        }
        setCanBeAccessed(true);

        setBranchData({ ...branch, manager: { ...userData } });
        setStatisticDate(dayjs(new Date()));
      } catch (error) {
        console.log(error);
        setCanBeAccessed(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <>
      <Box
        component={'div'}
        width={'100%'}
        sx={{ p: 2, pr: 3, overflow: 'hidden' }}
      >
        {canBeAccessed == true && (
          <Grid
            container
            justifyContent={'center'}
            alignItems={'flex-start'}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                sx={{ color: theme.palette.common.black, textAlign: 'center' }}
                variant="h4"
                fontWeight={'bold'}
              >
                Chi nhánh {branchData?.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={'auto'}>
              <Box component={'div'}>
                <StaticDatePicker
                  sx={{
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: 2,
                  }}
                  value={statisticDate}
                  onChange={(newValue) => {
                    setStatisticDate(newValue);
                  }}
                  orientation="portrait"
                  slots={{
                    toolbar: () => null,
                  }}
                  slotProps={{
                    actionBar: {
                      actions: ['today'],
                      sx: {
                        color: 'secondary.main',
                        fontWeight: 'bold',
                        backgroundColor: 'text.secondary',
                      },
                    },
                    day: {
                      sx: {
                        fontWeight: 'bold',
                      },
                    },
                  }}
                  displayWeekNumber
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={true}>
              <Box component={'div'} sx={StyleCuaCaiBox}>
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    height: '40px',
                    bgcolor: theme.palette.text.secondary,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={theme.palette.common.white}
                  >
                    Thống kê ngày {statisticDate?.format('DD/MM/YYYY')}
                  </Typography>
                </Box>
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <StatisticTable
                    branchData={branchData}
                    statisticDate={statisticDate}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Box component={'div'} sx={StyleCuaCaiBox}>
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    height: '40px',
                    bgcolor: theme.palette.text.secondary,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={theme.palette.common.white}
                  >
                    Thông tin chi nhánh
                  </Typography>
                </Box>
                <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  spacing={2}
                  sx={{
                    p: 2,
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <Outlined_TextField
                      label="Mã chi nhánh"
                      value={branchData?.id ?? 'Trống'}
                      textStyle={textStyle}
                      InputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'auto',
                          borderRadius: '8px',
                        },
                        endAdornment: branchData && (
                          <InputAdornment position="end">
                            <CustomIconButton
                              edge="end"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  branchData?.id ?? 'Trống'
                                );
                                handleSnackbarAlert(
                                  'success',
                                  'Đã sao chép mã chi nhánh vào clipboard!'
                                );
                              }}
                            >
                              <Tooltip title="Sao chép mã chi nhánh vào clipboard">
                                <ContentCopyRounded fontSize="small" />
                              </Tooltip>
                            </CustomIconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Outlined_TextField
                      label="Tên chi nhánh"
                      value={branchData?.name ?? 'Trống'}
                      textStyle={textStyle}
                      InputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'auto',
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Outlined_TextField
                      label="Địa chỉ chi nhánh"
                      value={branchData?.address ?? 'Trống'}
                      textStyle={textStyle}
                      InputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'auto',
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box component={'div'} sx={StyleCuaCaiBox}>
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    height: '40px',
                    bgcolor: theme.palette.text.secondary,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={theme.palette.common.white}
                  >
                    Thông tin quản lý
                  </Typography>
                </Box>
                <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  spacing={2}
                  sx={{
                    p: 2,
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <Outlined_TextField
                      label="Mã quản lý"
                      value={branchData?.manager?.id ?? 'Trống'}
                      textStyle={textStyle}
                      InputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'auto',
                          borderRadius: '8px',
                        },
                        endAdornment: branchData?.manager && (
                          <InputAdornment position="end">
                            <CustomIconButton
                              edge="end"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  branchData?.manager?.id ?? 'Trống'
                                );
                                handleSnackbarAlert(
                                  'success',
                                  'Đã sao chép mã quản lý vào clipboard!'
                                );
                              }}
                            >
                              <Tooltip title="Sao chép mã quản lý vào clipboard">
                                <ContentCopyRounded fontSize="small" />
                              </Tooltip>
                            </CustomIconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Outlined_TextField
                      label="Họ và tên"
                      value={branchData?.manager?.name ?? 'Trống'}
                      textStyle={textStyle}
                      InputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'auto',
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Outlined_TextField
                      label="Số điện thoại"
                      value={branchData?.manager?.tel ?? 'Trống'}
                      textStyle={textStyle}
                      InputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'auto',
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Outlined_TextField
                      label="Email"
                      value={branchData?.manager?.mail ?? 'Trống'}
                      textStyle={textStyle}
                      InputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'auto',
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        )}

        {canBeAccessed == false && <CanNotAccess />}
      </Box>
    </>
  );
};

export default Branch;
