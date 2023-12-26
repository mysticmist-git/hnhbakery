import promotionImage from '@/assets/promotion.png';
import { formatDateString, formatPrice } from '@/lib/utils';
import {
  BillTableRow,
  billStateColorParse,
  billStateContentParse,
} from '@/models/bill';
import {
  deliveryStateColorParse,
  deliveryStateContentParse,
} from '@/models/delivery';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { BookingItemContent } from './BookingItemContent';
import { BillItemsContent } from './BillItemsContent';
import { BoxStyle, TypoStyle } from '../../pages/profile';

export function BillAccordionContent({ bill }: { bill: BillTableRow }) {
  const theme = useTheme();
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item md={5} xs={12}>
          <Stack direction="column" spacing={1} divider={<Divider flexItem />}>
            <Box component={'div'}>
              <Stack direction="column" spacing={1}>
                <Typography variant="button" fontWeight={'bold'}>
                  Thông tin đơn hàng
                </Typography>
                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Mã hóa đơn:</Typography>

                  <Typography {...TypoStyle}>{bill.id ?? 'Trống'}</Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Trạng thái:</Typography>

                  <Typography
                    {...TypoStyle}
                    fontWeight={'bold'}
                    color={
                      billStateColorParse(theme, bill.state) ??
                      theme.palette.common.black
                    }
                  >
                    {billStateContentParse(bill.state)}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Hình thức thanh toán:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.paymentMethod?.name}
                  </Typography>
                </Box>

                {bill.state === 'paid' && (
                  <Box component={'div'} sx={BoxStyle}>
                    <Typography {...TypoStyle}>
                      Thời gian thanh toán:
                    </Typography>

                    <Typography {...TypoStyle}>
                      {formatDateString(bill.paid_time) ?? 'Trống'}
                    </Typography>
                  </Box>
                )}

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ghi chú:</Typography>

                  <Typography {...TypoStyle}>{bill.note ?? 'Trống'}</Typography>
                </Box>

                {bill.state != 'issued' && (
                  <>
                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Tổng tiền:</Typography>

                      <Typography {...TypoStyle}>
                        {formatPrice(bill.total_price, ' đồng') ?? 'Trống'}
                      </Typography>
                    </Box>

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Khuyến mãi:</Typography>

                      <Typography {...TypoStyle}>
                        {(bill.total_discount == 0 ? '' : '-') +
                          formatPrice(bill.sale_price, ' đồng') ?? 'Trống'}
                      </Typography>
                    </Box>

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Thành tiền:</Typography>

                      <Typography {...TypoStyle}>
                        {formatPrice(bill.final_price, ' đồng') ?? 'Trống'}
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Box>

            <Box component={'div'}>
              <Stack direction="column" spacing={1}>
                <Typography variant="button" fontWeight={'bold'}>
                  Thông tin vận chuyển
                </Typography>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Người nhận:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.name ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Số điện thoại:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.tel ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ngày đặt giao:</Typography>

                  <Typography {...TypoStyle}>
                    {formatDateString(
                      bill.deliveryTableRow?.ship_date,
                      'DD/MM/YYYY'
                    ) ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thời gian đặt giao:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.ship_time ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Địa chỉ giao hàng:</Typography>

                  <Typography {...TypoStyle} textAlign={'right'}>
                    {bill.deliveryTableRow?.addressObject?.address ??
                      bill.deliveryTableRow?.address ??
                      'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ghi chú:</Typography>

                  <Typography {...TypoStyle} textAlign={'right'}>
                    {bill.deliveryTableRow?.delivery_note ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Trạng thái:</Typography>

                  <Typography
                    {...TypoStyle}
                    color={
                      deliveryStateColorParse(
                        theme,
                        bill.deliveryTableRow?.state
                      ) ?? 'black'
                    }
                    fontWeight={'bold'}
                  >
                    {deliveryStateContentParse(bill.deliveryTableRow?.state) ??
                      'Trống'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {bill.sale && (
              <>
                <Box component={'div'}>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="button" fontWeight={'bold'}>
                      Thông tin khuyến mãi
                    </Typography>
                    <Box
                      component={'img'}
                      loading="lazy"
                      alt=""
                      src={promotionImage.src}
                      sx={{
                        objectFit: 'contain',
                        height: '90px',
                        aspectRatio: '1/1',
                      }}
                    />

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Mã code:</Typography>

                      <Typography
                        {...TypoStyle}
                        fontWeight={'bold'}
                        color={'error'}
                      >
                        {bill.sale?.code ?? 'Trống'}
                      </Typography>
                    </Box>

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Tên khuyến mãi:</Typography>

                      <Typography {...TypoStyle}>
                        {bill.sale?.name ?? 'Trống'}
                      </Typography>
                    </Box>

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>
                        Chương trình giảm giá:
                      </Typography>

                      <Typography {...TypoStyle}>
                        {`Giảm ${
                          bill.sale?.percent ?? 0
                        }%, tối đa ${formatPrice(bill.sale?.limit, ' đồng')}` ??
                          'Trống'}
                      </Typography>
                    </Box>

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Hóa đơn tối thiểu:</Typography>

                      <Typography {...TypoStyle}>
                        {`${formatPrice(
                          bill.sale?.minBillTotalPrice,
                          ' đồng'
                        )}` ?? 'Trống'}
                      </Typography>
                    </Box>

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Thời gian áp dụng:</Typography>

                      <Typography {...TypoStyle}>
                        {formatDateString(bill.sale?.start_at) +
                          ' - ' +
                          formatDateString(bill.sale?.end_at) ?? 'Trống'}
                      </Typography>
                    </Box>

                    <Box component={'div'} sx={BoxStyle}>
                      <Typography {...TypoStyle}>Mô tả:</Typography>

                      <Typography {...TypoStyle}>
                        {bill.sale?.description ?? 'Trống'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack direction="column" spacing={1}>
            <Typography variant="button" fontWeight={'bold'}>
              Danh sách sản phẩm
            </Typography>
            {(!bill.booking_item_id || bill.booking_item_id == '') &&
              bill.billItems?.map((item, index) => (
                <BillItemsContent key={index} item={item} />
              ))}

            {bill.booking_item_id != '' && bill.bookingItem && (
              <BookingItemContent item={bill.bookingItem} />
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
