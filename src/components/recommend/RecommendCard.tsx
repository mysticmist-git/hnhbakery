import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  Stack,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { storage } from '@/firebase/config';
import { ref } from 'firebase/storage';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import { formatPrice } from '@/lib/utils';
import { RecommendCardType } from './useRecommendVariants';
import { cam, gradientReconmend, hong } from './RecommendDialog';

export function RecommendCard({ item }: { item: RecommendCardType }) {
  const [image, imageLoading, imageError] = useDownloadURL(
    item.images[0] ? ref(storage, item.images[0]) : undefined
  );

  const [hover, setHover] = React.useState(false);
  return (
    <Card
      sx={{
        borderRadius: '16px',
        width: '100%',
        height: '100%',
        transition: 'transform 0.2s ease-in-out',
        boxShadow: 3,
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardActionArea
        LinkComponent={Link}
        href={
          `/product-detail?type_id=${item.product_type_id}&id=${item.id}` ?? ''
        }
        sx={{ width: '100%', height: '164px' }}
      >
        <Box
          component={Image}
          fill={true}
          sx={{
            width: '100%',
            height: '100%',
            transition: 'transform 0.3s ease-in-out',
            objectFit: 'cover',
          }}
          alt=""
          src={image || ''}
          loading="lazy"
        />
      </CardActionArea>

      <CardActions
        sx={{
          p: 2,
          bgcolor: 'white',
          zIndex: 1,
        }}
      >
        <Stack direction="column" sx={{ width: '100%' }}>
          <Typography
            variant="body2"
            fontWeight={900}
            color="secondary"
            sx={{
              width: '100%',
            }}
          >
            {item.name}
          </Typography>

          <CustomStack
            title="Size"
            value={
              item.variant.size == 'vua'
                ? 'Vừa'
                : item.variant.size == 'nho'
                ? 'Nhỏ'
                : item.variant.size == 'lon'
                ? 'Lớn'
                : 'Khác'
            }
          />
          <CustomStack title="Vật liệu" value={item.variant.material} />

          <CustomStack title="Giá" value={formatPrice(item.variant.price)} />
          <Box
            component={'div'}
            sx={{
              mt: 2,
              position: 'relative',
              overflow: 'visible',
              lineHeight: 0,
            }}
          >
            <Box
              component={'div'}
              sx={{
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                bgcolor: 'grey.200',
                transition: 'all 0.2s ease-in-out',
                boxShadow: hover ? 3 : 0,
                border: 2,
                borderColor: 'secondary.main',
              }}
            >
              <Stack
                sx={{
                  width: `${item.matchPercent}%`,
                  background: gradientReconmend,
                  px: 1,
                  py: 0.7,
                }}
                direction="row"
                alignItems="center"
                justifyContent={'flex-end'}
              >
                <Typography variant="caption" fontWeight={900} color="white">
                  {item.matchPercent}%
                </Typography>
              </Stack>
            </Box>
            <Typography
              variant="caption"
              fontWeight={'bold'}
              color="secondary"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'translate(0, -50%) scale(0.8)',
                bgcolor: 'white',
                borderRadius: '100px',
                overflow: 'hidden',
                border: 2,
                borderColor: 'secondary.main',
                lineHeight: 1.6,
                px: 1.5,
              }}
            >
              Phù hợp
            </Typography>
          </Box>
        </Stack>
      </CardActions>
    </Card>
  );
}

function CustomStack({
  title,
  value,
  valueTypographyProps,
}: {
  title: string;
  value: string;
  valueTypographyProps?: TypographyProps;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      justifyContent={'space-between'}
    >
      <Typography
        variant="caption"
        sx={{
          width: '30%',
          textAlign: 'left',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        fontWeight={'bold'}
        {...valueTypographyProps}
        sx={{
          width: '70%',
          textAlign: 'right',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          ...valueTypographyProps?.sx,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
