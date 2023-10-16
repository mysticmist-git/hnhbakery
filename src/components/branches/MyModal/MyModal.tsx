import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
import { formatDateString, formatPrice } from '@/lib/utils';
import { Close, ContentCopyRounded } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import { BranchTableRow } from '@/models/branch';

export default function MyModal({
  open,
  handleClose,
  branch,
}: {
  open: boolean;
  handleClose: () => void;
  branch: BranchTableRow | null;
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

  useEffect(() => {
    setModalBranch(() => branch);
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
            Chi tiết Chi nhánh
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
                      <Grid item xs={12} md={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Mã chi nhánh"
                          value={modalBranch?.id ?? 'Trống'}
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
                                      modalBranch?.id ?? 'Trống'
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
                      <Grid item xs={12} md={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Tên chi nhánh"
                          value={modalBranch?.name ?? 'Trống'}
                        />
                      </Grid>

                      <Grid item xs={12} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          multiline
                          label="Địa chỉ"
                          value={modalBranch?.address ?? 'Trống'}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              {/* Thông tin người quản lý */}
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
                      Người quản lý chi nhánh
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
                      <Grid item xs={12} md={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Mã quản lý"
                          value={modalBranch?.manager?.id ?? 'Trống'}
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
                                      modalBranch?.manager?.id ?? 'Trống'
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
                      <Grid item xs={12} md={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Tên quản lý"
                          value={modalBranch?.manager?.name ?? 'Trống'}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Email"
                          value={modalBranch?.manager?.mail ?? 'Trống'}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Số điện thoại"
                          value={modalBranch?.manager?.tel ?? 'Trống'}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
