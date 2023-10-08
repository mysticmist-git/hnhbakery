import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { formatPrice } from '@/lib/utils';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { InputAdornment, Tooltip, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Outlined_TextField from '../Outlined_TextField';
import { BillTableRow } from '@/models/bill';

export default function SaleDelivery_Content({
  textStyle,
  modalBill,
}: {
  textStyle: any;
  modalBill: BillTableRow | null;
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
            modalBill?.sale
              ? modalBill?.sale?.name +
                ' | Mã code: ' +
                modalBill?.sale?.code +
                ' | Giảm ' +
                modalBill?.sale?.percent +
                '% (Tối đa ' +
                formatPrice(modalBill?.sale?.limit ?? 0) +
                ')\nÁp dụng: ' +
                new Date(
                  modalBill?.sale?.start_at ?? new Date()
                ).toLocaleString('vi-VI', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }) +
                ' - ' +
                new Date(modalBill?.sale?.end_at ?? new Date()).toLocaleString(
                  'vi-VI',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }
                )
              : 'Không áp dụng'
          }
          InputProps={{
            readOnly: true,
            style: {
              pointerEvents: 'auto',
              borderRadius: '8px',
            },
            endAdornment: modalBill?.sale && (
              <InputAdornment position="end">
                <CustomIconButton
                  edge="end"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      modalBill?.sale?.id ?? 'Trống'
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
            modalBill?.deliveryTableRow
              ? 'Mã vận chuyển: ' +
                modalBill?.deliveryTableRow?.id +
                '\nGhi chú cho shipper: ' +
                (modalBill?.deliveryTableRow?.delivery_note !== ''
                  ? modalBill?.deliveryTableRow?.delivery_note
                  : 'Trống')
              : 'Trống'
          }
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
                      modalBill?.deliveryTableRow?.id ?? 'Trống'
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
