import { CustomIconButton } from '@/components/buttons';
import { SuperDetail_SaleObject } from '@/lib/models';
import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbarService } from '@/lib/contexts';
import { ThongTin_Content } from './ThongTin_Content';
import { Outlined_TextField } from '../order/MyModal/Outlined_TextField';
import { formatPrice } from '@/lib/utils';

export function MyModal({
  open,
  handleClose,
  sale,
  handleSaleDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  sale: SuperDetail_SaleObject | null;
  handleSaleDataChange: (value: SuperDetail_SaleObject) => void;
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

  const [modalSale, setModalSale] = useState<SuperDetail_SaleObject | null>(
    sale
  );

  useEffect(() => {
    setModalSale(() => sale);
  }, [sale]);

  //#region hàm
  const clearData = () => {
    setModalSale(() => null);
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
            Chi tiết khuyến mãi
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
              {/* Thông tin khuyến mãi */}
              <Grid item xs={12} alignSelf={'stretch'}>
                <ThongTin_Content
                  textStyle={textStyle}
                  modalSale={modalSale}
                  handleSaleDataChange={handleSaleDataChange}
                />
              </Grid>

              {/* Thống kê */}
              <Grid item xs={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
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
                      Thống kê
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
                      <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Lượt sử dụng"
                          value={modalSale?.numberOfUse ?? 'Trống'}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Số tiền đã giảm"
                          value={
                            formatPrice(modalSale?.totalSaleAmount) ?? 'Trống'
                          }
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
