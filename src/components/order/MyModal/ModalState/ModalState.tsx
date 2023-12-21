import { CustomIconButton } from '@/components/buttons';
import { createBillDataFromBillTableRow, updateBill } from '@/lib/DAO/billDAO';
import {
  createDeliveryDataFromBillTableRow,
  updateDelivery,
} from '@/lib/DAO/deliveryDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { updateDocToFirestore } from '@/lib/firestore';
import Bill, { BillTableRow } from '@/models/bill';
import Delivery from '@/models/delivery';

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
import React, { useCallback, useEffect, useState } from 'react';

export default function ModalState({
  open,
  handleClose,
  billState,
  setBillState,
  handleBillDataChange,
  sendBillToMail,
}: {
  open: boolean;
  handleClose: () => void;
  billState: BillTableRow | undefined;
  setBillState: (prev: any) => void;
  handleBillDataChange: (newBill: BillTableRow) => void;
  sendBillToMail: (subject: string, bill?: BillTableRow) => Promise<void>;
}) {
  const clearData = () => {
    setBillState(() => undefined);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  const getIsCancel = useCallback(() => {
    const deliveryState = billState?.deliveryTableRow?.state;
    if (deliveryState === 'delivering') {
      return false;
    } else if (deliveryState === 'issued') {
      return true;
    } else if (deliveryState === 'cancelled') {
      return false;
    } else if (deliveryState === 'delivered') {
      return false;
    }
  }, [billState?.deliveryTableRow?.state]);

  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    setIsCancel(getIsCancel() ?? false);
  }, [billState, getIsCancel]);

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
            {isCancel
              ? 'Xác nhận hủy?'
              : 'Không thể hủy đơn hàng! Đơn hàng đang được vận chuyển.'}
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
              {isCancel ? 'Hủy' : 'Đóng'}
            </Button>
            {isCancel && (
              <form onSubmit={(e) => e.preventDefault()} method="post">
                <Button
                  variant="contained"
                  color="error"
                  type="submit"
                  onClick={async () => {
                    if (!billState || !billState.customer) {
                      return;
                    }
                    let billData: Bill | undefined =
                      createBillDataFromBillTableRow({ ...billState });
                    billData.state = 'cancelled';
                    billState.state = 'cancelled';
                    await updateBill(
                      billState.customer.group_id,
                      billState.customer.id,
                      billData.id,
                      billData
                    );

                    if (!billState.deliveryTableRow) {
                      return;
                    }
                    let deliveryData: Delivery | undefined =
                      createDeliveryDataFromBillTableRow({
                        ...billState.deliveryTableRow,
                      });
                    deliveryData.state = 'cancelled';
                    billState.deliveryTableRow.state = 'cancelled';

                    await updateDelivery(deliveryData.id, deliveryData);

                    handleSnackbarAlert('success', 'Hủy đơn thành công!');
                    sendBillToMail('Hủy đơn hàng', billState);

                    handleBillDataChange({
                      ...billState!,
                    });
                    handleClose();
                  }}
                >
                  Xác nhận
                </Button>
              </form>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
