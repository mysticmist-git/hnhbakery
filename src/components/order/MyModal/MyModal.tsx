import { CustomButton, CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { isVNPhoneNumber, validateEmail } from '@/lib/utils';
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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { memo, useEffect, useRef, useState } from 'react';
import Outlined_TextField from './Outlined_TextField';
import SaleDelivery_Content from './SaleDelivery_Content';
import SanPham_Content from './SanPham_Content';
import ThongTin_Content from './ThongTin_Content';
import { BillTableRow } from '@/models/bill';
import Delivery, {
  deliveryStateColorParse,
  deliveryStateContentParse,
} from '@/models/delivery';
import { updateDelivery } from '@/lib/DAO/deliveryDAO';

type EditType = {
  name?: string;
  tel?: string;
  mail?: string;
  // address?: string;
  ship_date?: Date;
  ship_time?: string;
};

function ResetEditContent(bill: BillTableRow | null) {
  return {
    name: bill?.deliveryTableRow?.name ?? 'Trống',
    tel: bill?.deliveryTableRow?.tel ?? 'Trống',
    mail: bill?.deliveryTableRow?.mail ?? 'Trống',
    // address: bill?.deliveryTableRow?.address?.address ?? 'Trống',
    ship_date: bill?.deliveryTableRow?.ship_date ?? new Date(),
    ship_time: bill?.deliveryTableRow?.ship_time ?? 'Trống',
  };
}

const MyModal = ({
  open,
  handleClose,
  bill,
  handleBillDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  bill: BillTableRow | null;
  handleBillDataChange: (newBill: BillTableRow) => void;
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

  const [modalBill, setModalBill] = useState<BillTableRow | null>(bill);

  //#region Modal Chi tiết
  const clearData = () => {
    setModalBill(() => null);
    // setBillState(() => 0);
    setEditMode(() => false);
    setEditContent(() => null);
  };
  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState<EditType | null>(null);
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditContent(() => ResetEditContent(bill));
    handleSnackbarAlert('info', 'Đã hủy thay đổi.');
  };

  const handleSaveEdit = async () => {
    if (editContent?.mail && !validateEmail(editContent?.mail)) {
      handleSnackbarAlert('warning', 'Email thay đổi không hợp lệ.');
      return;
    }
    if (editContent?.tel && !isVNPhoneNumber(editContent?.tel)) {
      handleSnackbarAlert('warning', 'Số điện thoại thay đổi không hợp lệ.');
      return;
    }
    const delivery = { ...bill!.deliveryTableRow };
    delete delivery?.address;
    const data = {
      ...delivery,
      ...editContent,
    } as Delivery;
    await updateDelivery(data.id, data);

    handleSnackbarAlert('success', 'Thay đổi thành công!');
    setEditMode(false);

    const updatedDelivery: BillTableRow = {
      ...bill!,
      deliveryTableRow: {
        ...bill!.deliveryTableRow!,
        ...editContent,
      },
    };
    handleBillDataChange(updatedDelivery);
    handleClose();
  };
  //#endregion

  useEffect(() => {
    setModalBill(() => bill);
    setEditContent(() => ResetEditContent(bill));
  }, [bill, handleClose]);

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

          <Box component={'div'}>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <CloseIcon />
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
              {/* Thông tin */}
              <Grid item xs={12} md={6} lg={5} alignSelf={'stretch'}>
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

                    {modalBill?.deliveryTableRow?.state === 'issued' ? (
                      <Box
                        component={'div'}
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
                    ) : (
                      <></>
                    )}
                  </Box>

                  <Box
                    component={'div'}
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
                          value={editContent?.name}
                          onChange={(event: any) => {
                            if (editMode) {
                              setEditContent({
                                ...editContent,
                                name: event.target.value,
                              });
                            }
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
                          value={editContent?.tel}
                          onChange={(event: any) => {
                            if (editMode) {
                              setEditContent({
                                ...editContent,
                                tel: event.target.value,
                              });
                            }
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
                          value={editContent?.mail}
                          onChange={(event: any) => {
                            if (editMode) {
                              setEditContent({
                                ...editContent,
                                mail: event.target.value,
                              });
                            }
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
                          value={modalBill?.deliveryTableRow?.address?.address}
                          // onChange={(event: any) => {
                          //   setEditContent({
                          //     ...editContent,
                          //     address: event.target.value,
                          //   });
                          // }}
                          InputProps={{
                            readOnly: true,
                            style: {
                              pointerEvents: 'none',
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
                          value={dayjs(editContent?.ship_date)}
                          onChange={(day: any) => {
                            if (editMode) {
                              setEditContent({
                                ...editContent,
                                ship_date: new Date(day),
                              });
                            }
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
                          value={editContent?.ship_time}
                          onChange={(event: any) => {
                            if (editMode) {
                              setEditContent({
                                ...editContent,
                                ship_time: event.target.value,
                              });
                            }
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
                          value={deliveryStateContentParse(
                            modalBill?.deliveryTableRow?.state
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
                              color: deliveryStateColorParse(
                                theme,
                                modalBill?.deliveryTableRow?.state
                              ),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              {/* Danh sách sản phẩm */}
              <Grid item xs={12} md={12} lg={12} alignSelf={'stretch'}>
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
                  <SanPham_Content
                    textStyle={textStyle}
                    modalBill={modalBill}
                  />
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
