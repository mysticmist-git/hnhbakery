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
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import ChiTietDonHang_Content from '../ChiTietDonHang_Content';
import DonHang_Content from '../DonHang_Content';
import ThongTin_Content from '../ThongTin_Content';
import { BillTableRow } from '@/models/bill';
import { getDeliveryById, updateDelivery } from '@/lib/DAO/deliveryDAO';
import { updateBill } from '@/lib/DAO/billDAO';
import { sendBillToEmail } from '@/lib/services/MailService';
import Delivery from '@/models/delivery';
import { updateSale } from '@/lib/DAO/saleDAO';
import { getCustomerRank } from '@/lib/DAO/customerRankDAO';
import { updateUser } from '@/lib/DAO/userDAO';
import { GUEST_ID, GUEST_UID } from '@/lib/DAO/groupDAO';
import { updateCustomerReferenceByBillTableRow } from '@/lib/DAO/customerReferenceDAO';

export default function MyModal({
  open,
  handleClose,
  delivery,
  handleDeliveryDataChange,
  sendBillToMail,
}: {
  open: boolean;
  handleClose: any;
  delivery: BillTableRow | null;
  handleDeliveryDataChange: any;
  sendBillToMail: (subject: string, bill?: BillTableRow) => Promise<void>;
}) {
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  const StyleCuaCaiBox = useMemo(() => {
    return {
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
  }, [theme]);

  const textStyle = useMemo(() => {
    return {
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.common.black,
      fontWeight: theme.typography.body2.fontWeight,
      fontFamily: theme.typography.body2.fontFamily,
    };
  }, [theme]);

  const [modalDelivery, setModalDelivery] = useState<BillTableRow | null>(
    delivery
  );

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

  const onSubmit = async (type: 'giaothanhcong' | 'batdaugiao') => {
    if (!modalDelivery) return;

    const typeSubmit: {
      state: Delivery['state'];
      message: string;
      subject: string;
    } = {
      state: type == 'batdaugiao' ? 'delivering' : 'delivered',
      message:
        type == 'batdaugiao'
          ? 'Bắt đầu giao hàng thành công!'
          : 'Giao hàng thành công!',
      subject: type == 'batdaugiao' ? 'Đơn hàng đang giao' : 'Đơn hàng đã giao',
    };

    const data = await getDeliveryById(modalDelivery!.deliveryTableRow!.id);
    if (data) {
      data.state = typeSubmit.state;
      modalDelivery!.deliveryTableRow!.state = typeSubmit.state;
      await updateDelivery(data.id, data);

      if (type == 'giaothanhcong' && modalDelivery?.state == 'pending') {
        var bill = { ...modalDelivery };
        bill.state = 'paid';
        delete bill?.paymentMethod;
        delete bill?.customer;
        delete bill?.sale;
        delete bill?.deliveryTableRow;
        delete bill?.billItems;

        await updateBill(
          modalDelivery.customer!.group_id,
          modalDelivery.customer!.id,
          bill.id,
          bill
        );

        // Cập nhật customer reference
        if (
          modalDelivery.customer &&
          modalDelivery.customer.uid != GUEST_UID &&
          modalDelivery.billItems
        ) {
          await updateCustomerReferenceByBillTableRow(modalDelivery);
        }

        // Cập nhật Sale khi đơn thành công
        if (modalDelivery.sale) {
          const totalSalePrice: number =
            parseFloat(modalDelivery.sale.totalSalePrice.toString()) +
            parseFloat(modalDelivery.sale_price.toString());
          await updateSale(modalDelivery.sale_id, {
            ...modalDelivery.sale,
            totalSalePrice: parseFloat(totalSalePrice.toString()),
          });
        }

        // Cập nhật User rank và tiền đã thanh toán
        if (
          modalDelivery.customer &&
          modalDelivery.customer.paidMoney &&
          modalDelivery.customer.rankId
        ) {
          const paidMoney: number =
            parseFloat(modalDelivery.customer.paidMoney.toString()) +
            parseFloat(modalDelivery.final_price.toString());

          const customerRank = await getCustomerRank(
            modalDelivery.customer.rankId
          );
          let rankId =
            paidMoney >= customerRank!.maxPaidMoney
              ? parseInt(modalDelivery.customer.rankId) + 1
              : modalDelivery.customer.rankId;

          rankId = modalDelivery.customer.uid != GUEST_UID ? rankId : '1';

          await updateUser(
            modalDelivery.customer.group_id,
            modalDelivery.customer.id,
            {
              ...modalDelivery.customer,
              paidMoney: parseFloat(paidMoney.toString()),
              rankId: rankId.toString(),
            }
          );
        }

        modalDelivery.state = 'paid';
      }

      handleSnackbarAlert('success', typeSubmit.message);
      sendBillToMail(typeSubmit.subject, modalDelivery);
      handleDeliveryDataChange({
        ...modalDelivery,
      });

      handleClose();
    } else {
      handleSnackbarAlert('error', 'Lỗi.');
      handleClose();
    }
  };

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
              {/* Thông tin giao hàng */}
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
                      Thông tin giao hàng
                    </Typography>
                  </Box>
                  <Box
                    component={'div'}
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
                      Thông tin đơn hàng
                    </Typography>
                  </Box>
                  <Box
                    component={'div'}
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
                <Box component={'div'} sx={StyleCuaCaiBox}>
                  <Box
                    component={'div'}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
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
                    component={'div'}
                    sx={{
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
          <Box component={'div'} sx={{ width: '100%' }} textAlign={'center'}>
            {modalDelivery?.deliveryTableRow?.state === 'delivering' && (
              <form
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <Button
                  type="submit"
                  color="success"
                  onClick={async () => {
                    await onSubmit('giaothanhcong');
                  }}
                  variant="contained"
                >
                  Giao hàng thành công
                </Button>
              </form>
            )}

            {modalDelivery?.deliveryTableRow?.state === 'issued' &&
              (modalDelivery?.state === 'pending' ||
                modalDelivery?.state === 'paid') && (
                <form
                  method="post"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Button
                    type="submit"
                    onClick={async () => {
                      await onSubmit('batdaugiao');
                    }}
                    color="secondary"
                    variant="contained"
                  >
                    Bắt đầu giao hàng
                  </Button>
                </form>
              )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
