import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';

import { formatDateString } from '@/lib/utils';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { InputAdornment, Tooltip, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Outlined_TextField from '../Outlined_TextField';
import { BillTableRow } from '@/models/bill';

export default function ThongTin_Content({
  textStyle,
  modalBill,
}: {
  textStyle: any;
  modalBill: BillTableRow | null;
}) {
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
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
        <Outlined_TextField
          label="Người đặt"
          value={modalBill?.customer?.name ?? 'GUEST'}
          textStyle={textStyle}
          InputProps={{
            readOnly: true,
            style: {
              pointerEvents: 'auto',
              borderRadius: '8px',
            },
            endAdornment: modalBill?.customer && (
              <InputAdornment position="end">
                <CustomIconButton
                  edge="end"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      modalBill?.customer?.id ?? 'GUEST'
                    );
                    handleSnackbarAlert(
                      'success',
                      'Đã sao chép mã người dùng vào clipboard!'
                    );
                  }}
                >
                  <Tooltip title="Sao chép mã người dùng vào clipboard">
                    <ContentCopyRoundedIcon fontSize="small" />
                  </Tooltip>
                </CustomIconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box
          component={'div'}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Outlined_TextField
            textStyle={textStyle}
            label="Thanh toán lúc"
            value={formatDateString(modalBill?.paid_time ?? new Date())}
          />
          <Outlined_TextField
            textStyle={textStyle}
            label="Thanh toán qua"
            value={modalBill?.paymentMethod?.name ?? 'Trống'}
          />
        </Box>

        <Outlined_TextField
          textStyle={textStyle}
          label="Ghi chú cho đơn hàng"
          multiline
          maxRows={2}
          InputProps={{
            readOnly: true,
            style: {
              pointerEvents: 'auto',
              borderRadius: '8px',
            },
          }}
          value={
            modalBill?.note && modalBill?.note !== ''
              ? modalBill?.note
              : 'Trống '
          }
        />
      </Box>
    </>
  );
}
