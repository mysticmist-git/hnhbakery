import { DeliveryTable, ModalState, MyModal } from '@/components/deliveries';
import { getAddress } from '@/lib/DAO/addressDAO';
import { getBatchById } from '@/lib/DAO/batchDAO';
import { getBillTableRows, getBills } from '@/lib/DAO/billDAO';
import { getBillItems } from '@/lib/DAO/billItemDAO';
import { getDeliveryById } from '@/lib/DAO/deliveryDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import { getPaymentMethodById } from '@/lib/DAO/paymentMethodDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import { getProductTypeById } from '@/lib/DAO/productTypeDAO';
import { getSaleById } from '@/lib/DAO/saleDAO';
import { getUsers } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';
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
import { useEffect, useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<BillTableRow[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalBills: BillTableRow[] = await getBillTableRows();

        setDeliveries(() => finalBills || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

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

  const [deliveryState, setDeliveryState] = useState<BillTableRow | null>(null);

  const handleViewDeliveryModalState = (delivery: BillTableRow) => {
    handleOpenModalState();
    setDeliveryState(() => delivery);
  };
  //#endregion

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
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
              *Tìm kiếm theo mã, người nhận, email, số điện thoại, trạng thái...
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
            />

            {/* Modal state */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              deliveryState={deliveryState}
              setDeliveryState={setDeliveryState}
              handleDeliveryDataChange={handleDeliveryDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Deliveries;
