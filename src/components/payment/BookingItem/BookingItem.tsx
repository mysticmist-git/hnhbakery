import { getCakeBaseById } from '@/lib/DAO/cakeBaseDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import BookingItemDisplay from '@/models/bookingItem';
import CakeBase from '@/models/cakeBase';
import {
  Box,
  Grid,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

function BookingItemDisplay({
  bookingItem,
  imageArray,
}: {
  bookingItem: BookingItemDisplay;
  imageArray: File[];
}) {
  const [cakeBaseData, setCakeBaseData] = useState<CakeBase | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetch() {
      if (!bookingItem.cake_base_id || bookingItem.cake_base_id === '') {
        return;
      }
      const data = await getCakeBaseById(bookingItem.cake_base_id);
      setCakeBaseData(data);
    }
    fetch();
  }, [bookingItem.cake_base_id]);

  return (
    <Stack {...StackProps} spacing={2}>
      <Stack {...StackProps}>
        <Typography {...TypoProps}>Hình ảnh</Typography>
        <Box component={'div'} sx={{ width: '100%' }}>
          <Grid
            container
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            gap={2}
            sx={{ width: '100%' }}
          >
            {imageArray.map((item, i) => (
              <Grid item xs={2} key={i} sx={{ width: '100%' }}>
                <Box
                  component="img"
                  src={URL.createObjectURL(item)}
                  alt={item.name}
                  sx={{
                    width: '100%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    overflow: 'hidden',
                    borderRadius: 4,
                    backgroundColor: 'grey.400',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      <Stack {...StackProps}>
        <Typography {...TypoProps}>Thông tin bánh</Typography>
        <Stack
          {...StackProps}
          sx={{
            width: '100%',
            p: 2,
            border: 1,
            borderColor: 'grey.500',
            borderRadius: 4,
          }}
        >
          <Typography {...TypoProps2}>
            Nhân dịp:{' ' + bookingItem.occasion}
          </Typography>

          <Typography {...TypoProps2}>
            Kích thước bánh:{' ' + bookingItem.size}
          </Typography>

          {cakeBaseData && (
            <Box
              component={'div'}
              sx={{
                width: '100%',
              }}
            >
              <Typography {...TypoProps2}>
                Cốt bánh: {' ' + cakeBaseData.name}
              </Typography>
              {/* <Box
                component={'div'}
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Box
                  component={'img'}
                  src={imageCakeBase}
                  sx={{
                    width: '124px',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    overflow: 'hidden',
                    borderRadius: 4,
                  }}
                />
                <Typography
                  {...TypoProps2}
                  sx={{
                    width: 'auto',
                    ml: 2,
                    maxWidth: '200px',
                  }}
                >
                  {cakeBaseData.description}
                </Typography>
              </Box> */}
            </Box>
          )}

          <Typography {...TypoProps2}>
            Thông điệp:{' ' + bookingItem.message.content}
          </Typography>

          <Typography {...TypoProps2}>
            Ghi chú:
            {' ' + (bookingItem.note == '' ? 'Trống' : bookingItem.note)}
          </Typography>
        </Stack>
      </Stack>

      <Stack {...StackProps}>
        <Typography {...TypoProps}>Lưu ý</Typography>
        <Typography
          variant="body1"
          fontStyle={'italic'}
          fontWeight={'bold'}
          sx={{
            color: 'secondary.main',
          }}
        >
          Để đảm bảo chất lượng dịch vụ và sản phẩm, các sản phẩm bánh đặt sẽ
          được nhân viên cửa hàng xác nhận với khách hàng thông qua
          <span style={{ textDecoration: 'underline' }}> số điện thoại </span>và
          phương thức thanh toán bắt buộc là
          <span style={{ textDecoration: 'underline' }}>
            {' '}
            `&quot;`Thanh toán trực tiếp khi nhận hàng`&quot;`{' '}
          </span>
          .
        </Typography>
      </Stack>
    </Stack>
  );
}

export default BookingItemDisplay;

const StackProps: StackProps = {
  direction: 'column',
  spacing: 1,
  sx: {
    width: '100%',
  },
};

const TypoProps: TypographyProps = {
  variant: 'body2',
  fontWeight: 'bold',
  sx: {
    color: 'grey.700',
    width: '100%',
  },
};

const TypoProps2: TypographyProps = {
  variant: 'body2',
  sx: {
    color: 'black',
    width: '100%',
  },
};
