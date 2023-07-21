import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { AssembledBillDetail, SuperDetail_BillObject } from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import { InputAdornment, Tooltip, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Outlined_TextField from '../Outlined_TextField';

export default function SanPham_Content({
  textStyle,
  modalBill,
}: {
  textStyle: any;
  modalBill: SuperDetail_BillObject | null;
}) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const getLabel = (item: AssembledBillDetail): string => {
    const name = item?.productObject?.name ?? 'Trống';
    const variants = item?.productObject?.variants.find(
      (variant) => variant.id === item?.batchObject?.variant_id
    );
    return name + ' - ' + variants?.material + ' - Size: ' + variants?.size;
  };

  const getValue = (item: AssembledBillDetail): string => {
    const batch = item?.batchObject;

    var price: string = ' | ';
    price += formatPrice(item?.price - item?.discountAmount) + '/bánh';
    if (item?.discountAmount > 0) {
      price += ' (Giảm ' + item?.discount + '%/bánh)';
    }

    return (
      'Lô: ' +
      batch?.id +
      ' | Ngày sản xuất: ' +
      formatDateString(batch?.MFG ?? new Date()) +
      ' | Hạn sử dụng: ' +
      formatDateString(batch?.EXP ?? new Date()) +
      '\nSố lượng: ' +
      item?.amount +
      ' bánh' +
      price +
      '\nThành tiền: ' +
      formatPrice((item?.price - item?.discountAmount) * item?.amount)
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
        {modalBill?.billDetailObjects?.map((item, index) => {
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
                  endAdornment: modalBill?.deliveryObject && (
                    <InputAdornment position="end">
                      <CustomIconButton
                        edge="end"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            item?.batchObject?.id ?? 'Trống'
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
