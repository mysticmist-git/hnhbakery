import { useSnackbarService } from '@/lib/contexts';
import { DeliveryObject, SuperDetail_DeliveryObject } from '@/lib/models';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { CustomIconButton } from '../buttons';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import { COLLECTION_NAME } from '@/lib/constants';

export function ModalState({
  open,
  handleClose,
  deliveryState,
  setDeliveryState,
  handleDeliveryDataChange,
}: {
  open: boolean;
  handleClose: any;
  deliveryState: SuperDetail_DeliveryObject | null;
  setDeliveryState: React.Dispatch<
    React.SetStateAction<SuperDetail_DeliveryObject | null>
  >;
  handleDeliveryDataChange: any;
}) {
  const clearData = () => {
    setDeliveryState(() => null);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        fullWidth
        maxWidth="xs"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
          },
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <DialogTitle>
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
          <Typography
            align="center"
            variant="body1"
            sx={{
              fontWeight: 'bold',
              px: 4,
            }}
            color={theme.palette.common.black}
          >
            Xác nhận hủy giao hàng?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box
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
              color={'error'}
              onClick={async () => {
                const data = (
                  await getCollection<DeliveryObject>(
                    COLLECTION_NAME.DELIVERIES
                  )
                ).find((delivery) => delivery.id === deliveryState?.id);
                if (data) {
                  data.state = 'cancel';
                  await updateDocToFirestore(data, COLLECTION_NAME.DELIVERIES);

                  if (deliveryState?.billObject?.state == 0) {
                    var bill = deliveryState.billObject;
                    bill.state = -1;
                    await updateDocToFirestore(bill, COLLECTION_NAME.BILLS);
                    deliveryState.billObject = bill;
                  }

                  handleSnackbarAlert('success', 'Hủy giao hàng thành công!');
                  handleDeliveryDataChange({
                    ...deliveryState,
                    ...data,
                  });

                  handleClose();
                } else {
                  handleSnackbarAlert('error', 'Lỗi.');
                  handleClose();
                }
              }}
            >
              Xác nhận
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
