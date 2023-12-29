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
import { updateSale } from '@/lib/DAO/saleDAO';
import { getCustomerRank } from '@/lib/DAO/customerRankDAO';
import { updateUser } from '@/lib/DAO/userDAO';
import { GUEST_UID } from '@/lib/DAO/groupDAO';

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
  sendBillToMail: (subject: string, bill?: BillTableRow) => Promise<void>;
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
          <form onSubmit={(e) => e.preventDefault()} method="post">
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
                type="submit"
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
                      bill.state =
                        billState == 'paid' ? 'refunded' : 'cancelled';
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

                      // Cập nhật Sale khi refunded
                      if (deliveryState && deliveryState.sale) {
                        const usedTurn: number =
                          parseInt(deliveryState.sale.usedTurn.toString()) - 1;

                        const totalSalePrice: number =
                          deliveryState.state == 'refunded'
                            ? parseFloat(
                                deliveryState.sale.totalSalePrice.toString()
                              ) -
                              parseFloat(deliveryState.sale_price.toString())
                            : deliveryState.sale.totalSalePrice;

                        await updateSale(deliveryState.sale_id, {
                          ...deliveryState.sale,
                          usedTurn: parseInt(usedTurn.toString()),
                          totalSalePrice: parseFloat(totalSalePrice.toString()),
                        });
                      }

                      // Cập nhật User
                      if (
                        deliveryState &&
                        deliveryState.customer &&
                        deliveryState.customer.paidMoney &&
                        deliveryState.customer.rankId
                      ) {
                        const paidMoney: number =
                          deliveryState.state == 'refunded'
                            ? parseFloat(
                                deliveryState.customer.paidMoney.toString()
                              ) -
                              parseFloat(deliveryState.final_price.toString())
                            : deliveryState.customer.paidMoney;

                        const customerRank = await getCustomerRank(
                          deliveryState.customer.rankId
                        );
                        let rankId =
                          paidMoney < customerRank!.minPaidMoney
                            ? parseInt(deliveryState.customer.rankId) - 1
                            : deliveryState.customer.rankId;

                        rankId =
                          deliveryState.customer.uid != GUEST_UID
                            ? rankId
                            : '1';

                        await updateUser(
                          deliveryState.customer.group_id,
                          deliveryState.customer.id,
                          {
                            ...deliveryState.customer,
                            paidMoney: parseFloat(paidMoney.toString()),
                            rankId: rankId.toString(),
                          }
                        );
                      }
                    }

                    handleSnackbarAlert('success', 'Hủy giao hàng thành công!');
                    sendBillToMail('Hủy giao hàng', deliveryState);
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
          </form>
        </DialogActions>
      </Dialog>
    </>
  );
}
