import BookingItem from '../payment/BookingItem/BookingItem';
import { getDownloadUrlFromFirebaseStorage } from '../../lib/firestore';
import { SizeNameParse } from '../../models/size';
import { Column, Img, Row, Section, Text } from '@react-email/components';
import { body1, alignRight } from './Style';

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
        <Text style={{ ...body1 }}>Hình ảnh sản phẩm:</Text>
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
        <Column style={{ ...body1 }}>Nhân dịp:</Column>
        <Column style={{ ...body1, ...alignRight }}>
          {item.occasion == '' ? 'Trống' : item.occasion}
        </Column>
      </Row>
      <Row>
        <Column style={{ ...body1 }}>Size:</Column>
        <Column style={{ ...body1, ...alignRight }}>
          {SizeNameParse(item.size)}
        </Column>
      </Row>
      <Row>
        <Column style={{ ...body1 }}>Thông điệp:</Column>
        <Column style={{ ...body1, ...alignRight }}>
          {item.message.content == '' ? 'Trống' : item.message.content}
        </Column>
      </Row>
      <Row>
        <Column style={{ ...body1 }}>Ghi chú:</Column>
        <Column style={{ ...body1, ...alignRight }}>
          {item.note == '' ? 'Trống' : item.note}
        </Column>
      </Row>

      <Row>
        <Column style={{ ...body1, width: '100%' }}>Cốt bánh:</Column>
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
          <Row style={{ ...body1 }}>{item.cakeBase?.description}</Row>
        </Column>
      </Row>
    </Section>
  );
}

export default BookingItemContent_HTML;
