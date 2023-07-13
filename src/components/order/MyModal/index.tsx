import { CustomButton, CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { updateDocToFirestore } from '@/lib/firestore';
import {
  AssembledBillDetail,
  CustomBill,
  SuperDetail_BillObject,
} from '@/lib/models';
import CloseIcon from '@mui/icons-material/Close';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { Box, alpha } from '@mui/system';
import { memo, useEffect, useRef, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { deliveryStatusParse } from '@/lib/manage/manage';
import { Outlined_TextField } from './Outlined_TextField';
import { ThongTin_Content } from './ThongTin_Content';
import { SaleDelivery_Content } from './SaleDelivery_Content';

type EditType = {
  name?: string;
  tel?: string;
  email?: string;
  address?: string;
  date?: Date;
  time?: string;
};

function ResetEditContent(bill: SuperDetail_BillObject | null) {
  return {
    name: bill?.deliveryObject?.name ?? 'Trống',
    tel: bill?.deliveryObject?.tel ?? 'Trống',
    email: bill?.deliveryObject?.email ?? 'Trống',
    address: bill?.deliveryObject?.address ?? 'Trống',
    date: bill?.deliveryObject?.date ?? new Date(),
    time: bill?.deliveryObject?.time ?? 'Trống',
  };
}

function SanPham_Content(props: any) {
  return (
    <>
      <Box>Huy</Box>
    </>
  );
}

const MyModal = ({
  open,
  handleClose,
  bill,
  handleBillDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  bill: SuperDetail_BillObject | null;
  handleBillDataChange: (newBill: SuperDetail_BillObject) => void;
}) => {
  const handleSnackbarAlert = useSnackbarService();

  //#region Style
  const theme = useTheme();

  const StyleCuaCaiBox = {
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
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };
  //#endregion

  const [modalBill, setModalBill] = useState<SuperDetail_BillObject | null>(
    bill
  );

  const [billState, setBillState] = useState<number>(modalBill?.state ?? 0);
  const handleBillStateChange = (state: number) => {
    setBillState(() => state);
  };

  //#region UseEffects

  // useEffect(() => {
  //   const getData = async (bill: CustomBill) => {
  //     const billDetails = await getCollectionWithQuery<BillDetailObject>(
  //       'bill_details',
  //       where('bill_id', '==', bill.id)
  //     );

  //     const assembledBillDetails = await Promise.all(
  //       billDetails.map(async (detail) => {
  //         const batch = (await getDocFromFirestore(
  //           'batches',
  //           detail.batch_id!
  //         )) as BatchObject;

  //         const product = (await getDocFromFirestore(
  //           'products',
  //           batch.product_id
  //         )) as ProductObject;

  //         const productType = (await getDocFromFirestore(
  //           'productTypes',
  //           product.productType_id
  //         )) as ProductTypeObject;

  //         return {
  //           ...detail,
  //           productName: product.name,
  //           productTypeName: productType.name,
  //           material: batch.material,
  //           size: batch.size,
  //         };
  //       })
  //     );

  //     setBillDetails(() => assembledBillDetails);
  //   };

  //   if (!bill) {
  //     handleSnackbarAlert('error', 'Đã có lỗi xảy ra');
  //     handleClose();
  //     return;
  //   }

  //   setBillState(() => bill.state ?? 0);
  //   getData(bill);
  // }, [bill]);

  //#endregion

  //#region Modal Chi tiết
  const clearData = () => {
    setModalBill(() => null);
    setBillState(() => 0);
  };
  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState<EditType>(
    ResetEditContent(bill)
  );
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditContent(() => ResetEditContent(bill));
    handleSnackbarAlert('info', 'Đã hủy thay đổi.');
  };

  const handleSaveEdit = () => {
    setEditMode(false);
    // Hỏi Hên Hàm update
    // const data = {
    //   ...bill,
    //   state: billState,
    // } as CustomBill;
    // updateDocToFirestore(data, 'bills');
    // handleSnackbarAlert('success', 'Đã cập nhật đơn hàng');
    // handleBillDataChange(data);
    handleSnackbarAlert('success', 'Thay đổi thành công!');
  };
  //#endregion

  useEffect(() => {
    setModalBill(() => bill);
    setEditContent(() => ResetEditContent(bill));
  }, [bill]);

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
            Chi tiết đơn hàng
          </Typography>

          <Box>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <CloseIcon />
            </CustomIconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {/* Thông tin */}
              <Grid item xs={12} md={6} lg={5} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
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
                      Thông tin đặt hàng
                    </Typography>
                  </Box>

                  <ThongTin_Content
                    textStyle={textStyle}
                    modalBill={modalBill}
                  />
                </Box>
              </Grid>

              {/* Sales và deliver */}
              <Grid item xs={12} md={6} lg={7} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      height: '40px',
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Khuyến mãi và vận chuyển
                    </Typography>
                  </Box>

                  <SaleDelivery_Content
                    textStyle={textStyle}
                    modalBill={modalBill}
                  />
                </Box>
              </Grid>

              {/* Người nhận */}
              <Grid item xs={12} md={12} lg={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      height: '40px',
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Người nhận
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      {!editMode && (
                        <CustomIconButton onClick={() => setEditMode(true)}>
                          <EditRoundedIcon fontSize="small" color="primary" />
                        </CustomIconButton>
                      )}
                      {editMode && (
                        <>
                          <CustomIconButton onClick={handleSaveEdit}>
                            <SaveAsRoundedIcon
                              fontSize="small"
                              color="primary"
                            />
                          </CustomIconButton>
                          <CustomIconButton onClick={handleCancelEdit}>
                            <CloseIcon fontSize="small" color="primary" />
                          </CustomIconButton>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <Grid
                      container
                      spacing={3}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item xs={12} md={6} lg={4}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Tên"
                          value={editContent.name}
                          onChange={(event: any) => {
                            setEditContent({
                              ...editContent,
                              name: event.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: !editMode,
                            style: {
                              pointerEvents: editMode ? 'auto' : 'none',
                              borderRadius: '8px',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={4}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Số điện thoại"
                          value={editContent.tel}
                          onChange={(event: any) => {
                            setEditContent({
                              ...editContent,
                              tel: event.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: !editMode,
                            style: {
                              pointerEvents: editMode ? 'auto' : 'none',
                              borderRadius: '8px',
                            },
                          }}
                          type="tel"
                        />
                      </Grid>

                      <Grid item xs={12} md={12} lg={4}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Email"
                          value={editContent.email}
                          onChange={(event: any) => {
                            setEditContent({
                              ...editContent,
                              email: event.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: !editMode,
                            style: {
                              pointerEvents: editMode ? 'auto' : 'none',
                              borderRadius: '8px',
                            },
                          }}
                          type="email"
                        />
                      </Grid>

                      <Grid item xs={12} md={12} lg={12}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Địa chỉ giao hàng"
                          value={editContent.address}
                          onChange={(event: any) => {
                            setEditContent({
                              ...editContent,
                              address: event.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: !editMode,
                            style: {
                              pointerEvents: editMode ? 'auto' : 'none',
                              borderRadius: '8px',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} lg={12}>
                        <Divider sx={{ width: '100%' }} />
                      </Grid>

                      <Grid item xs={12} md={6} lg={4}>
                        <DatePicker
                          label="Ngày muốn nhận"
                          views={['day', 'month', 'year']}
                          sx={{
                            width: '100%',
                          }}
                          value={dayjs(editContent.date)}
                          onChange={(day: any) => {
                            setEditContent({
                              ...editContent,
                              date: new Date(day),
                            });
                          }}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              InputProps: {
                                readOnly: !editMode,
                                style: {
                                  pointerEvents: editMode ? 'auto' : 'none',
                                  borderRadius: '8px',
                                },
                              },
                              inputProps: {
                                sx: {
                                  ...textStyle,
                                },
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={4}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Giờ muốn nhận"
                          value={editContent.time}
                          onChange={(event: any) => {
                            setEditContent({
                              ...editContent,
                              time: event.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: !editMode,
                            style: {
                              pointerEvents: editMode ? 'auto' : 'none',
                              borderRadius: '8px',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} lg={4}>
                        <Outlined_TextField
                          textStyle={textStyle}
                          label="Trạng thái giao hàng"
                          value={deliveryStatusParse(
                            modalBill?.deliveryObject?.state ?? 'Trống'
                          )}
                          InputProps={{
                            readOnly: true,
                            style: {
                              pointerEvents: 'none',
                              borderRadius: '8px',
                            },
                          }}
                          inputProps={{
                            sx: {
                              color: () => {
                                switch (
                                  modalBill?.deliveryObject?.state ??
                                  'Trống'
                                ) {
                                  case 'fail':
                                    return theme.palette.error.main;
                                  case 'success':
                                    return theme.palette.success.main;
                                  case 'inProcress':
                                    return theme.palette.text.secondary;
                                  case 'inTransit':
                                    return theme.palette.secondary.main;
                                  default:
                                    return theme.palette.common.black;
                                }
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={12} lg={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      height: '40px',
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Danh sách sản phẩm
                    </Typography>
                  </Box>
                  <SanPham_Content />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(MyModal);
