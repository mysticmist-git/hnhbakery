import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { updateDocToFirestore } from '@/lib/firestore';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {
  AssembledBillDetail,
  CustomBill,
  SuperDetail_BillObject,
} from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Box, alpha } from '@mui/system';
import { memo, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function Outlined_TextField(props: any) {
  return (
    <>
      <TextField
        {...props}
        variant="outlined"
        fullWidth
        InputProps={{
          readOnly: true,
          style: {
            borderRadius: '8px',
            pointerEvents: 'none',
          },
          ...props.InputProps,
        }}
        inputProps={{
          sx: {
            ...props.textStyle,
          },
        }}
        type="text"
      >
        {props.children}
      </TextField>
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

  const [billDetails, setBillDetails] = useState<AssembledBillDetail | null>(
    null
  );
  const [billState, setBillState] = useState<number>(0);

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

  const clearData = () => {
    setBillDetails(() => null);
    setBillState(() => 0);
  };

  const handleBillStateChange = (state: number) => {
    setBillState(() => state);
  };

  const handleSave = () => {
    // const data = {
    //   ...bill,
    //   state: billState,
    // } as CustomBill;
    // updateDocToFirestore(data, 'bills');
    // handleSnackbarAlert('success', 'Đã cập nhật đơn hàng');
    // handleBillDataChange(data);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

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
        <DialogTitle>
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
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {/* Thông tin */}
            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
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

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    gap: 3,
                  }}
                >
                  <Outlined_TextField
                    label="Người đặt"
                    value={bill?.userObject?.name ?? 'GUEST'}
                    textStyle={textStyle}
                    InputProps={{
                      readOnly: true,
                      style: {
                        pointerEvents: 'auto',
                        borderRadius: '8px',
                      },
                      endAdornment: bill?.userObject && (
                        <InputAdornment position="end">
                          <CustomIconButton
                            edge="end"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                bill?.userObject?.id ?? 'GUEST'
                              );
                              handleSnackbarAlert(
                                'success',
                                'Đã sao chép mã người dùng vào clipboard!'
                              );
                            }}
                          >
                            <Tooltip title="Sao chép mã người dùng vào clipboard">
                              <ContentCopyRoundedIcon fontSize="small" />
                            </Tooltip>
                          </CustomIconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                    }}
                  >
                    <Outlined_TextField
                      textStyle={textStyle}
                      label="Thanh toán lúc"
                      value={formatDateString(bill?.paymentTime ?? new Date())}
                    />
                    <Outlined_TextField
                      textStyle={textStyle}
                      label="Thanh toán qua"
                      value={bill?.paymentObject?.name ?? 'Trống'}
                    />
                  </Box>

                  <Outlined_TextField
                    textStyle={textStyle}
                    label="Ghi chú cho đơn hàng"
                    multiline
                    maxRows={2}
                    InputProps={{
                      readOnly: true,
                      style: {
                        pointerEvents: 'auto',
                        borderRadius: '8px',
                      },
                    }}
                    value={
                      bill?.note && bill?.note !== '' ? bill?.note : 'Trống '
                    }
                  />
                </Box>
              </Box>
            </Grid>

            {/* Sales và deliver */}
            <Grid item xs={12} md={6} lg={8} alignSelf={'stretch'}>
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

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                    }}
                  >
                    <CustomIconButton>
                      <CloseIcon fontSize="small" />
                    </CustomIconButton>
                    <CustomIconButton>
                      <CloseIcon fontSize="small" />
                    </CustomIconButton>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    gap: 3,
                  }}
                >
                  <Outlined_TextField
                    textStyle={textStyle}
                    label="Khuyến mãi áp dụng"
                    multiline
                    value={
                      bill?.saleObject
                        ? bill?.saleObject?.name +
                          ' | Mã code: ' +
                          bill?.saleObject?.code +
                          ' | Giảm ' +
                          bill?.saleObject?.percent +
                          '% (Tối đa ' +
                          formatPrice(bill?.saleObject?.maxSalePrice ?? 0) +
                          ')\nÁp dụng: ' +
                          new Date(
                            bill?.saleObject?.start_at ?? new Date()
                          ).toLocaleString('vi-VI', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }) +
                          ' - ' +
                          new Date(
                            bill?.saleObject?.end_at ?? new Date()
                          ).toLocaleString('vi-VI', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : 'Không áp dụng'
                    }
                    InputProps={{
                      readOnly: true,
                      style: {
                        pointerEvents: 'auto',
                        borderRadius: '8px',
                      },
                      endAdornment: bill?.saleObject && (
                        <InputAdornment position="end">
                          <CustomIconButton
                            edge="end"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                bill?.saleObject?.id ?? 'Trống'
                              );
                              handleSnackbarAlert(
                                'success',
                                'Đã sao chép mã khuyến mãi vào clipboard!'
                              );
                            }}
                          >
                            <Tooltip title="Sao chép mã khuyến mãi vào clipboard">
                              <ContentCopyRoundedIcon fontSize="small" />
                            </Tooltip>
                          </CustomIconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Outlined_TextField
                    textStyle={textStyle}
                    label="Vận chuyển"
                    multiline
                    value={
                      bill?.deliveryObject
                        ? 'Mã vận chuyển: ' +
                          bill?.deliveryObject?.id +
                          '\nGhi chú cho shipper: ' +
                          (bill?.deliveryObject?.shipperNote !== ''
                            ? bill?.deliveryObject?.shipperNote
                            : 'Trống')
                        : 'Trống'
                    }
                    InputProps={{
                      readOnly: true,
                      style: {
                        pointerEvents: 'auto',
                        borderRadius: '8px',
                      },
                      endAdornment: bill?.deliveryObject && (
                        <InputAdornment position="end">
                          <CustomIconButton
                            edge="end"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                bill?.deliveryObject?.id ?? 'Trống'
                              );
                              handleSnackbarAlert(
                                'success',
                                'Đã sao chép mã vận chuyển vào clipboard!'
                              );
                            }}
                          >
                            <Tooltip title="Sao chép mã vận chuyển vào clipboard">
                              <ContentCopyRoundedIcon fontSize="small" />
                            </Tooltip>
                          </CustomIconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
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
                    <CustomIconButton>
                      <CloseIcon fontSize="small" />
                    </CustomIconButton>
                    <CustomIconButton>
                      <CloseIcon fontSize="small" />
                    </CustomIconButton>
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
                        value={bill?.deliveryObject?.name ?? 'Trống'}
                        InputProps={{
                          readOnly: true,
                          style: {
                            pointerEvents: 'auto',
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                      <Outlined_TextField
                        textStyle={textStyle}
                        label="Số điện thoại"
                        value={bill?.deliveryObject?.tel ?? 'Trống'}
                        InputProps={{
                          readOnly: true,
                          style: {
                            pointerEvents: 'auto',
                            borderRadius: '8px',
                          },
                        }}
                        type="tel"
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                      <Outlined_TextField
                        textStyle={textStyle}
                        label="Email"
                        value={bill?.deliveryObject?.email ?? 'Trống'}
                        InputProps={{
                          readOnly: true,
                          style: {
                            pointerEvents: 'auto',
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
                        value={bill?.deliveryObject?.address ?? 'Trống'}
                        InputProps={{
                          readOnly: true,
                          style: {
                            pointerEvents: 'auto',
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
                        value={dayjs(bill?.deliveryObject?.date ?? '')}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            InputProps: {
                              readOnly: true,
                              style: {
                                borderRadius: '8px',
                                pointerEvents: 'none',
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
                        select
                        label="Giờ muốn nhận"
                        value={formatDateString(
                          bill?.paymentTime ?? new Date()
                        )}
                        InputProps={{
                          readOnly: true,
                          style: {
                            pointerEvents: 'auto',
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                      <Outlined_TextField
                        textStyle={textStyle}
                        label="Trạng thái"
                        value={formatDateString(
                          bill?.paymentTime ?? new Date()
                        )}
                        InputProps={{
                          readOnly: true,
                          style: {
                            pointerEvents: 'auto',
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(MyModal);
