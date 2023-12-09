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
import logo from '../assets/Logo.png';

import { formatDateString } from '../lib/utils';
import BillAccordionContent_HTML from '../components/email/BillAccordionContent_HTML';

export const E_Bill = ({ bill }: { bill?: BillTableRow }) => {
  const previewText = `Mã hóa đơn ${bill?.id}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Section style={main}>
          <Container style={container}>
            <Section>
              <Img src={`${logo.src}`} width="36" height="50" alt="logo" />
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
              {bill && <BillAccordionContent_HTML bill={bill} />}

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
                <Link href="https://airbnb.com" style={reportLink}>
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

const primaryColor = '#810000';

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px 0',
  width: '800px',
};

const userImage = {
  margin: '0 auto',
  marginBottom: '16px',
  borderRadius: '50%',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
};

const review = {
  ...paragraph,
  padding: '24px',
  backgroundColor: '#f2f3f3',
  borderRadius: '4px',
};

const button = {
  backgroundColor: '#ff5a5f',
  borderRadius: '3px',
  color: '#000',
  fontSize: '18px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
};

const link = {
  ...paragraph,
  color: '#ff5a5f',
  display: 'block',
};

const reportLink = {
  fontSize: '14px',
  color: '#9ca299',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#9ca299',
  fontSize: '14px',
  marginBottom: '10px',
};
