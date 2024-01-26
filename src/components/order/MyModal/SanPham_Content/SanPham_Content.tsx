import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';

import { BookingItemContent } from '@/components/profile/BookingItemContent';
import { formatDateString, formatPrice } from '@/lib/utils';
import { BillTableRow } from '@/models/bill';
import { BillItemTableRow } from '@/models/billItem';
import { ContentCopyRounded } from '@mui/icons-material';
import { Box, InputAdornment, Tooltip, useTheme } from '@mui/material';
import Outlined_TextField from '../Outlined_TextField';

export default function SanPham_Content({
  textStyle,
  modalBill,
}: {
  textStyle: any;
  modalBill: BillTableRow | null;
}) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const getLabel = (item: BillItemTableRow): string => {
    const name = item?.product?.name ?? 'Trống';
    const variants = item?.variant;
    return name + ' - ' + variants?.material + ' - Size: ' + variants?.size;
  };

  const getValue = (item: BillItemTableRow): string => {
    const batch = item?.batch;

    var price: string = ' | ';
    price +=
      formatPrice(item?.price - (item?.discount * item.price) / 100, ' đồng') +
      '/bánh';
    if (item?.total_discount > 0) {
      price += ' (Giảm ' + item?.discount + '%/bánh)';
    }

    return (
      'Lô: ' +
      batch?.id +
      ' | Ngày sản xuất: ' +
      formatDateString(batch?.mfg ?? new Date()) +
      ' | Hạn sử dụng: ' +
      formatDateString(batch?.exp ?? new Date()) +
      '\nSố lượng: ' +
      item?.amount +
      ' bánh' +
      price +
      '\nThành tiền: ' +
      formatPrice(item?.final_price, ' đồng')
    );
  };

  return (
    <>
      <Box
        component={'div'}
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
        {(!modalBill?.booking_item_id || modalBill?.booking_item_id == '') &&
          modalBill?.billItems?.map((item, index) => {
            return (
              <>
                <Outlined_TextField
                  key={index}
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
                    endAdornment: modalBill?.deliveryTableRow && (
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
              </>
            );
          })}

        {modalBill?.booking_item_id != '' && modalBill?.bookingItem && (
          <BookingItemContent item={modalBill.bookingItem} />
        )}
      </Box>
    </>
  );
}
