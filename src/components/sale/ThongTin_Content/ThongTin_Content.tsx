import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { updateDocToFirestore } from '@/lib/firestore';
import { statusTextResolver } from '@/lib/manage/manage';
import { SaleObject, SuperDetail_SaleObject } from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
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

function ResetEditContent(sale: SuperDetail_SaleObject | null) {
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
  modalSale: SuperDetail_SaleObject | null;
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

    const data = {
      id: modalSale?.id,
      name: editContent?.name,
      code: modalSale?.code,
      percent: modalSale?.percent,
      maxSalePrice: modalSale?.maxSalePrice,
      description: editContent?.description,
      start_at: modalSale?.start_at,
      end_at: editContent?.end_at,
      image: modalSale?.image,
      isActive: modalSale?.isActive,
    } as SaleObject;
    try {
      await updateDocToFirestore(data, COLLECTION_NAME.SALES);

      handleSnackbarAlert('success', 'Thay đổi thành công!');
      setEditMode(false);
    } catch (error) {
      console.log(error);
      handleSnackbarAlert('error', 'Đã có lỗi khi hay đổi!');
    }
  };

  function getGiaKhuyenMai(value: SuperDetail_SaleObject | null) {
    const result =
      'Giảm ' +
      value?.percent +
      '% (Tối đa: ' +
      formatPrice(value?.maxSalePrice) +
      ')';
    return result ?? 'Trống';
  }

  useEffect(() => {
    setEditContent(() => ResetEditContent(modalSale));
  }, [modalSale]);

  return (
    <>
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
          <Typography variant="body2" color={theme.palette.common.white}>
            Thông tin cá nhân
          </Typography>

          {modalSale?.isActive && (
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
                label="Bắt đầu"
                value={
                  formatDateString(modalSale?.start_at, 'DD/MM/YYYY') ?? 'Trống'
                }
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} alignSelf={'stretch'}>
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
                label="Trạng thái"
                value={
                  statusTextResolver(modalSale?.isActive ?? false) ?? 'Trống'
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
