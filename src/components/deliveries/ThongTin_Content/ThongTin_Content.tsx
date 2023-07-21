import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
import { deliveryStatusParse } from '@/lib/manage/manage';
import { SuperDetail_DeliveryObject } from '@/lib/models';
import { formatDateString } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import { Grid, InputAdornment, Tooltip } from '@mui/material';
import { CustomIconButton } from '../../buttons';

export default function ThongTin_Content({
  textStyle,
  modalDelivery,
}: {
  textStyle: any;
  modalDelivery: SuperDetail_DeliveryObject | null;
}) {
  const handleSnackbarAlert = useSnackbarService();

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Mã giao hàng"
            value={modalDelivery?.id ?? 'Trống'}
            InputProps={{
              readOnly: true,
              style: {
                pointerEvents: 'auto',
                borderRadius: '8px',
              },
              endAdornment: modalDelivery?.id && (
                <InputAdornment position="end">
                  <CustomIconButton
                    edge="end"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        modalDelivery?.id ?? 'Trống'
                      );
                      handleSnackbarAlert(
                        'success',
                        'Đã sao chép mã giao hàng vào clipboard!'
                      );
                    }}
                  >
                    <Tooltip title="Sao chép mã giao hàng vào clipboard">
                      <ContentCopyRounded fontSize="small" />
                    </Tooltip>
                  </CustomIconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Tên người nhận"
            value={modalDelivery?.name ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Số điện thoại người nhận"
            value={modalDelivery?.tel ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Email người nhận"
            value={modalDelivery?.email ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Thời gian giao hàng"
            value={getThoiGianGiao(modalDelivery) ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Trạng thái giao hàng"
            value={deliveryStatusParse(modalDelivery?.state) ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            multiline
            label="Địa chỉ giao hàng"
            value={modalDelivery?.address ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            multiline
            label="Ghi chú giao hàng"
            value={modalDelivery?.note ?? 'Trống'}
          />
        </Grid>
      </Grid>
    </>
  );

  function getThoiGianGiao(modalDelivery: SuperDetail_DeliveryObject | null) {
    if (!modalDelivery) {
      return 'Trống';
    }
    return (
      formatDateString(modalDelivery?.date, 'DD/MM/YYYY') +
      ' - ' +
      modalDelivery?.time
    );
  }
}
