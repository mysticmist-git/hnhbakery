import { CustomIconButton } from '@/components/buttons';
import { COLLECTION_NAME } from '@/lib/constants';
import { updateDocToFirestore } from '@/lib/firestore';
import {
  BillObject,
  DeliveryObject,
  SuperDetail_BillObject,
} from '@/lib/models';
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
import React, { useEffect, useState } from 'react';
import { useSnackbarService } from '@/lib/contexts';
import { Close } from '@mui/icons-material';

export function ModalState({
  open,
  handleClose,
  billState,
  setBillState,
  handleBillDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  billState: SuperDetail_BillObject | null;
  setBillState: (prev: any) => void;
  handleBillDataChange: (newBill: SuperDetail_BillObject) => void;
}) {
  const clearData = () => {
    setBillState(() => 0);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  const getIsCancel = () => {
    const deliveryState = billState?.deliveryObject?.state;
    if (deliveryState === 'inTransit') {
      return false;
    } else if (deliveryState === 'inProcress') {
      return true;
    } else if (deliveryState === 'fail') {
      return true;
    } else if (deliveryState === 'success') {
      return false;
    }
  };

  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    setIsCancel(getIsCancel() ?? false);
  }, [billState]);

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
            {isCancel
              ? 'Xác nhận hủy?'
              : 'Không thể hủy đơn hàng! Đơn hàng đang được vận chuyển.'}
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
              {isCancel ? 'Hủy' : 'Đóng'}
            </Button>
            {isCancel && (
              <Button
                variant="contained"
                color="secondary"
                onClick={async () => {
                  const data = {
                    id: billState?.id,
                    paymentTime: billState?.paymentTime,
                    originalPrice: billState?.originalPrice,
                    totalPrice: billState?.totalPrice,
                    note: billState?.note,
                    payment_id: billState?.payment_id,
                    saleAmount: billState?.saleAmount,
                    sale_id: billState?.sale_id,
                    user_id: billState?.user_id,
                    created_at: billState?.created_at,
                    state: -1,
                  } as BillObject;
                  await updateDocToFirestore(data, COLLECTION_NAME.BILLS);

                  const data2 = {
                    ...billState?.deliveryObject,
                    state: 'cancel',
                  } as DeliveryObject;
                  await updateDocToFirestore(data2, COLLECTION_NAME.DELIVERIES);

                  handleSnackbarAlert('success', 'Hủy đơn thành công!');
                  handleBillDataChange({
                    ...billState!,
                    ...data,
                    deliveryObject: data2,
                  });
                  handleClose();
                }}
              >
                Xác nhận
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
