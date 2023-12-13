import React from 'react';
import { BillItemTableRow } from '../../models/billItem';
import { Column, Img, Row, Section, Text } from '@react-email/components';
import { alignRight, body1, head1 } from './Style';
import { SizeNameParse } from '../../models/size';
import { formatDateString, formatPrice } from '../../lib/utils';

function BillItemsContent_HTML({ item }: { item: BillItemTableRow }) {
  return (
    <Section
      style={{
        backgroundColor: '#eeeeee',
        border: '1px solid',
        borderRadius: '12px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '16px',
        marginTop: '16px',
      }}
    >
      <Row>
        <Img
          style={{
            width: '100%',
            height: '240px',
            objectFit: 'cover',
            borderRadius: '16px',
            backgroundColor: '#bdbdbd',
          }}
          src={item.product?.images[0]}
          alt={item.product?.name}
        />
      </Row>

      <Section>
        <Row>
          <Text style={{ ...head1 }}>{item.product?.name}</Text>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Size:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {SizeNameParse(item.variant?.size)}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Vật liệu:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {item.variant?.material}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Số lượng:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {item.amount ?? '0'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Ngày sản xuất:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatDateString(item.batch?.mfg) ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Ngày hết hạn:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatDateString(item.batch?.exp) ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Giá bán:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatPrice(item.price, ' đồng') + ' / sản phẩm' ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Giảm giá:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {` Giảm ${formatPrice(item.total_discount, ' đồng')} (${
              item.discount
            }%) / sản phẩm` ?? 'Trống'}
          </Column>
        </Row>

        <Row>
          <Column style={{ ...body1 }}>Thành tiền:</Column>
          <Column style={{ ...body1, ...alignRight }}>
            {formatPrice(item.final_price, ' đồng') ?? 'Trống'}
          </Column>
        </Row>
      </Section>
    </Section>
  );
}

export default BillItemsContent_HTML;
