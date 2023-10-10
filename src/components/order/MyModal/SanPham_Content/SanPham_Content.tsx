import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';

import { formatDateString, formatPrice } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import { InputAdornment, Tooltip, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Outlined_TextField from '../Outlined_TextField';
import { BillItemTableRow } from '@/models/billItem';
import { BillTableRow } from '@/models/bill';

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
      formatPrice(item?.price - (item?.discount * item.price) / 100) + '/bánh';
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
      formatPrice(item?.final_price)
    );
  };

  return (
    <>
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
        {modalBill?.billItems?.map((item, index) => {
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
      </Box>
    </>
  );
}
