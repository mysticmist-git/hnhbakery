import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { SuperDetail_BillObject } from '@/lib/models';
import { formatPrice } from '@/lib/utils';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { InputAdornment, Tooltip, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Outlined_TextField from '../Outlined_TextField';

export default function SaleDelivery_Content({
  textStyle,
  modalBill,
}: {
  textStyle: any;
  modalBill: SuperDetail_BillObject | null;
}) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

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
        <Outlined_TextField
          textStyle={textStyle}
          label="Khuyến mãi áp dụng"
          multiline
          value={
            modalBill?.saleObject
              ? modalBill?.saleObject?.name +
                ' | Mã code: ' +
                modalBill?.saleObject?.code +
                ' | Giảm ' +
                modalBill?.saleObject?.percent +
                '% (Tối đa ' +
                formatPrice(modalBill?.saleObject?.maxSalePrice ?? 0) +
                ')\nÁp dụng: ' +
                new Date(
                  modalBill?.saleObject?.start_at ?? new Date()
                ).toLocaleString('vi-VI', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }) +
                ' - ' +
                new Date(
                  modalBill?.saleObject?.end_at ?? new Date()
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
            endAdornment: modalBill?.saleObject && (
              <InputAdornment position="end">
                <CustomIconButton
                  edge="end"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      modalBill?.saleObject?.id ?? 'Trống'
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
            modalBill?.deliveryObject
              ? 'Mã vận chuyển: ' +
                modalBill?.deliveryObject?.id +
                '\nGhi chú cho shipper: ' +
                (modalBill?.deliveryObject?.shipperNote !== ''
                  ? modalBill?.deliveryObject?.shipperNote
                  : 'Trống')
              : 'Trống'
          }
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
                      modalBill?.deliveryObject?.id ?? 'Trống'
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
    </>
  );
}
