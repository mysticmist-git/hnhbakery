import banh1 from '@/assets/Carousel/3.jpg';
import { CustomButton } from '@/components/buttons';
import { storage } from '@/firebase/config';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import { ref } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useMemo, useState } from 'react';
import { useDownloadURL } from 'react-firebase-hooks/storage';

export default function CustomCardWithButton(props: any) {
  const theme = useTheme();

  const {
    imageHeight = '184px',
    imageWidth = '100%',
    descriptionHeight = '100px',
    cardInfo = {
      image: banh1.src,
      name: 'Bánh',
      description: 'Bánh ngon dữ lắm bà ơi',
      href: '#',
    },
    buttonOnclick = () => {},
  } = props;

  const imageStyles = useMemo(
    () => ({
      cardNormal: {
        width: '100%',
        height: imageHeight,
        transition: 'transform 0.3s ease-in-out',
        objectFit: 'cover',
      },
      cardHovered: {
        width: '100%',
        height: imageHeight,
        transition: 'transform 0.3s ease-in-out',
        transform: 'scale(1.5) rotate(5deg)',
        objectFit: 'cover',
      },
    }),
    [imageHeight]
  );

  const [cardHover, setCardHover] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const [image, imageLoading, imageError] = useDownloadURL(
    props.cardInfo.image ? ref(storage, props.cardInfo.image) : undefined
  );

  return (
    <Card
      onMouseOver={() => setCardHover(true)}
      onMouseOut={() => setCardHover(false)}
      raised={cardHover}
      sx={{ borderRadius: '16px', width: imageWidth }}
    >
      <CardActionArea
        LinkComponent={Link}
        href={`/product-detail?id=${cardInfo.id}`}
        sx={{ width: '100%', height: 'auto' }}
      >
        <Grid
          container
          direction={'row'}
          spacing={0}
          justifyContent={'center'}
          alignItems={'center'}
          width={'100%'}
          height={'auto'}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                height: imageHeight,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {imageLoading ? (
                <Skeleton
                  variant="rectangular"
                  width={'100%'}
                  height={imageHeight}
                />
              ) : (
                <Box
                  component={Image}
                  fill={true}
                  sx={
                    cardHover ? imageStyles.cardHovered : imageStyles.cardNormal
                  }
                  alt=""
                  src={image || ''}
                  loading="lazy"
                  onLoad={handleImageLoad}
                />
              )}
            </Box>
          </Grid>
          <Grid
            item
            sx={{ p: 2, pb: 0, bgcolor: theme.palette.common.white, zIndex: 1 }}
            xs={12}
          >
            <Typography
              gutterBottom
              variant="body1"
              color={theme.palette.common.black}
            >
              {cardInfo.name}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.text.secondary}
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                height: descriptionHeight,
                overflow: 'hidden',
              }}
            >
              {cardInfo.description}
            </Typography>
          </Grid>
        </Grid>
      </CardActionArea>
      <CardActions
        sx={{ p: 2, bgcolor: theme.palette.common.white, zIndex: 1 }}
      >
        <CustomButton sx={{ px: 2 }} onClick={buttonOnclick}>
          <Typography
            sx={{ color: theme.palette.common.white }}
            variant="button"
          >
            Thêm vào giỏ hàng
          </Typography>
        </CustomButton>
      </CardActions>
    </Card>
  );
}
