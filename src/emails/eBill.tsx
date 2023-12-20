import { BillTableRow, billStateContentParse } from '../models/bill';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { formatDateString } from '../lib/utils';
import BillAccordionContent_HTML from '../components/email/BillAccordionContent_HTML';
import {
  container,
  footer,
  hr,
  main,
  primaryColor,
  reportLink,
} from '../components/email/Style';
import { logoSrc } from '../components/email/Constant';
const sample: BillTableRow = {
  paid_time: new Date('2023-12-01T06:37:57.543Z'),
  created_at: new Date('2023-12-01T06:37:57.543Z'),
  total_price: 0,
  id: 'mn52HuUp4fw3u7mQp4QS',
  bookingItem: {
    occasion: 'Sinh nhật',
    size: 'NHỎ',
    note: '',
    images: [
      'bookingImages/mn52HuUp4fw3u7mQp4QS_0',
      'bookingImages/mn52HuUp4fw3u7mQp4QS_1',
      'bookingImages/mn52HuUp4fw3u7mQp4QS_2',
      'bookingImages/mn52HuUp4fw3u7mQp4QS_3',
    ],
    cake_base_id: '2',
    message: {
      color: '#F43545',
      content: 'dui',
    },
    id: 'UmiJ5XWO3XIz2EKOtITb',
    cakeBase: {
      id: '2',
      name: 'Cốt bánh chocolate',
      description: 'Cốt bánh chocolate thường đậm đà và có màu nâu sôcôla.',
      image: 'cakeBases/2.jpg',
    },
  },
  updated_at: new Date('2023-12-01T06:37:57.543Z'),
  delivery_id: 'V05cdsl4XOAwpzfa51kd',
  branch: {
    id: '1',
    created_at: new Date('2023-10-16T13:10:30.135Z'),
    group_id: 'vn01AtyWFcteKd4OJsCa',
    province_id: '4NLfSB5IRPv6JihoPVty',
    active: true,
    name: 'H&H Hà Nội',
    manager_id: 'Hhs5gXkm5jTPf44itD0y',
    updated_at: new Date('2023-10-16T13:10:42.863Z'),
    address: 'Số nhà 42, ngõ 17, đường Trần Duy Hưng, quận Cầu Giấy, Hà Nội.',
  },
  total_discount: 0,
  customer_id: '1LAnHa9LFNJ0EFExZR6q',
  branch_id: '1',
  booking_item_id: 'UmiJ5XWO3XIz2EKOtITb',
  payment_method_id: 'cash',
  note: '',
  sale_price: 0,
  sale_id: '',
  state: 'paid',
  final_price: 100000,
  paymentMethod: {
    id: 'cash',
    name: 'Tiền mặt',
    code: 'cash',
    active: true,
    image: 'paymentMethods/cash.jpg',
  },
  customer: {
    avatar: '',
    tel: '0343214971',
    mail: 'phantruonghuy0701@gmail.com',
    birth: new Date('1990-01-31T17:00:00.000Z'),
    group_id: 'default',
    type: 'google',
    uid: '3Kelzi2xkwRiknCpMHQCeQTZmFg2',
    active: true,
    name: 'Trường Huy Phan',
    created_at: new Date('2023-09-27T12:51:26.400Z'),
    updated_at: new Date('2023-09-27T12:51:26.400Z'),
    id: '1LAnHa9LFNJ0EFExZR6q',
  },
  deliveryTableRow: {
    created_at: new Date('2023-12-01T06:37:56.662Z'),
    end_at: new Date('2023-12-01T06:37:56.662Z'),
    name: 'Phan Trường Huy',
    updated_at: new Date('2023-12-01T06:37:56.662Z'),
    shipper_id: '',
    mail: 'phantruonghuy0701@gmail.com',
    start_at: new Date('2023-12-01T06:37:56.662Z'),
    tel: '0343214971',
    ship_date: new Date('2023-12-01T06:37:47.132Z'),
    state: 'delivered',
    id: 'V05cdsl4XOAwpzfa51kd',
    cancel_note: '',
    delivery_note: '',
    ship_time: 'Buổi sáng (07:30 - 11:30)',
    address: '195 Tân Lập, Đông Hoà, Thủ Đức, Bình Dương 700000, Việt Nam',
    image: '',
  },
  billItems: [],
};
export const E_Bill = ({
  bill = sample,
  withSale = true,
  withSanPham = true,
}: {
  bill?: BillTableRow;
  withSale?: boolean;
  withSanPham?: boolean;
}) => {
  const previewText = `Mã hóa đơn ${bill?.id}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Section style={main}>
          <Container style={container}>
            <Section>
              <Img src={`${logoSrc}`} width="72" height="100" alt="logo" />
            </Section>
            <Section>
              <Text
                style={{
                  fontSize: '42px',
                  color: primaryColor,
                  fontFamily: 'Great Vibes',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                Hóa đơn bán hàng
              </Text>
            </Section>
            <Section
              style={{
                position: 'relative',
                border: '1px solid',
                borderColor: 'black',
                boxShadow: 'none',
                backgroundColor: 'transparent',
                margin: '16px 0',
                borderRadius: '12px',
                padding: '16px 16px',
              }}
            >
              {/* Nội dung bill */}
              {bill && (
                <BillAccordionContent_HTML bill={bill} withSale withSanPham />
              )}

              {!bill && (
                <Text
                  style={{
                    fontSize: '24px',
                    color: primaryColor,
                    margin: '0 auto',
                    fontFamily: 'Roboto',
                  }}
                >
                  Lỗi hóa đơn
                </Text>
              )}
            </Section>

            <Hr style={hr} />

            <Section>
              <Row>
                <Text style={footer}>
                  H&H Bakery, Inc., Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh,
                  Việt Nam
                </Text>
                <Link href="/contact" style={reportLink}>
                  Report unsafe behavior
                </Link>
              </Row>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default E_Bill;
