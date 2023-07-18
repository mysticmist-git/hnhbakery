import { AssembledBillDetail, SuperDetail_DeliveryObject } from '@/lib/models';
import { useSnackbarService } from '@/lib/contexts';
import { Grid, InputAdornment, Tooltip } from '@mui/material';
import { Outlined_TextField } from '../order/MyModal/Outlined_TextField';
import { ContentCopyRounded } from '@mui/icons-material';
import { CustomIconButton } from '../buttons';
import { formatDateString } from '@/lib/utils';

export default function ChiTietDonHang_Content({
  textStyle,
  modalDelivery,
}: {
  textStyle: any;
  modalDelivery: SuperDetail_DeliveryObject | null;
}) {
  const handleSnackbarAlert = useSnackbarService();

  console.log(modalDelivery?.billDetailObjects);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        {modalDelivery?.billDetailObjects?.map((item, index) => {
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
                  endAdornment: item?.batchObject?.id && (
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
            </Grid>
          );
        })}
      </Grid>
    </>
  );

  function getValue(item: AssembledBillDetail | null) {
    if (!item) {
      return 'Trống';
    }

    var result = '';
    result += 'Mã lô bánh: ' + item.batchObject?.id;
    result += '\nMã sản phẩm: ' + item.productObject?.id;
    result += '\nSố lượng: ' + item.amount + ' bánh';
    result += '\nNgày sản xuất: ' + formatDateString(item.batchObject?.MFG);
    result += '\nNgày hết hạn: ' + formatDateString(item.batchObject?.EXP);

    return result;
  }

  function getLabel(item: AssembledBillDetail | null) {
    if (!item) {
      return 'Trống';
    }
    const variant = item?.productObject?.variants.find(
      (a) => a.id === item?.batchObject?.variant_id
    );
    return (
      item?.productObject?.name +
      ' - ' +
      variant?.material +
      ' - Size: ' +
      variant?.size
    );
  }
}
