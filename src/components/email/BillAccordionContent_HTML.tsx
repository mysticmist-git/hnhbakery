import { formatDateString, formatPrice } from '../../lib/utils';
import { BillTableRow, billStateContentParse } from '../../models/bill';
import { deliveryStateContentParse } from '../../models/delivery';
import React, { CSSProperties } from 'react';
import promotionImage from '../../assets/promotion.png';
import BookingItemContent_HTML from './BookingItemContent_HTML';
import { Column, Img, Row, Section } from '@react-email/components';

function BillAccordionContent_HTML({ bill }: { bill: BillTableRow }) {
  return (
    <Section>
      <Section>
        <Row
          style={{
            color: '#000000',
            fontSize: '16px',
            textTransform: 'none',
            fontFamily: 'Roboto',
            lineHeight: '1.75',
            fontWeight: '700',
          }}
        >
          Thông tin đơn hàng
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Mã hóa đơn:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {bill.id}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Trạng thái:</Column>
          <Column
            style={{ ...text_body, ...text_body_value }}
            // Lỗi màu
          >
            {billStateContentParse(bill.state)}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Hình thức thanh toán:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {bill.paymentMethod?.name}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Thời gian thanh toán:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {formatDateString(bill.paid_time) ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Ghi chú:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {bill.note ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Tổng tiền:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {formatPrice(bill.total_price, ' đồng') ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Khuyến mãi:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {(bill.total_discount == 0 ? '' : '-') +
              formatPrice(bill.total_discount, ' đồng') ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...text_body }}>Thành tiền:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {formatPrice(bill.final_price, ' đồng') ?? 'Trống'}
          </Column>
        </Row>
      </Section>

      <hr
        style={{
          color: '#000000',
          flexShrink: '0',
          borderWidth: '0',
          borderStyle: 'solid',
          borderColor: 'rgba(0, 0, 0, 0.12)',
          borderBottomWidth: 'thin',
          alignSelf: 'stretch',
          height: 'auto',
          margin: '0',
          marginTop: '8px',
        }}
      />

      <Section>
        <Row style={{ ...text_head }}>Thông tin vận chuyển</Row>
        <Row>
          <Column style={{ ...text_body }}>Người nhận:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {bill.deliveryTableRow?.name ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...text_body }}>Số điện thoại:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {bill.deliveryTableRow?.tel ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...text_body }}>Ngày đặt giao:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {formatDateString(bill.deliveryTableRow?.ship_date, 'DD/MM/YYYY') ??
              'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...text_body }}>Thời gian đặt giao:</Column>
          <Column style={{ ...text_body, ...text_body_value }}>
            {bill.deliveryTableRow?.ship_time ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...text_body }}>Địa chỉ giao hàng:</Column>
          <Column
            style={{
              ...text_body,
              ...text_body_value,
            }}
          >
            {bill.deliveryTableRow?.addressObject?.address ??
              bill.deliveryTableRow?.address ??
              'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...text_body }}>Ghi chú:</Column>
          <Column
            style={{
              ...text_body,
              ...text_body_value,
            }}
          >
            {bill.deliveryTableRow?.delivery_note ?? 'Trống'}
          </Column>
        </Row>
        <Row>
          <Column style={{ ...text_body }}>Trạng thái:</Column>
          <Column
            style={{
              ...text_body,
              ...text_body_value,
              fontWeight: '700',
              color: '#00A803',
            }}
            // Lỗi màu
          >
            {deliveryStateContentParse(bill.deliveryTableRow?.state) ?? 'Trống'}
          </Column>
        </Row>
      </Section>

      <hr
        style={{
          color: '#000000',
          flexShrink: '0',
          borderWidth: '0',
          borderStyle: 'solid',
          borderColor: 'rgba(0, 0, 0, 0.12)',
          borderBottomWidth: 'thin',
          alignSelf: 'stretch',
          height: 'auto',
          margin: '0',
          marginTop: '8px',
        }}
      />

      {bill.sale && (
        <Section
          style={{
            marginTop: '8px',
          }}
        >
          <Row
            style={{
              ...text_head,
            }}
          >
            Thông tin khuyến mãi
          </Row>

          <Row>
            <Img
              style={{
                objectFit: 'contain',
                height: '90px',
                width: '90px',
                margin: '0',
                marginTop: '8px',
              }}
              alt="promotion"
              src={promotionImage.src}
            />
          </Row>
          <Row>
            <Column style={{ ...text_body }}>Tên khuyến mãi:</Column>
            <Column style={{ ...text_body, ...text_body_value }}>
              {bill.sale?.name ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...text_body }}>Chương trình giảm giá:</Column>
            <Column style={{ ...text_body, ...text_body_value }}>
              {`Giảm ${bill.sale?.percent ?? 0}%, tối đa ${formatPrice(
                bill.sale?.limit,
                ' đồng'
              )}` ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...text_body }}>Mã code:</Column>
            <Column
              style={{
                ...text_body,
                ...text_body_value,
                color: '#ff1744',
              }}
            >
              {bill.sale?.code ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...text_body }}>Thời gian áp dụng:</Column>
            <Column style={{ ...text_body, ...text_body_value }}>
              {formatDateString(bill.sale?.start_at) +
                ' - ' +
                formatDateString(bill.sale?.end_at) ?? 'Trống'}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...text_body }}>Mô tả:</Column>
            <Column style={{ ...text_body, ...text_body_value }}>
              {bill.sale?.description ?? 'Trống'}
            </Column>
          </Row>
        </Section>
      )}

      <Section>
        <Row>
          <Column style={{ ...text_head }}>Danh sách sản phẩm</Column>
        </Row>

        {bill.booking_item_id != '' && bill.bookingItem && (
          <BookingItemContent_HTML item={bill.bookingItem} />
        )}
      </Section>
    </Section>
  );
}

export default BillAccordionContent_HTML;

export const text_body: CSSProperties = {
  textTransform: 'none',
  color: '#000000',
  fontFamily: 'Roboto',
  fontSize: '0.75rem',
  lineHeight: '1.66',
  fontWeight: '400',
};

export const text_body_value: CSSProperties = {
  textAlign: 'right',
};

export const text_head: CSSProperties = {
  color: '#000000',
  margin: '0',
  fontSize: '16px',
  textTransform: 'none',
  fontFamily: 'Roboto',
  lineHeight: '1.75',
  fontWeight: '700',
};
