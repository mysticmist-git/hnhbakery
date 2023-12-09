import BookingItem from '../payment/BookingItem/BookingItem';
import { getDownloadUrlFromFirebaseStorage } from '../../lib/firestore';
import { SizeNameParse } from '../../models/size';
import { text_body, text_body_value } from './BillAccordionContent_HTML';
import { Column, Img, Row, Section, Text } from '@react-email/components';

function BookingItemContent_HTML({ item }: { item: BookingItem }) {
  return (
    <Section
      style={{
        backgroundColor: '#eeeeee',
        border: '1px solid',
        borderRadius: '12px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '16px',
        marginTop: '8px',
      }}
    >
      <Row>
        <Text style={{ ...text_body }}>Hình ảnh sản phẩm:</Text>
      </Row>

      <Row>
        {item.images?.map((image, index) => (
          <Column key={index}>
            <Img
              style={{
                width: '100%',
                aspectRatio: '1/0.8',
                objectFit: 'contain',
                borderRadius: '16px',
                backgroundColor: '#bdbdbd',
              }}
              src={image}
              alt={`Hình ${index + 1}`}
            />
          </Column>
        ))}
      </Row>
      <Row>
        <Column style={{ ...text_body }}>Nhân dịp:</Column>
        <Column style={{ ...text_body, ...text_body_value }}>
          {item.occasion == '' ? 'Trống' : item.occasion}
        </Column>
      </Row>
      <Row>
        <Column style={{ ...text_body }}>Size:</Column>
        <Column style={{ ...text_body, ...text_body_value }}>
          {SizeNameParse(item.size)}
        </Column>
      </Row>
      <Row>
        <Column style={{ ...text_body }}>Thông điệp:</Column>
        <Column style={{ ...text_body, ...text_body_value }}>
          {item.message.content == '' ? 'Trống' : item.message.content}
        </Column>
      </Row>
      <Row>
        <Column style={{ ...text_body }}>Ghi chú:</Column>
        <Column style={{ ...text_body, ...text_body_value }}>
          {item.note == '' ? 'Trống' : item.note}
        </Column>
      </Row>

      <Row>
        <Column style={{ ...text_body, width: '100%' }}>Cốt bánh:</Column>
      </Row>

      <Row>
        <Column
          style={{
            paddingRight: '16px',
            width: '40%',
          }}
        >
          <Img
            style={{
              width: '100%',
              aspectRatio: '1/0.5',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
            src={item.cakeBase?.image ?? ''}
            alt={item.cakeBase?.name ?? 'Cốt bánh'}
          />
        </Column>

        <Column
          style={{
            width: '60%',
          }}
        >
          <Row
            style={{
              color: '#000000',
              fontSize: '20px',
              fontWeight: '700',
              textTransform: 'none',
              fontFamily: 'Roboto',
              marginBottom: '8px',
            }}
          >
            {item.cakeBase?.name ?? 'Cốt bánh'}
          </Row>
          <Row style={{ ...text_body }}>{item.cakeBase?.description}</Row>
        </Column>
      </Row>
    </Section>
  );
}

export default BookingItemContent_HTML;
