import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
import { formatPrice } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import { Grid, InputAdornment, Tooltip } from '@mui/material';
import { CustomIconButton } from '../../buttons';
import { BillTableRow } from '@/models/bill';

export default function DonHang_Content({
  textStyle,
  modalDelivery,
}: {
  textStyle: any;
  modalDelivery: BillTableRow | null;
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
            label="Mã đơn hàng"
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
                        'Đã sao chép mã đơn hàng vào clipboard!'
                      );
                    }}
                  >
                    <Tooltip title="Sao chép mã đơn hàng vào clipboard">
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
            label="Số tiền cần thu"
            value={getSoTienCanThu(modalDelivery) ?? 'Trống'}
          />
        </Grid>
      </Grid>
    </>
  );

  function getSoTienCanThu(modalDelivery: BillTableRow | null) {
    var result = 0;
    if (modalDelivery?.state === 'pending') {
      result = modalDelivery?.final_price ?? 0;
    }
    return formatPrice(result);
  }
}
