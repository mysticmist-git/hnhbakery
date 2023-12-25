import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
import { formatDateString } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import { Box, Grid, InputAdornment, Tooltip } from '@mui/material';
import { CustomIconButton } from '../../buttons';
import { BillTableRow } from '@/models/bill';
import { BillItemTableRow } from '@/models/billItem';
import { BookingItemContent } from '@/components/profile/BookingItemContent';

export default function ChiTietDonHang_Content({
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
        {(!modalDelivery?.booking_item_id ||
          modalDelivery?.booking_item_id == '') &&
          modalDelivery?.billItems?.map((item, index) => {
            return (
              <Grid key={index} item xs={12} alignSelf={'stretch'}>
                <Outlined_TextField
                  textStyle={textStyle}
                  label={getLabel(item)}
                  multiline
                  value={getValue(item)}
                  InputProps={{
                    readOnly: true,
                    style: {
                      pointerEvents: 'auto',
                      borderRadius: '8px',
                    },
                    endAdornment: item?.batch?.id && (
                      <InputAdornment position="end">
                        <CustomIconButton
                          edge="end"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              item?.batch?.id ?? 'Trống'
                            );
                            handleSnackbarAlert(
                              'success',
                              'Đã sao chép mã lô hàng vào clipboard!'
                            );
                          }}
                        >
                          <Tooltip title="Sao chép mã lô hàng vào clipboard">
                            <ContentCopyRounded fontSize="small" />
                          </Tooltip>
                        </CustomIconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            );
          })}
        {modalDelivery?.booking_item_id != '' && modalDelivery?.bookingItem && (
          <Grid item xs={12} alignSelf={'stretch'}>
            <BookingItemContent item={modalDelivery.bookingItem} />
          </Grid>
        )}
      </Grid>
    </>
  );

  function getValue(item: BillItemTableRow | null) {
    if (!item) {
      return 'Trống';
    }

    var result = '';
    result += 'Mã lô bánh: ' + item.batch?.id;
    result += '\nMã sản phẩm: ' + item.product?.id;
    result += '\nSố lượng: ' + item.amount + ' bánh';
    result += '\nNgày sản xuất: ' + formatDateString(item.batch?.mfg);
    result += '\nNgày hết hạn: ' + formatDateString(item.batch?.exp);

    return result;
  }

  function getLabel(item: BillItemTableRow | null) {
    if (!item) {
      return 'Trống';
    }
    const variant = item?.variant;
    return (
      item?.product?.name +
      ' - ' +
      variant?.material +
      ' - Size: ' +
      variant?.size
    );
  }
}
