import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import BookingItem from '@/models/bookingItem';
import { SizeNameParse } from '@/models/size';
import { Box, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BoxStyle, TypoStyle } from '../../pages/profile';

export function BookingItemContent({ item }: { item: BookingItem }) {
  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const [cakeBaseSrc, setCakeBaseSrc] = useState<string>('');

  useEffect(() => {
    async function getImage() {
      if (item.images && item.images.length > 0) {
        try {
          await Promise.all(
            item.images.map(
              async (image) => await getDownloadUrlFromFirebaseStorage(image)
            )
          ).then((images) => {
            setImageSrc(images);
          });
        } catch (error: any) {
          console.log(error);
        }
      }

      if (item.cakeBase && item.cakeBase.image != '') {
        try {
          const image = await getDownloadUrlFromFirebaseStorage(
            item.cakeBase.image
          );
          setCakeBaseSrc(image);
        } catch (error: any) {
          console.log(error);
        }
      }
    }
    getImage();
  }, [item]);

  return (
    <Box
      component={'div'}
      sx={{
        backgroundColor: 'grey.200',
        border: 1,
        borderRadius: 3,
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        py: 3,
        pl: 2,
        pr: 4,
      }}
    >
      <Stack direction="column" spacing={1}>
        <Box
          component={'div'}
          sx={{ ...BoxStyle, display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Typography
            {...TypoStyle}
            sx={{
              width: '100%',
            }}
          >
            Hình ảnh sản phẩm:
          </Typography>

          <Grid container spacing={2}>
            {imageSrc.map((image, index) => (
              <Grid item xs={4} key={index}>
                <Box component={'div'}>
                  <Box
                    component={'img'}
                    src={image}
                    alt={`Hình ${index + 1}`}
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 0.8',
                      objectFit: 'contain',
                      borderRadius: 4,
                      backgroundColor: 'grey.400',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Nhân dịp:</Typography>

          <Typography {...TypoStyle}>
            {item.occasion == '' ? 'Trống' : item.occasion}
          </Typography>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Size:</Typography>

          <Typography {...TypoStyle}>{SizeNameParse(item.size)}</Typography>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Thông điệp:</Typography>

          <Typography {...TypoStyle}>
            {item.message.content == '' ? 'Trống' : item.message.content}
          </Typography>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Ghi chú:</Typography>

          <Typography {...TypoStyle}>
            {item.note == '' ? 'Trống' : item.note}
          </Typography>
        </Box>

        <Box
          component={'div'}
          sx={{ ...BoxStyle, display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Typography
            {...TypoStyle}
            sx={{
              width: '100%',
            }}
          >
            Cốt bánh:
          </Typography>

          <Grid container spacing={2} justifyContent={'center'}>
            <Grid item xs={5}>
              <Box
                component={'div'}
                sx={{
                  py: 1,
                  height: '100%',
                }}
              >
                <Box
                  component={'img'}
                  loading="lazy"
                  src={cakeBaseSrc}
                  alt={item.cakeBase?.name ?? 'Cốt bánh'}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 0.5',
                    objectFit: 'cover',
                    borderRadius: 4,
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={true}>
              <Stack
                direction="column"
                spacing={1}
                sx={{
                  py: 1,
                }}
              >
                <Typography variant="body1">
                  {item.cakeBase?.name ?? 'Cốt bánh'}
                </Typography>
                <Typography {...TypoStyle}>
                  {item.cakeBase?.description}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
