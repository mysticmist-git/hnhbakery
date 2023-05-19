import {
  Card,
  Typography,
  Container,
  TextField,
  Stack,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import React, { memo } from 'react';
import contactImage from '@/assets/contact-img.jpg';
import Image from 'next/image';

const Contact = () => {
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
            <Grid container spacing={1}>
              <Grid item xs={5.9} gap={1} display={'flex'} direction={'column'}>
                <TextField
                  fullWidth
                  title="Họ và tên"
                  placeholder="Họ và tên"
                />
                <TextField
                  fullWidth
                  title="Số điện thoại"
                  placeholder="Số điện thoại"
                />
                <TextField fullWidth title="Email" placeholder="Email" />
              </Grid>
              <Grid item xs={0.2} justifyContent={'center'} display={'flex'}>
                <Divider
                  orientation="vertical"
                  sx={{
                    color: (theme) => theme.palette.common.black,
                  }}
                />
              </Grid>
              <Grid item xs={5.9} gap={1} display={'flex'} direction={'column'}>
                <TextField
                  fullWidth
                  title="Tựa đề"
                  placeholder="Tựa đề của bạn..."
                />
                <TextField
                  fullWidth
                  title="Nội dung"
                  placeholder="Nội dung liên hệ"
                  multiline
                  rows={5}
                />
                <Button color="secondary" variant="contained">
                  Gửi
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};

export default memo(Contact);
