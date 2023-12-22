import { CanNotAccess } from '@/components/cannotAccess/CanNotAccess';
import { DeliveryTable, ModalState, MyModal } from '@/components/deliveries';
import { auth } from '@/firebase/config';
import { getAddress } from '@/lib/DAO/addressDAO';
import { getBatchById } from '@/lib/DAO/batchDAO';
import { getBillTableRows, getBills } from '@/lib/DAO/billDAO';
import { getBillItems } from '@/lib/DAO/billItemDAO';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getDeliveryById } from '@/lib/DAO/deliveryDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import { getPaymentMethodById } from '@/lib/DAO/paymentMethodDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import { getProductTypeById } from '@/lib/DAO/productTypeDAO';
import { getSaleById } from '@/lib/DAO/saleDAO';
import { getUserByUid, getUsers } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';
import { useSnackbarService } from '@/lib/contexts';
import useLoadingService from '@/lib/hooks/useLoadingService';
import { sendBillToEmail } from '@/lib/services/MailService';
import { BillTableRow } from '@/models/bill';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<BillTableRow[]>([]);
  const theme = useTheme();
  const [load, stop] = useLoadingService();

  //#region UserData - Trường hợp là quản lý chi nhánh - Check xem họ là quản lý của chi nhánh nào?
  const [user, userLoading, userError] = useAuthState(auth);
  const [canBeAccessed, setCanBeAccessed] = useState<boolean | undefined>(
    undefined
  );
  // const [userData, setUserData] = React.useState<User | undefined>(undefined);

  //#endregion

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        if (!user) {
          setCanBeAccessed(false);
          stop();
          return;
        }
        const userData = await getUserByUid(user?.uid);
        if (!userData) {
          setCanBeAccessed(false);
          stop();
          return;
        }
        const branch = await getBranchByManager(userData);
        if (!branch) {
          setCanBeAccessed(false);
          stop();
          return;
        }
        setCanBeAccessed(true);

        const finalBills: BillTableRow[] = await getBillTableRows(branch);
        setDeliveries(() => finalBills || []);
        stop();
      } catch (error) {
        console.log(error);
        setCanBeAccessed(false);
        stop();
      }
    };
    fetchData();
  }, [user]);

  const handleDeliveryDataChange = (value: BillTableRow) => {
    setDeliveries(() => {
      return deliveries.map((delivery) => {
        if (
          delivery.id === value.id &&
          delivery.customer_id === value.customer_id
        ) {
          return value;
        } else {
          return delivery;
        }
      });
    });
  };

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = useState(false);
  const [currentViewDelivery, setCurrentViewDelivery] =
    useState<BillTableRow | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewDeliveryModalChiTiet = (value: BillTableRow) => {
    handleOpenModalChiTiet();
    setCurrentViewDelivery(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [deliveryState, setDeliveryState] = useState<BillTableRow | undefined>(
    undefined
  );

  const handleViewDeliveryModalState = (delivery: BillTableRow) => {
    handleOpenModalState();
    setDeliveryState(() => delivery);
  };
  //#endregion

  const handleSnackbarAlert = useSnackbarService();
  const sendBillToMailWithAlert = useCallback(
    async (subject: string, bill?: BillTableRow) => {
      try {
        const email = bill?.deliveryTableRow?.mail ?? '';
        const sendMailResponse = await sendBillToEmail(email, bill, subject);

        if (sendMailResponse.status == 200) {
          handleSnackbarAlert(
            'success',
            'Email cập nhật đã được gửi đến khách hàng.'
          );
        } else {
          console.log(sendMailResponse);
          handleSnackbarAlert(
            'error',
            'Có lỗi xảy ra khi cố gửi mail cho khách hàng'
          );
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  return (
    <>
      <Box
        component={'div'}
        width={'100%'}
        sx={{ p: 2, pr: 3, overflow: 'hidden' }}
      >
        {canBeAccessed == true && (
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                sx={{ color: theme.palette.common.black }}
                variant="h4"
              >
                Quản lý giao hàng
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                *Tìm kiếm theo mã, người nhận, email, số điện thoại, trạng
                thái...
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <DeliveryTable
                deliveryData={deliveries}
                handleViewDelivery={handleViewDeliveryModalChiTiet}
                handleViewDeliveryModalState={handleViewDeliveryModalState}
              />

              {/* Modal chi tiết */}
              <MyModal
                open={openModalChiTiet}
                handleClose={handleCloseModalChiTiet}
                delivery={currentViewDelivery}
                handleDeliveryDataChange={handleDeliveryDataChange}
                sendBillToMail={sendBillToMailWithAlert}
              />

              {/* Modal state */}
              <ModalState
                open={openModalState}
                handleClose={handleCloseModalState}
                deliveryState={deliveryState}
                setDeliveryState={setDeliveryState}
                handleDeliveryDataChange={handleDeliveryDataChange}
                sendBillToMail={sendBillToMailWithAlert}
              />
            </Grid>
          </Grid>
        )}
        {canBeAccessed == false && <CanNotAccess />}
      </Box>
    </>
  );
};

export default Deliveries;
