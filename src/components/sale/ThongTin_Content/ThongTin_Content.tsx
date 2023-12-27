import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { getCustomerRank } from '@/lib/DAO/customerRankDAO';
import { updateSale } from '@/lib/DAO/saleDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { updateDocToFirestore } from '@/lib/firestore';
import { statusTextResolver } from '@/lib/manage/manage';
import { formatDateString, formatPrice } from '@/lib/utils';
import CustomerRank from '@/models/customerRank';
import Sale, { InitSale } from '@/models/sale';
import {
  Close,
  ContentCopyRounded,
  EditRounded,
  SaveAsRounded,
} from '@mui/icons-material';
import {
  Box,
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type EditType = {
  name?: string;
  end_at?: Date;
  description?: string;
};

function ResetEditContent(sale: Sale | null) {
  return {
    name: sale?.name ?? 'Trống',
    end_at: sale?.end_at ?? new Date(),
    description: sale?.description ?? 'Trống',
  };
}

export default function ThongTin_Content({
  textStyle,
  modalSale,
}: {
  textStyle: any;
  modalSale: Sale | null;
}) {
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
  const handleSnackbarAlert = useSnackbarService();

  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState<EditType | null>(
    ResetEditContent(modalSale)
  );

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditContent(() => ResetEditContent(modalSale));
    handleSnackbarAlert('info', 'Đã hủy thay đổi.');
  };

  const handleSaveEdit = async () => {
    if (
      new Date(editContent?.end_at ?? '') <= new Date(modalSale?.end_at ?? '')
    ) {
      handleSnackbarAlert('warning', 'Ngày kết thúc không hợp lệ.');
      return;
    }

    if (!modalSale) return;
    try {
      await updateSale(modalSale.id, modalSale);
      handleSnackbarAlert('success', 'Thay đổi thành công!');
      setEditMode(false);
    } catch (error) {
      console.log(error);
      handleSnackbarAlert('error', 'Đã có lỗi khi hay đổi!');
    }
  };

  function getGiaKhuyenMai(value: Sale | null) {
    const result =
      'Giảm ' +
      value?.percent +
      '% (Tối đa: ' +
      formatPrice(value?.limit) +
      ')';
    return result ?? 'Trống';
  }

  const [customerRank, setCustomerRank] = useState<CustomerRank | undefined>(
    undefined
  );

  useEffect(() => {
    setEditContent(() => ResetEditContent(modalSale));

    if (modalSale) {
      getCustomerRank(modalSale.minRankId).then((rank) => {
        setCustomerRank(rank);
      });
    }
  }, [modalSale]);

  return (
    <>
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
          <Typography variant="body2" color={theme.palette.common.white}>
            Thông tin cá nhân
          </Typography>

          {modalSale?.active && (
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
                  <EditRounded fontSize="small" color="primary" />
                </CustomIconButton>
              )}
              {editMode && (
                <>
                  <CustomIconButton onClick={handleSaveEdit}>
                    <SaveAsRounded fontSize="small" color="primary" />
                  </CustomIconButton>
                  <CustomIconButton onClick={handleCancelEdit}>
                    <Close fontSize="small" color="primary" />
                  </CustomIconButton>
                </>
              )}
            </Box>
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
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Mã quản lý khuyến mãi"
                value={modalSale?.id ?? 'Trống'}
                InputProps={{
                  readOnly: true,
                  style: {
                    pointerEvents: 'auto',
                    borderRadius: '8px',
                  },
                  endAdornment: modalSale?.id && (
                    <InputAdornment position="end">
                      <CustomIconButton
                        edge="end"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            modalSale?.id ?? 'Trống'
                          );
                          handleSnackbarAlert(
                            'success',
                            'Đã sao chép mã quản lý vào clipboard!'
                          );
                        }}
                      >
                        <Tooltip title="Sao chép mã quản lý vào clipboard">
                          <ContentCopyRounded fontSize="small" />
                        </Tooltip>
                      </CustomIconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={{
                  ...textStyle,
                  color: editMode
                    ? theme.palette.secondary.main
                    : theme.palette.common.black,
                }}
                label="Tên khuyến mãi"
                value={editContent?.name ?? 'Trống'}
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

            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Code khuyến mãi"
                value={modalSale?.code ?? 'Trống'}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={8} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={{
                  ...textStyle,
                  color: editMode
                    ? theme.palette.secondary.main
                    : theme.palette.common.black,
                }}
                label="Mô tả"
                value={editContent?.description ?? 'Trống'}
                onChange={(event: any) => {
                  setEditContent({
                    ...editContent,
                    description: event.target.value,
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

            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Giá khuyến mãi"
                value={getGiaKhuyenMai(modalSale) ?? 'Trống'}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Hóa đơn tối thiểu"
                value={formatPrice(modalSale?.minBillTotalPrice) ?? 'Trống'}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Bậc khách hàng tối thiểu"
                value={customerRank ? customerRank.name : 'Trống'}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Trạng thái"
                value={
                  modalSale
                    ? statusTextResolver(modalSale?.active ?? false) +
                      ' - ' +
                      (modalSale.public ? 'Công khai' : 'Không công khai')
                    : 'Trống'
                }
              />
            </Grid>

            <Grid item xs={12} md={6} lg={12} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Cho phép mỗi tài khoản sử dụng nhiều lần"
                value={
                  modalSale
                    ? modalSale.isDisposable
                      ? 'Không cho phép'
                      : 'Cho phép'
                    : 'Trống'
                }
              />
            </Grid>

            <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                label="Bắt đầu"
                value={
                  formatDateString(modalSale?.start_at, 'DD/MM/YYYY') ?? 'Trống'
                }
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
              <DatePicker
                label="Kết thúc"
                views={['day', 'month', 'year']}
                sx={{
                  width: '100%',
                  color: theme.palette.secondary.main,
                }}
                value={dayjs(editContent?.end_at)}
                onChange={(day: any) => {
                  setEditContent({
                    ...editContent,
                    end_at: new Date(day),
                  });
                }}
                minDate={dayjs(modalSale?.end_at)}
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
                        color: editMode
                          ? theme.palette.secondary.main
                          : theme.palette.common.black,
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
