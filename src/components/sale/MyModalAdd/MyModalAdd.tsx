import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { addDocToFirestore } from '@/lib/firestore';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import Sale from '@/models/sale';
import { createSale, getSales } from '@/lib/DAO/saleDAO';

export default function MyModalAdd({
  open,
  handleClose,
  sale,
}: {
  open: boolean;
  handleClose: () => void;
  sale: Sale | null;
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

  const defaultSale: Sale = useMemo(
    () => ({
      id: '',
      name: '',
      code: '',
      percent: 0,
      description: '',
      start_at: new Date(),
      end_at: new Date(new Date().getTime() + 24 * 36000),
      image: '',
      limit: 0,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }),
    []
  );

  const [modalSale, setModalSale] = useState<Sale>(defaultSale);

  useEffect(() => {
    setModalSale(() => defaultSale);
  }, [defaultSale, sale]);

  const clearData = () => {
    setModalSale(() => defaultSale);
  };
  const localHandleClose = () => {
    clearData();
    handleClose();
  };

  const handleAdd = async () => {
    try {
      if (
        !modalSale.code ||
        !modalSale.name ||
        !modalSale.start_at ||
        !modalSale.end_at ||
        !modalSale.percent ||
        !modalSale.limit
      ) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }

      const sales = await getSales();
      sales.find((sale) => {
        if (sale.code === modalSale.code) {
          modalSale.code = '';
          throw new Error('Code khuyến mãi đã tạo');
        }
      });

      let data: Sale = { ...modalSale };
      data.start_at.setHours(0, 0, 0, 0);
      data.end_at.setHours(0, 0, 0, 0);
      await createSale(data);
    } catch (error: any) {
      handleSnackbarAlert('error', error.message);
      return;
    }

    setModalSale(() => defaultSale);
    handleSnackbarAlert('success', 'Thêm khuyến mãi thành công');
    handleClose();
  };

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
            Thêm khuyến mãi
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
                  value={modalSale?.name}
                  onChange={(e: any) => {
                    setModalSale({ ...modalSale, name: e.target.value });
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
                  label="Mã code"
                  value={modalSale?.code}
                  onChange={(e: any) => {
                    setModalSale({ ...modalSale, code: e.target.value });
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
                  label="Phần trăm"
                  type="number"
                  value={modalSale?.percent}
                  onChange={(e: any) => {
                    setModalSale({ ...modalSale, percent: e.target.value });
                  }}
                  InputProps={{
                    readOnly: false,
                    style: {
                      pointerEvents: 'auto',
                      borderRadius: '8px',
                    },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
                <Outlined_TextField
                  textStyle={textStyle}
                  label="Giảm tối đa"
                  type="number"
                  value={modalSale?.limit}
                  onChange={(e: any) => {
                    setModalSale({
                      ...modalSale,
                      limit: e.target.value,
                    });
                  }}
                  InputProps={{
                    readOnly: false,
                    style: {
                      pointerEvents: 'auto',
                      borderRadius: '8px',
                    },
                    endAdornment: (
                      <InputAdornment position="end">đồng</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
                <DatePicker
                  label="Bắt đầu"
                  views={['day', 'month', 'year']}
                  sx={{
                    width: '100%',
                    color: theme.palette.secondary.main,
                  }}
                  value={dayjs(modalSale?.start_at)}
                  onChange={(e: any) => {
                    setModalSale({
                      ...modalSale,
                      start_at: new Date(e),
                    });
                  }}
                  minDate={dayjs(new Date())}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      InputProps: {
                        readOnly: false,
                        style: {
                          pointerEvents: 'auto',
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
              <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
                <DatePicker
                  label="Kết thúc"
                  views={['day', 'month', 'year']}
                  sx={{
                    width: '100%',
                    color: theme.palette.secondary.main,
                  }}
                  value={dayjs(modalSale?.end_at)}
                  onChange={(e: any) => {
                    setModalSale({
                      ...modalSale,
                      end_at: new Date(e),
                    });
                  }}
                  minDate={dayjs(new Date())}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      InputProps: {
                        readOnly: false,
                        style: {
                          pointerEvents: 'auto',
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
              <Grid item xs={12} alignSelf={'stretch'}>
                <Outlined_TextField
                  textStyle={textStyle}
                  label="Mô tả"
                  value={modalSale?.description}
                  onChange={(e: any) => {
                    setModalSale({ ...modalSale, description: e.target.value });
                  }}
                  multiline
                  rows={3}
                  InputProps={{
                    readOnly: false,
                    style: {
                      pointerEvents: 'auto',
                      borderRadius: '8px',
                    },
                  }}
                />
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
            <Button variant="contained" color={'success'} onClick={handleAdd}>
              Thêm
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
