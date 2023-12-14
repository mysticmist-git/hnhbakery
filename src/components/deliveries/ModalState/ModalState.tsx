import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
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
import { CustomIconButton } from '../../buttons';
import Bill, { BillTableRow } from '@/models/bill';
import { getDeliveryById, updateDelivery } from '@/lib/DAO/deliveryDAO';
import { updateBill } from '@/lib/DAO/billDAO';

export default function ModalState({
  open,
  handleClose,
  deliveryState,
  setDeliveryState,
  handleDeliveryDataChange,
  sendBillToMail,
}: {
  open: boolean;
  handleClose: any;
  deliveryState: BillTableRow | undefined;
  setDeliveryState: React.Dispatch<
    React.SetStateAction<BillTableRow | undefined>
  >;
  handleDeliveryDataChange: any;
  sendBillToMail: (bill?: BillTableRow) => Promise<void>;
}) {
  const clearData = () => {
    setDeliveryState(() => undefined);
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
              color={'error'}
              onClick={async () => {
                const data = await getDeliveryById(
                  deliveryState!.deliveryTableRow!.id
                );
                if (data) {
                  data.state = 'cancelled';
                  deliveryState!.deliveryTableRow!.state = 'cancelled';
                  await updateDelivery(data.id, data);

                  var billState = deliveryState!.state;
                  if (billState == 'pending' || billState == 'paid') {
                    var bill = { ...deliveryState };
                    bill.state = billState == 'paid' ? 'refunded' : 'cancelled';
                    delete bill.paymentMethod;
                    delete bill.customer;
                    delete bill.sale;
                    delete bill.deliveryTableRow;
                    delete bill.billItems;
                    await updateBill(
                      deliveryState!.customer!.group_id,
                      deliveryState!.customer!.id,
                      deliveryState!.id,
                      { ...bill } as Bill
                    );
                    deliveryState!.state =
                      billState == 'paid' ? 'refunded' : 'cancelled';
                  }

                  handleSnackbarAlert('success', 'Hủy giao hàng thành công!');
                  sendBillToMail(deliveryState);
                  handleDeliveryDataChange({
                    ...deliveryState,
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
