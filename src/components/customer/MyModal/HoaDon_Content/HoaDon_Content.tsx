import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
import { billStatusParse } from '@/lib/manage/manage';
import { SuperDetail_BillObject, SuperDetail_UserObject } from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import {
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

export default function HoaDon_Content({
  textStyle,
  modalUser,
}: {
  textStyle: any;
  modalUser: SuperDetail_UserObject | null;
}) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const getValueFromBill = (bill: SuperDetail_BillObject) => {
    var result = '';
    result += 'Thời gian đặt: ' + formatDateString(bill.created_at) + ' | ';
    if (bill.note != '') {
      result += 'Ghi chú: ' + bill.note + ' | ';
    }
    if (bill.state == 1) {
      result +=
        'Thời gian thanh toán: ' + formatDateString(bill.paymentTime) + ' | ';
    }
    result += 'Tổng tiền: ' + formatPrice(bill.totalPrice) + '\n';
    result += 'Trạng thái hóa đơn: ' + billStatusParse(bill.state);

    return result;
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        {modalUser?.billObjects && modalUser?.billObjects?.length > 0 ? (
          modalUser?.billObjects.map((bill) => (
            <Grid item xs={12} alignSelf={'stretch'}>
              <Outlined_TextField
                textStyle={textStyle}
                multiline
                label={'Mã hóa đơn: ' + bill.id ?? 'Trống'}
                value={getValueFromBill(bill)}
                InputProps={{
                  readOnly: true,
                  style: {
                    pointerEvents: 'auto',
                    borderRadius: '8px',
                  },
                  endAdornment: bill.id && (
                    <InputAdornment position="end">
                      <CustomIconButton
                        edge="end"
                        onClick={() => {
                          navigator.clipboard.writeText(bill.id ?? 'Trống');
                          handleSnackbarAlert(
                            'success',
                            'Đã sao chép mã hóa đơn vào clipboard!'
                          );
                        }}
                      >
                        <Tooltip title="Sao chép mã hóa đơn vào clipboard">
                          <ContentCopyRounded fontSize="small" />
                        </Tooltip>
                      </CustomIconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} alignSelf={'stretch'}>
            <Typography
              align="center"
              variant="button"
              sx={{ color: theme.palette.common.black }}
            >
              Trống
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
