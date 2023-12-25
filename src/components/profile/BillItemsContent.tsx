import promotionImage from '@/assets/promotion.png';
import { formatDateString, formatPrice } from '@/lib/utils';
import { BillItemTableRow } from '@/models/billItem';
import { SizeNameParse } from '@/models/size';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import { BoxStyle, TypoStyle } from '../../pages/profile';

export function BillItemsContent({ item }: { item: BillItemTableRow }) {
  const theme = useTheme();

  const [imageProduct, setImageProduct] = useState<string>('');
  useEffect(() => {
    async function getImage() {
      if (
        item.product &&
        item.product.images.length > 0 &&
        item.product.images[0] != ''
      ) {
        try {
          const image = await getDownloadUrlFromFirebaseStorage(
            item.product.images[0]
          );
          setImageProduct(image);
        } catch (error: any) {
          setImageProduct(promotionImage.src);
        }
      }
    }

    getImage();
  }, [item.product?.images[0]]);

  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
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
        <Grid container justifyContent={'center'} spacing={4}>
          <Grid item xs={4}>
            <Box
              component={'img'}
              loading="lazy"
              alt={item.product?.name ?? ''}
              src={imageProduct}
              sx={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                borderRadius: 3,
                background: 'red',
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Stack direction="column" spacing={1}>
              <Typography variant="body1">{item.product?.name}</Typography>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Size:</Typography>

                <Typography {...TypoStyle}>
                  {SizeNameParse(item.variant?.size)}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Vật liệu:</Typography>

                <Typography {...TypoStyle}>{item.variant?.material}</Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Số lượng:</Typography>

                <Typography {...TypoStyle}>{item.amount ?? '0'}</Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Ngày sản xuất:</Typography>

                <Typography {...TypoStyle}>
                  {formatDateString(item.batch?.mfg) ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Ngày hết hạn:</Typography>

                <Typography {...TypoStyle}>
                  {formatDateString(item.batch?.exp) ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Giá bán:</Typography>

                <Typography {...TypoStyle}>
                  {formatPrice(item.price, ' đồng') + ' / sản phẩm' ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Giảm giá:</Typography>

                <Typography {...TypoStyle}>
                  {` Giảm ${formatPrice(item.total_discount, ' đồng')} (${
                    item.discount
                  }%) / sản phẩm` ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Thành tiền:</Typography>

                <Typography {...TypoStyle}>
                  {formatPrice(item.final_price, ' đồng') ?? 'Trống'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
