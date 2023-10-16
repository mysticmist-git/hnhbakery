import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
import { formatDateString, formatPrice } from '@/lib/utils';
import { Close, ContentCopyRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import { BranchTableRow } from '@/models/branch';
import User from '@/models/user';
import { getUsers } from '@/lib/DAO/userDAO';
import { MANAGER_GROUP_ID } from '@/lib/DAO/groupDAO';
import { updateBranch } from '@/lib/DAO/branchDAO';

export default function EditModal({
  open,
  handleClose,
  branch,
  handleChangeBranch,
}: {
  open: boolean;
  handleClose: () => void;
  branch: BranchTableRow | null;
  handleChangeBranch: (value: BranchTableRow) => void;
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

  const [modalBranch, setModalBranch] = useState<BranchTableRow | null>(branch);

  const [managers, setManagers] = useState<User[]>([]);

  const [isChanged, setIsChanged] = useState(false);

  const [branchName, setBranchName] = useState(branch?.name);

  useEffect(() => {
    setIsChanged(false);
    if (
      modalBranch?.name != branch?.name ||
      modalBranch?.manager?.id != branch?.manager?.id
    ) {
      setIsChanged(true);
    }
  }, [modalBranch]);

  useEffect(() => {
    setModalBranch(() => branch);
    setBranchName(() => branch?.name);
    const fetchData = async () => {
      try {
        setManagers(await getUsers(MANAGER_GROUP_ID));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [branch]);

  //#region hàm
  const clearData = () => {
    setModalBranch(() => null);
  };
  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };
  //#endregion
  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        fullWidth
        maxWidth="md"
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
            Chỉnh sửa chi nhánh
          </Typography>

          <Box>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <Close />
            </CustomIconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {/* Thông tin branch */}
              <Grid item xs={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
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
                      Thông tin chi tiết
                    </Typography>
                  </Box>

                  <Box
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
                      <Grid item xs={12} alignSelf={'stretch'}>
                        <TextField
                          variant="outlined"
                          label="Tên chi nhánh"
                          value={branchName}
                          color="secondary"
                          sx={{ width: '100%' }}
                          onChange={(e) => {
                            setBranchName(e.target.value);
                            setModalBranch({
                              ...modalBranch!,
                              name: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              {/* Người quản lý */}
              <Grid item xs={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
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
                      {managers.map((manager) => (
                        <Grid item key={manager.id} alignSelf={'stretch'}>
                          <FormControlLabel
                            value={manager.id}
                            sx={{
                              width: '100%',
                            }}
                            checked={modalBranch?.manager?.id === manager.id}
                            onChange={() => {
                              if (modalBranch?.manager?.id === manager.id) {
                                setModalBranch({
                                  ...modalBranch!,
                                  manager: undefined,
                                  manager_id: '',
                                  group_id: '',
                                });
                              } else {
                                setModalBranch({
                                  ...modalBranch!,
                                  manager: manager,
                                  manager_id: manager.id,
                                  group_id: manager.group_id,
                                });
                              }
                            }}
                            control={<Checkbox color="secondary" />}
                            label={
                              <Box sx={{ width: '500px' }}>
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
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              handleClose();
              if (branch) {
                setModalBranch({
                  ...branch,
                });
                setBranchName(branch.name);
              }
            }}
          >
            Đóng
          </Button>
          <Button
            sx={{
              display: isChanged ? 'block' : 'none',
            }}
            color="secondary"
            onClick={async () => {
              if (modalBranch) {
                const { manager, ...data } = modalBranch;
                await updateBranch(data.id, data);
                handleChangeBranch(modalBranch);
                handleSnackbarAlert(
                  'success',
                  'Thay đổi thông tin chi nhánh thành công!'
                );
                handleClose();
                setIsChanged(false);
              }
            }}
          >
            Cập nhật
          </Button>
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
