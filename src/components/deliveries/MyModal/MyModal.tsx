import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import { DeliveryObject, SuperDetail_DeliveryObject } from '@/lib/models';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import ChiTietDonHang_Content from '../ChiTietDonHang_Content/ChiTietDonHang_Content';
import DonHang_Content from '../DonHang_Content';
import ThongTin_Content from '../ThongTin_Content';

export default function MyModal({
  open,
  handleClose,
  delivery,
  handleDeliveryDataChange,
}: {
  open: boolean;
  handleClose: any;
  delivery: SuperDetail_DeliveryObject | null;
  handleDeliveryDataChange: any;
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
  const [modalDelivery, setModalDelivery] =
    useState<SuperDetail_DeliveryObject | null>(delivery);

  useEffect(() => {
    setModalDelivery(() => delivery);
  }, [delivery]);

  //#region hàm
  const clearData = () => {
    setModalDelivery(() => null);
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
        maxWidth="lg"
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
            Chi tiết giao hàng
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
              {/* Thông tin giao hàng */}
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
                      Thông tin giao hàng
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <ThongTin_Content
                      textStyle={textStyle}
                      modalDelivery={modalDelivery}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Thông tin đơn hàng */}
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
                      Thông tin đơn hàng
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <DonHang_Content
                      textStyle={textStyle}
                      modalDelivery={modalDelivery}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Chi tiết đơn hàng */}
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
                      Chi tiết đơn hàng
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <ChiTietDonHang_Content
                      textStyle={textStyle}
                      modalDelivery={modalDelivery}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Box sx={{ width: '100%' }} textAlign={'center'}>
            <Button
              onClick={async () => {
                const data = (
                  await getCollection<DeliveryObject>(
                    COLLECTION_NAME.DELIVERIES
                  )
                ).find((delivery) => delivery.id === modalDelivery?.id);
                if (data) {
                  data.state = 'success';
                  await updateDocToFirestore(data, COLLECTION_NAME.DELIVERIES);

                  if (modalDelivery?.billObject?.state == 0) {
                    var bill = modalDelivery.billObject;
                    bill.state = 1;
                    await updateDocToFirestore(bill, COLLECTION_NAME.BILLS);
                    modalDelivery.billObject = bill;
                  }

                  handleSnackbarAlert('success', 'Giao hàng thành công!');
                  handleDeliveryDataChange({
                    ...modalDelivery,
                    state: 'success',
                  });

                  handleClose();
                } else {
                  handleSnackbarAlert('error', 'Lỗi.');
                  handleClose();
                }
              }}
              color="success"
              variant="contained"
              disabled={
                modalDelivery?.state === 'success' ||
                modalDelivery?.state === 'cancel'
              }
            >
              Giao hàng thành công
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
