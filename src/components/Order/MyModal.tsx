import { useSnackbarService } from '@/lib/contexts';
import {
  AssembledBillDetail,
  CustomBill,
  MyListItem,
  billStatusParse,
} from '@/lib/contexts/orders';
import {
  getCollectionWithQuery,
  getDocFromFirestore,
  updateDocToFirestore,
} from '@/lib/firestore/firestoreLib';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import { BatchObject } from '@/lib/models/Batch';
import { BillDetailObject } from '@/lib/models/BillDetail';
import formatPrice from '@/utilities/formatCurrency';
import { Close } from '@mui/icons-material';
import {
  Modal,
  Card,
  Typography,
  IconButton,
  Divider,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  List,
  ListItem,
  CardActions,
  Button,
} from '@mui/material';
import { Stack, Box } from '@mui/system';
import { where } from 'firebase/firestore';
import { useState, useEffect, memo } from 'react';

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

const MyModal = ({
  open,
  bill,
  handleClose,
  handleBillDataChange,
}: {
  open: boolean;
  bill: CustomBill | null;
  handleClose: () => void;
  handleBillDataChange: (newBill: CustomBill) => void;
}) => {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [billDetails, setBillDetails] = useState<AssembledBillDetail | null>(
    null
  );
  const [billState, setBillState] = useState<number>(0);

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

    console.log(bill);

    setBillState(() => bill.state ?? 0);
    getData(bill);
  }, [bill]);

  //#endregion

  // #region Methods

  const clearData = () => {
    setBillDetails(() => null);
    setBillState(() => 0);
  };

  // #endregion

  //#region Handlers

  const handleBillStateChange = (state: number) => {
    setBillState(() => state);
  };

  const handleSave = () => {
    const data = {
      ...bill,
      state: billState,
    } as CustomBill;

    updateDocToFirestore(data, 'bills');

    handleSnackbarAlert('success', 'Đã cập nhật đơn hàng');

    handleBillDataChange(data);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  //#endregion

  return (
    <Modal
      open={open}
      onClose={localHandleClose}
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
          <IconButton onClick={localHandleClose}>
            <Close />
          </IconButton>
        </Stack>

        <Divider />

        {/* Content */}
        <CardContent>
          <Grid container paddingY={2}>
            {/* Left  */}
            <Grid item xs={5.5}>
              {/* Mã đơn */}
              <Stack direction="row" spacing={1} alignItems={'center'}>
                <Typography variant="h6">Mã đơn: </Typography>
                <Typography
                  sx={{
                    fontWeight: 'normal',
                  }}
                >
                  {bill?.id ?? 'Null value'}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1">Thông tin chung</Typography>
              <Divider sx={{ my: 1 }} />

              {/* Khách hàng */}
              <Stack direction="row" spacing={1} alignItems={'center'}>
                <Typography variant="h6">Khách hàng:</Typography>
                <Typography
                  sx={{
                    fontWeight: 'normal',
                  }}
                >
                  {bill?.customerName ?? 'Không tìm thấy'}
                </Typography>
              </Stack>

              {/* Số điện thoại */}
              <Stack direction="row" spacing={1} alignItems={'center'}>
                <Typography variant="h6">Số điện thoại:</Typography>
                <Typography
                  sx={{
                    fontWeight: 'normal',
                  }}
                >
                  {bill?.customerTel ?? 'Không tìm thấy'}
                </Typography>
              </Stack>

              {/* Địa chỉ */}
              <Stack direction="row" spacing={1} alignItems={'center'}>
                <Typography variant="h6">Địa chỉ:</Typography>
                <Typography
                  sx={{
                    fontWeight: 'normal',
                  }}
                >
                  {bill?.customerAddress ?? 'Không tìm thấy'}
                </Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />
              {/* Trạng thái */}

              <FormControl fullWidth>
                <InputLabel
                  id="state-select"
                  sx={{
                    '&.Mui-focused': {
                      color: 'secondary.main',
                    },
                  }}
                >
                  Trạng thái
                </InputLabel>
                <Select
                  fullWidth
                  labelId="state-select"
                  value={billState}
                  label="Age"
                  renderValue={(value) => (
                    <Typography
                      sx={{
                        color:
                          value === 1
                            ? 'green'
                            : value == 0
                            ? 'secondary.main'
                            : 'secondary.main',
                      }}
                    >
                      {billStatusParse(value)}
                    </Typography>
                  )}
                  onChange={(e) =>
                    handleBillStateChange(e.target.value as number)
                  }
                >
                  {[1, 0, -1].map((state) => (
                    <MenuItem value={state}>
                      <Typography
                        sx={{
                          color:
                            state === 1
                              ? 'green'
                              : state == 0
                              ? 'secondary.main'
                              : 'secondary.main',
                        }}
                      >
                        {billStatusParse(state)}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider sx={{ my: 1 }} />

              {/* Note */}
              <Typography variant="body1">Ghi chú</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ fontWeight: 'normal' }}>
                {bill?.note ?? 'Không'}
              </Typography>
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
              {!billDetails && <Skeleton variant="rectangular" height={60} />}
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
                {/* Sale */}
                {bill?.sale_id && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h5">Sale: </Typography>
                    <Typography variant="body1">
                      {`${bill?.sale_id} | ${bill?.salePercent ?? 0}%`}
                    </Typography>
                  </Stack>
                )}

                {/* Tổng tiền */}
                <Stack direction="row" spacing={1} alignItems="start">
                  <Typography variant="h5">Giá trị đơn hàng:</Typography>
                  <Stack>
                    {bill?.sale_id && (
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

                {/* Phí vận chuyển */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5">Phí vận chuyển: </Typography>
                  <Typography variant="body1">
                    {formatPrice(bill?.deliveryPrice ?? 0)}
                  </Typography>
                </Stack>
              </Box>

              <Divider sx={{ my: 1 }} />
              {/* Thành tiền */}

              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Stack direction="row" spacing={1} alignItems="start">
                  <Typography variant="h5">Thành tiền:</Typography>
                  <Typography variant="body1">
                    {formatPrice(
                      (bill?.totalPrice ?? 0) + (bill?.deliveryPrice ?? 0)
                    )}
                  </Typography>
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
          <Button onClick={handleSave}>Lưu</Button>
          <Button onClick={localHandleClose}>Đóng</Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default memo(MyModal);
