import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { SuperDetail_BillObject } from '@/lib/models';
import { formatDateString } from '@/lib/utils';
import { InputAdornment, Tooltip, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { Outlined_TextField } from './Outlined_TextField';

export function ThongTin_Content({
  textStyle,
  modalBill,
}: {
  textStyle: any;
  modalBill: SuperDetail_BillObject | null;
}) {
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
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
          label="Người đặt"
          value={modalBill?.userObject?.name ?? 'GUEST'}
          textStyle={textStyle}
          InputProps={{
            readOnly: true,
            style: {
              pointerEvents: 'auto',
              borderRadius: '8px',
            },
            endAdornment: modalBill?.userObject && (
              <InputAdornment position="end">
                <CustomIconButton
                  edge="end"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      modalBill?.userObject?.id ?? 'GUEST'
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
            value={formatDateString(modalBill?.paymentTime ?? new Date())}
          />
          <Outlined_TextField
            textStyle={textStyle}
            label="Thanh toán qua"
            value={modalBill?.paymentObject?.name ?? 'Trống'}
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
