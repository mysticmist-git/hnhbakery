import { formatDateString, formatPrice } from '../../lib/utils';
import { BillTableRow, billStateContentParse } from '../../models/bill';
import { deliveryStateContentParse } from '../../models/delivery';
import React, { CSSProperties } from 'react';
import BookingItemContent_HTML from './BookingItemContent_HTML';
import { Column, Hr, Img, Row, Section } from '@react-email/components';
import { hr, body1, alignRight, head1 } from './Style';
import { promotionSrc } from './Constant';
import BillItemsContent_HTML from './BillItemsContent_HTML';

function BillAccordionContent_HTML({
  bill,
  withSale = true,
  withSanPham = true,
}: {
  bill: BillTableRow;
  withSale?: boolean;
  withSanPham?: boolean;
}) {
  return (
    <Section>
      <Section>
        <Row style={head1}>Thông tin đơn hàng</Row>

        <Row>
          <Column style={{ ...body1 }}>Mã hóa đơn:</Column>
          <Column style={{ ...body1, ...alignRight }}>{bill.id}</Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Trạng thái:</Column>
          <Column
            style={{ ...body1, ...alignRight }}
            // Lỗi màu
          >
            {billStateContentParse(bill.state)}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Hình thức thanh toán:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {bill.paymentMethod?.name}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Thời gian thanh toán:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatDateString(bill.paid_time) ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Ghi chú:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {bill.note ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Tổng tiền:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatPrice(bill.total_price, ' đồng') ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Khuyến mãi:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {(bill.total_discount == 0 ? '' : '-') +
              formatPrice(bill.total_discount, ' đồng') ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Thành tiền:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatPrice(bill.final_price, ' đồng') ?? 'Trống'}
          </Column>
        </Row>
      </Section>

      <Hr style={hr} />

      <Section>
        <Row style={{ ...head1 }}>Thông tin vận chuyển</Row>
        <Row>
          <Column style={{ ...body1 }}>Người nhận:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {bill.deliveryTableRow?.name ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...body1 }}>Số điện thoại:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {bill.deliveryTableRow?.tel ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...body1 }}>Ngày đặt giao:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatDateString(bill.deliveryTableRow?.ship_date, 'DD/MM/YYYY') ??
              'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...body1 }}>Thời gian đặt giao:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {bill.deliveryTableRow?.ship_time ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...body1 }}>Địa chỉ giao hàng:</Column>
          <Column
            style={{
              ...body1,
              ...alignRight,
            }}
          >
            {bill.deliveryTableRow?.addressObject?.address ??
              bill.deliveryTableRow?.address ??
              'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...body1 }}>Ghi chú:</Column>
          <Column
            style={{
              ...body1,
              ...alignRight,
            }}
          >
            {bill.deliveryTableRow?.delivery_note ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...body1 }}>Trạng thái:</Column>
          <Column
            style={{
              ...body1,
              ...alignRight,
              fontWeight: '700',
              color: '#00A803',
            }}
            // Lỗi màu
          >
            {deliveryStateContentParse(bill.deliveryTableRow?.state) ?? 'Trống'}
          </Column>
        </Row>
      </Section>

      <Hr style={hr} />

      {bill.sale && withSale && (
        <Section
          style={{
            marginTop: '8px',
          }}
        >
          <Row style={{ ...head1 }}>Thông tin khuyến mãi</Row>

          <Row>
            <Img
              style={{
                objectFit: 'contain',
                height: '120px',
                width: '100%',
                margin: '0',
                marginTop: '8px',
              }}
              alt="promotion"
              src={promotionSrc}
            />
          </Row>
          <Row>
            <Column style={{ ...body1 }}>Tên khuyến mãi:</Column>
            <Column style={{ ...body1, ...alignRight }}>
              {bill.sale?.name ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...body1 }}>Chương trình giảm giá:</Column>
            <Column style={{ ...body1, ...alignRight }}>
              {`Giảm ${bill.sale?.percent ?? 0}%, tối đa ${formatPrice(
                bill.sale?.limit,
                ' đồng'
              )}` ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...body1 }}>Mã code:</Column>
            <Column
              style={{
                ...body1,
                ...alignRight,
                color: '#ff1744',
              }}
            >
              {bill.sale?.code ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...body1 }}>Thời gian áp dụng:</Column>
            <Column style={{ ...body1, ...alignRight }}>
              {formatDateString(bill.sale?.start_at) +
                ' - ' +
                formatDateString(bill.sale?.end_at) ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...body1 }}>Mô tả:</Column>
            <Column style={{ ...body1, ...alignRight }}>
              {bill.sale?.description ?? 'Trống'}
            </Column>
          </Row>
        </Section>
      )}

      {withSanPham && (
        <Section>
          <Row>
            <Column style={{ ...head1 }}>Danh sách sản phẩm</Column>
          </Row>

          {(!bill.booking_item_id || bill.booking_item_id == '') &&
            bill.billItems?.map((item, index) => (
              <BillItemsContent_HTML key={index} item={item} />
            ))}

          {bill.booking_item_id != '' && bill.bookingItem && (
            <BookingItemContent_HTML item={bill.bookingItem} />
          )}
        </Section>
      )}
    </Section>
  );
}

export default BillAccordionContent_HTML;
