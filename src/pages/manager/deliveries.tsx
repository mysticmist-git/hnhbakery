import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import {
  AssembledBillDetail,
  BatchObject,
  BillDetailObject,
  BillObject,
  DeliveryObject,
  ProductObject,
  SuperDetail_DeliveryObject,
} from '@/lib/models';
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
import { DeliveryTable } from '../../components/deliveries/DeliveryTable';
import { MyModal } from '../../components/deliveries/MyModal';
import { ModalState } from '../../components/deliveries/ModalState';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Deliveries = ({ deliveryData }: { deliveryData: string }) => {
  const [deliveries, setDeliveries] = useState<SuperDetail_DeliveryObject[]>(
    []
  );
  const theme = useTheme();

  useEffect(() => {
    const parsedDeliveries =
      (JSON.parse(deliveryData) as SuperDetail_DeliveryObject[]) ?? [];
    setDeliveries(() => parsedDeliveries);
  }, []);

  const handleDeliveryDataChange = (value: SuperDetail_DeliveryObject) => {
    setDeliveries(() => {
      return deliveries.map((delivery) => {
        if (delivery.id === value.id) {
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
    useState<SuperDetail_DeliveryObject | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewDeliveryModalChiTiet = (
    value: SuperDetail_DeliveryObject
  ) => {
    handleOpenModalChiTiet();
    setCurrentViewDelivery(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [deliveryState, setDeliveryState] =
    useState<SuperDetail_DeliveryObject | null>(null);

  const handleViewDeliveryModalState = (
    delivery: SuperDetail_DeliveryObject
  ) => {
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

export const getServerSideProps = async () => {
  try {
    const bills = await getCollection<BillObject>(COLLECTION_NAME.BILLS);
    const billDetails = await getCollection<BillDetailObject>(
      COLLECTION_NAME.BILL_DETAILS
    );
    const batches = await getCollection<BatchObject>(COLLECTION_NAME.BATCHES);
    const products = await getCollection<ProductObject>(
      COLLECTION_NAME.PRODUCTS
    );
    const deliveries = await getCollection<DeliveryObject>(
      COLLECTION_NAME.DELIVERIES
    );

    const finalDeliveries: SuperDetail_DeliveryObject[] = deliveries.map(
      (delivery) => {
        const filter_bills = bills.find((bill) => {
          return bill.id === delivery.bill_id;
        });
        const filter_billDetail = billDetails.filter((billDetail) => {
          return billDetail.bill_id === filter_bills?.id;
        });

        const billDetailObjects: AssembledBillDetail[] = filter_billDetail.map(
          (billDetail) => {
            const batch = batches.find(
              (batch) => batch.id === billDetail.batch_id
            );
            const product = products.find(
              (product) => product.id === batch?.product_id
            );
            return {
              ...billDetail,
              batchObject: batch,
              productObject: product,
            };
          }
        );

        return {
          ...delivery,
          billObject: filter_bills,
          billDetailObjects: billDetailObjects,
        };
      }
    );

    return {
      props: {
        deliveryData: JSON.stringify(finalDeliveries),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: { deliveryData: '' },
    };
  }
};
export default Deliveries;
