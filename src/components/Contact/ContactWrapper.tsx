import { Card, Container, Divider, Stack, Typography } from '@mui/material';
import contactImage from '@/assets/contact-img.jpg';
import Image from 'next/image';

export default function ContactWrapper({
  children,
  content,
}: {
  children?: React.ReactNode;
  content: string;
}) {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 8,
      }}
    >
      <Card
        sx={{
          width: 1000,
        }}
      >
        <Stack width={'100%'} overflow={'hidden'}>
          <Image
            src={contactImage}
            alt="Contact"
            style={{
              width: '100%',
              height: 250,
              objectFit: 'cover',
              objectPosition: '50% -160px',
            }}
          />

          <Divider
            sx={{
              color: (theme) => theme.palette.common.black,
            }}
          />

          <Stack p={4} rowGap={3} width={'100%'}>
            <Typography variant="h2">Liên hệ</Typography>
            <Divider
              sx={{
                color: (theme) => theme.palette.common.black,
              }}
            />
            <Typography variant="body2">
              Cảm ơn bạn đã ghé thăm trang web của tiệm bánh và sử dụng form
              đóng góp / liên hệ của chúng tôi. Chúng tôi rất trân trọng ý kiến
              đóng góp của bạn và sẽ liên hệ lại với bạn trong thời gian sớm
              nhất có thể. Xin cảm ơn!
            </Typography>
            <Divider
              sx={{
                color: (theme) => theme.palette.common.black,
              }}
            />
            {children}
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
