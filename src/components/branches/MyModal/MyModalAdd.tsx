import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { addDocToFirestore } from '@/lib/firestore';
import { Close, ContentCopyRounded } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import Branch from '@/models/branch';
import { createBranch, getBranches } from '@/lib/DAO/branchDAO';
import useProvinces from '@/lib/hooks/useProvinces';
import Province from '@/models/province';
import User from '@/models/user';
import { getUsers } from '@/lib/DAO/userDAO';
import { MANAGER_GROUP_ID } from '@/lib/DAO/groupDAO';

export default function MyModalAdd({
  open,
  handleClose,
  branch,
}: {
  open: boolean;
  handleClose: () => void;
  branch: Branch | null;
}) {
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  const StyleCuaCaiBox = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: 1,
    borderColor: theme.palette.text.secondary,
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
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };

  const defaultBranch: Branch = useMemo(
    () => ({
      id: '',
      name: '',
      address: '',
      manager_id: '',
      group_id: '',
      province_id: '',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }),
    []
  );

  const [modalBranch, setModalBranch] = useState<Branch>(defaultBranch);

  useEffect(() => {
    setModalBranch(() => defaultBranch);
  }, [defaultBranch, branch]);

  const clearData = () => {
    setModalBranch(() => defaultBranch);
  };
  const localHandleClose = () => {
    clearData();
    handleClose();
  };

  const handleAdd = async () => {
    console.log(modalBranch);

    try {
      if (
        !modalBranch.address ||
        !modalBranch.name ||
        !modalBranch.manager_id ||
        !modalBranch.group_id ||
        !modalBranch.province_id
      ) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }

      //   Check trùng chi nhánh

      let data: Branch = { ...modalBranch };

      await createBranch(data);
    } catch (error: any) {
      handleSnackbarAlert('error', error.message);
      return;
    }

    setModalBranch(() => defaultBranch);
    setSelectedProvince(() => null);
    setManagers(() => []);
    handleSnackbarAlert('success', 'Thêm chi nhánh thành công');
    handleClose();
  };

  //   Tỉnh thành
  const provinceData = useProvinces();
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );

  //   Quản lý

  const [managers, setManagers] = useState<User[]>([]);

  useEffect(() => {
    setManagers(() => []);
    const fetchData = async () => {
      try {
        const branches = await getBranches();
        const allManagers = await getUsers(MANAGER_GROUP_ID);
        const finalManagers: User[] = [];

        for (var manager of allManagers) {
          const isManagerOfOtherBranch = branches.find(
            (branch) => branch.manager_id == manager.id
          );

          if (!isManagerOfOtherBranch) {
            finalManagers.push(manager);
          }
        }
        setManagers(finalManagers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
          },
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <DialogTitle sx={{ boxShadow: 3 }}>
          <Typography
            align="center"
            variant="body1"
            sx={{
              fontWeight: 'bold',
            }}
            color={theme.palette.common.black}
          >
            Thêm chi nhánh
          </Typography>

          <Box component={'div'}>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <Close />
            </CustomIconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box component={'div'} sx={{ py: 3 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
                <Outlined_TextField
                  textStyle={textStyle}
                  label="Tên"
                  value={modalBranch?.name}
                  onChange={(e: any) => {
                    setModalBranch({ ...modalBranch, name: e.target.value });
                  }}
                  InputProps={{
                    readOnly: false,
                    style: {
                      pointerEvents: 'auto',
                      borderRadius: '8px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
                <Outlined_TextField
                  textStyle={textStyle}
                  label="Địa chỉ"
                  value={modalBranch?.address}
                  onChange={(e: any) => {
                    setModalBranch({ ...modalBranch, address: e.target.value });
                  }}
                  InputProps={{
                    readOnly: false,
                    style: {
                      pointerEvents: 'auto',
                      borderRadius: '8px',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} alignSelf={'stretch'}>
                <Autocomplete
                  disablePortal
                  value={selectedProvince}
                  options={provinceData}
                  fullWidth
                  getOptionLabel={(o) => o.name}
                  onChange={(_, value) => {
                    setSelectedProvince(value);
                    if (value) {
                      setModalBranch({
                        ...modalBranch,
                        province_id: value.id,
                      });
                    } else {
                      setModalBranch({
                        ...modalBranch,
                        province_id: '',
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tỉnh thành"
                      color="secondary"
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          ...textStyle,
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} alignSelf={'stretch'}>
                <Box component={'div'} sx={StyleCuaCaiBox}>
                  <Box
                    component={'div'}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '40px',
                      p: 2,
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Người quản lý
                    </Typography>
                  </Box>

                  <Box
                    component={'div'}
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={3}
                    >
                      {managers.length > 0 &&
                        managers.map((manager) => (
                          <Grid item key={manager.id} alignSelf={'stretch'}>
                            <FormControlLabel
                              value={manager.id}
                              sx={{
                                width: '100%',
                              }}
                              checked={modalBranch?.manager_id === manager.id}
                              onChange={() => {
                                if (modalBranch?.manager_id === manager.id) {
                                  setModalBranch({
                                    ...modalBranch!,
                                    manager_id: '',
                                    group_id: '',
                                  });
                                } else {
                                  setModalBranch({
                                    ...modalBranch!,
                                    manager_id: manager.id,
                                    group_id: manager.group_id,
                                  });
                                }
                              }}
                              control={<Checkbox color="secondary" />}
                              label={
                                <Box component={'div'} sx={{ width: '100%' }}>
                                  <Outlined_TextField
                                    textStyle={textStyle}
                                    multiline
                                    label={
                                      'Mã quản lý: ' + (manager.id ?? 'Trống')
                                    }
                                    value={getValueManager(manager)}
                                    InputProps={{
                                      readOnly: true,
                                      style: {
                                        pointerEvents: 'auto',
                                        borderRadius: '8px',
                                      },
                                      endAdornment: modalBranch?.id && (
                                        <InputAdornment position="end">
                                          <CustomIconButton
                                            edge="end"
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                manager?.id ?? 'Trống'
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
                                </Box>
                              }
                            />
                          </Grid>
                        ))}

                      {managers.length == 0 && (
                        <Typography
                          variant="body2"
                          fontWeight={'bold'}
                          sx={{
                            color: 'grey.600',
                            mt: 3,
                          }}
                        >
                          Không tồn tại người quản lý khả dụng.
                        </Typography>
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Box
            component={'div'}
            sx={{
              display: 'flex',
              gap: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                handleClose();
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color={'success'}
              onClick={handleAdd}
              disabled={managers.length == 0}
            >
              Thêm
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

function getValueManager(value: User) {
  return (
    'Tên: ' + value.name + '\nEmail: ' + value.mail + '\nSDT: ' + value.tel
  );
}
