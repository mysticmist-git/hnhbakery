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
} from '@/components/email/Style';
import { logoSrc } from '@/components/email/Constant';

export const E_Bill = ({
  bill,
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
