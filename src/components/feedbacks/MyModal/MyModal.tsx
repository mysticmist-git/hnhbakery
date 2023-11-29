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
import { FeedbackTableRow } from '@/models/feedback';

export default function MyModal({
  open,
  handleClose,
  feedback,
}: {
  open: boolean;
  handleClose: () => void;
  feedback: FeedbackTableRow | null;
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

  const [modalFeedback, setModalFeedback] = useState<FeedbackTableRow | null>(
    feedback
  );

  useEffect(() => {
    setModalFeedback(() => feedback);
  }, [feedback]);

  //#region hàm
  const clearData = () => {
    setModalFeedback(() => null);
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
            Chi tiết Feedback
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
          <Box component={'div'} sx={{ py: 2 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {/* Thông tin feedback */}
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
                      Thông tin Feedback
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
                      <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Mã feedback"
                          value={modalFeedback?.id ?? 'Trống'}
                          InputProps={{
                            readOnly: true,
                            style: {
                              pointerEvents: 'auto',
                              borderRadius: '8px',
                            },
                            endAdornment: modalFeedback?.id && (
                              <InputAdornment position="end">
                                <CustomIconButton
                                  edge="end"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      modalFeedback?.id ?? 'Trống'
                                    );
                                    handleSnackbarAlert(
                                      'success',
                                      'Đã sao chép mã feedback vào clipboard!'
                                    );
                                  }}
                                >
                                  <Tooltip title="Sao chép mã feedback vào clipboard">
                                    <ContentCopyRounded fontSize="small" />
                                  </Tooltip>
                                </CustomIconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Số sao"
                          value={(modalFeedback?.rating ?? '0') + '/5'}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Thời gian"
                          value={
                            formatDateString(modalFeedback?.created_at) ??
                            'Trống'
                          }
                        />
                      </Grid>

                      <Grid item xs={12} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          multiline
                          label="Bình luận"
                          value={modalFeedback?.comment ?? 'Trống'}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              {/* Thông tin sản phẩm */}
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
                      Feedback cho sản phẩm
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
                      <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Mã sản phẩm"
                          value={modalFeedback?.product?.id ?? 'Trống'}
                          InputProps={{
                            readOnly: true,
                            style: {
                              pointerEvents: 'auto',
                              borderRadius: '8px',
                            },
                            endAdornment: modalFeedback?.id && (
                              <InputAdornment position="end">
                                <CustomIconButton
                                  edge="end"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      modalFeedback?.product?.id ?? 'Trống'
                                    );
                                    handleSnackbarAlert(
                                      'success',
                                      'Đã sao chép mã sản phẩm vào clipboard!'
                                    );
                                  }}
                                >
                                  <Tooltip title="Sao chép mã sản phẩm vào clipboard">
                                    <ContentCopyRounded fontSize="small" />
                                  </Tooltip>
                                </CustomIconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Mã người dùng"
                          value={modalFeedback?.user?.id ?? 'Trống'}
                          InputProps={{
                            readOnly: true,
                            style: {
                              pointerEvents: 'auto',
                              borderRadius: '8px',
                            },
                            endAdornment: modalFeedback?.id && (
                              <InputAdornment position="end">
                                <CustomIconButton
                                  edge="end"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      modalFeedback?.user?.id ?? 'Trống'
                                    );
                                    handleSnackbarAlert(
                                      'success',
                                      'Đã sao chép mã người dùng vào clipboard!'
                                    );
                                  }}
                                >
                                  <Tooltip title="Sao chép mã người dùng vào clipboard">
                                    <ContentCopyRounded fontSize="small" />
                                  </Tooltip>
                                </CustomIconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Tên sản phẩm"
                          value={modalFeedback?.product?.name ?? '0'}
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
