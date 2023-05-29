import { TabPanel } from '@/components/Manage/modals/forms/components';
import { useSnackbarService } from '@/lib/contexts';
import {
  getCollection,
  getCollectionWithQuery,
  getDocFromFirestore,
} from '@/lib/firestore/firestoreLib';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import { BatchObject } from '@/lib/models/Batch';
import { BillObject } from '@/lib/models/Bill';
import { BillDetailObject } from '@/lib/models/BillDetail';
import { DeliveryObject } from '@/lib/models/Delivery';
import formatPrice from '@/utilities/formatCurrency';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Modal,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { getDocFromCache, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';

interface AssembledBillDetail extends BillDetailObject {
  productName?: string;
  productTypeName?: string;
  material?: string;
  size?: string;
}

const modalStyle = {
  // These 4 below are positionings I used for larger
  // height viewports - centered
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // other styles...
  width: 1000,
  bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 24,
  p: 4,
  marginTop: '2rem',
  // media query @ the max height you want (my case is the
  // height of the viewport before the cutoff phenomenon) -
  // set the top to '0' and translate the previous 'y'
  // positioning coordinate so the top of the modal is @ the
  // top of the viewport
  '@media(max-height: 890px)': {
    top: '0',
    transform: 'translate(-50%, 0%)',
  },
};

const MyTable = ({
  billsData,
  handleViewBill,
}: {
  billsData: CustomBill[];
  handleViewBill: (value: CustomBill) => void;
}) => {
  const billStatusParse = (state: number) => {
    switch (state) {
      case -1:
        return 'Hủy';
      case 0:
        return 'Chưa thanh toán';
      case 1:
        return 'Đã thanh toán';
      default:
        return 'Lỗi';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn</TableCell>
            <TableCell align="right">Khách hàng</TableCell>
            <TableCell align="right">Ngày đặt</TableCell>
            <TableCell align="right">Tổng đơn</TableCell>
            <TableCell align="right">Tình trạng</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billsData.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.customerName}</TableCell>
              <TableCell align="right">
                {new Date(row.created_at ?? new Date()).toLocaleString(
                  'vi-VI',
                  {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  }
                )}
              </TableCell>
              <TableCell align="right">
                {formatPrice(row?.totalPrice ?? 0)}
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body2"
                  sx={{
                    color: row.state === 1 ? 'green' : 'red',
                  }}
                >
                  {billStatusParse(row.state ?? -2)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={2} justifyContent={'center'}>
                  <Button
                    variant="contained"
                    onClick={() => handleViewBill(row)}
                  >
                    Xem
                  </Button>
                  <Button variant="contained">Xóa</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MyListItem = ({ billDetail }: { billDetail: AssembledBillDetail }) => {
  return (
    <Card sx={{ padding: 1, width: '100%' }}>
      <Stack spacing={2}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack direction={'row'} spacing={1}>
            <Typography>{`${billDetail.productName} (${billDetail.productTypeName})`}</Typography>
            <Chip label={billDetail.material} />
            <Chip label={billDetail.size} />
          </Stack>
          <Typography>x {billDetail.amount}</Typography>
        </Stack>
        <Stack direction={'row'} spacing={1} justifyContent="end">
          <Typography
            sx={
              (billDetail.discountPrice ?? -1) <= 0
                ? {}
                : {
                    fontWeight: 'normal',
                    textDecoration: 'line-through',
                  }
            }
          >
            {formatPrice(billDetail.price ?? 0)}
          </Typography>
          {(billDetail.discountPrice ?? -1) > 0 && (
            <Typography>
              {formatPrice(billDetail.discountPrice ?? 0)}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

const MyModal = ({
  open,
  handleClose,
  bill,
}: {
  open: boolean;
  handleClose: () => void;
  bill: CustomBill | null;
}) => {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [billDetails, setBillDetails] = useState<AssembledBillDetail | null>(
    null
  );

  //#endregion

  //#region UseEffects

  useEffect(() => {
    console.log('Loading product list...');

    const getData = async (bill: CustomBill) => {
      const billDetails = await getCollectionWithQuery<BillDetailObject>(
        'bill_details',
        where('bill_id', '==', bill.id)
      );

      const assembledBillDetails = await Promise.all(
        billDetails.map(async (detail) => {
          const batch = (await getDocFromFirestore(
            'batches',
            detail.batch_id!
          )) as BatchObject;

          const product = (await getDocFromFirestore(
            'products',
            batch.product_id
          )) as ProductObject;

          const productType = (await getDocFromFirestore(
            'productTypes',
            product.productType_id
          )) as ProductTypeObject;

          return {
            ...detail,
            productName: product.name,
            productTypeName: productType.name,
            material: batch.material,
            size: batch.size,
          };
        })
      );

      setBillDetails(() => assembledBillDetails);
    };

    if (!bill) {
      handleSnackbarAlert('error', 'Đã có lỗi xảy ra');
      handleClose();
      return;
    }

    getData(bill);
  }, [bill]);

  //#endregion

  //#region UseMemos

  //#endregion

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={modalStyle}>
        {/* Header */}
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography variant="h6">Xem đơn hàng</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>

        <Divider />

        {/* Content */}
        <CardContent>
          <Grid container paddingY={2}>
            {/* Left  */}
            <Grid item xs={5.5}>
              <Typography variant="h6">Thông tin chung</Typography>
              <Divider sx={{ my: 1 }} />
              {/* Mã đơn */}
              <Stack direction="row" spacing={1} alignItems={'center'}>
                <Typography variant="body1">Mã đơn: </Typography>
                <Typography
                  sx={{
                    fontWeight: 'normal',
                  }}
                >
                  {bill?.id ?? 'Null value'}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Divider orientation="vertical" />
            </Grid>

            {/* Right */}
            <Grid item xs={5.5}>
              <Typography variant="h6">Đơn hàng</Typography>
              <Divider sx={{ my: 1 }} />

              {/* Item List */}
              <List>
                {billDetails?.map(
                  (billDetail: BillDetailObject, index: number) => {
                    return (
                      <ListItem key={index}>
                        <MyListItem billDetail={billDetail} />
                      </ListItem>
                    );
                  }
                )}
              </List>

              <Divider />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'end',
                  marginTop: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5">Phí vận chuyển: </Typography>
                  <Typography variant="body1">
                    {formatPrice(bill?.deliveryPrice ?? 0)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5">Sale: </Typography>
                  <Typography variant="body1">
                    {bill?.salePercent ?? 0}%
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="start">
                  <Typography variant="h5">Tổng tiền:</Typography>
                  <Stack>
                    {(bill?.originalPrice ?? 0) > 0 && (
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'normal',
                          textDecoration: 'line-through',
                        }}
                      >
                        {formatPrice(bill?.originalPrice ?? 0)}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      {formatPrice(bill?.totalPrice ?? 0)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        {/* Buttons */}
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button onClick={handleClose}>Đóng</Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

const Order = ({ bills }: { bills: string }) => {
  //#region States

  const [open, setOpen] = React.useState(false);
  const [currentViewBill, setCurrentViewBill] = useState<CustomBill | null>(
    null
  );

  //#endregion

  //#region  UseMemos

  const billsData: CustomBill[] = useMemo(() => {
    const parsedBills = (JSON.parse(bills) as CustomBill[]) ?? [];

    return parsedBills;
  }, []);

  //#endregion

  //#region Handlers

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewBill = (value: CustomBill) => {
    handleOpen();

    setCurrentViewBill(() => value);
  };

  //#endregion

  return (
    <Container
      sx={{
        mt: 4,
      }}
    >
      <Card
        sx={{
          width: '100%',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        {/* Title */}
        <Typography>Đơn hàng</Typography>

        {/* Table */}
        <MyTable billsData={billsData} handleViewBill={handleViewBill} />

        {/* Modals */}
        <MyModal open={open} handleClose={handleClose} bill={currentViewBill} />
      </Card>
    </Container>
  );
};

interface CustomBill extends BillObject {
  customerName?: string;
  deliveryPrice?: number;
  salePercent?: number;
}

export const getServerSideProps = async () => {
  let finalBills: CustomBill[] = [];

  try {
    const bills = await getCollection<BillObject>('bills');

    finalBills = await Promise.all(
      bills.map(async (bill) => {
        let customerName = '';
        let salePercent: number = 0;

        if (Boolean(bill.user_id && bill.user_id !== '')) {
          const customer = await getDocFromFirestore(
            'users',
            bill.user_id as string
          );

          customerName = customer.name;
        }

        if (Boolean(bill.sale_id && bill.sale_id !== '')) {
          const sale = await getDocFromFirestore(
            'sales',
            bill.sale_id as string
          );

          console.log(sale);

          salePercent = sale.percent;
        }

        const deliveries = await getCollectionWithQuery<DeliveryObject>(
          'deliveries',
          where('bill_id', '==', bill.id)
        );

        const deliveryPrice = deliveries[0].price;

        return {
          ...bill,
          customerName: customerName,
          deliveryPrice: deliveryPrice,
          salePercent: salePercent,
        } as CustomBill;
      })
    );

    console.log(finalBills);

    return {
      props: {
        bills: JSON.stringify(finalBills),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        bills: [],
      },
    };
  }
};

export default Order;
