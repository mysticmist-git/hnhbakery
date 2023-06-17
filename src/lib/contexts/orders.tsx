import formatPrice from '@/lib/utilities/formatCurrency';
import { Card, Chip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { BillObject } from '../models/Bill';
import { BillDetailObject } from '../models/BillDetail';

export const billStatusParse = (state: number | undefined) => {
  switch (state) {
    case -1:
      return 'Hủy';
    case 0:
      return 'Chưa thanh toán';
    case 1:
      return 'Đã thanh toán';
    default:
      return 'Lỗi';
  }
};

export interface CustomBill extends BillObject {
  customerName?: string;
  customerTel?: string;
  customerAddress?: string;
  deliveryPrice?: number;
  salePercent?: number;
}
export interface AssembledBillDetail extends BillDetailObject {
  productName?: string;
  productTypeName?: string;
  material?: string;
  size?: string;
}

export const MyListItem = ({
  billDetail,
}: {
  billDetail: AssembledBillDetail;
}) => {
  return (
    <Card sx={{ padding: 1, width: '100%' }}>
      <Stack spacing={2}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack direction={'row'} spacing={1}>
            <Typography>{`${billDetail.productName} (${billDetail.productTypeName})`}</Typography>
            <Chip label={billDetail.material} />
            <Chip label={billDetail.size} />
          </Stack>
          <Typography>x {billDetail.amount}</Typography>
        </Stack>
        <Stack direction={'row'} spacing={1} justifyContent="end">
          <Typography
            sx={
              (billDetail.discountPrice ?? -1) <= 0
                ? {}
                : {
                    fontWeight: 'normal',
                    textDecoration: 'line-through',
                  }
            }
          >
            {formatPrice(billDetail.price ?? 0)}
          </Typography>
          {(billDetail.discountPrice ?? -1) > 0 && (
            <Typography>
              {formatPrice(billDetail.discountPrice ?? 0)}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
