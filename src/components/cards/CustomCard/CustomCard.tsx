import banh1 from '@/assets/Carousel/3.jpg';
import {
  Box,
  Card,
  CardActionArea,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

export default function CustomCard(props: any) {
  const theme = useTheme();
  const {
    imageHeight = '184px',
    imageWidth = '100%',
    descriptionHeight = '100px',
    cardInfo = {
      image: banh1.src,
      name: 'Bánh ngọt',
      description: 'Bánh ngọt nhưng giảm cân!',
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
  return (
    <>
      <Card
        onMouseOver={() => setCardHover(true)}
        onMouseOut={() => setCardHover(false)}
        raised={cardHover}
        sx={{ borderRadius: '16px', width: imageWidth }}
      >
        <CardActionArea
          LinkComponent={Link}
          href={cardInfo.href}
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
                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width={'100%'}
                    height={imageHeight}
                  />
                ) : null}
                <Box
                  component={Image}
                  fill={true}
                  sx={
                    cardHover ? imageStyles.cardHovered : imageStyles.cardNormal
                  }
                  alt=""
                  src={cardInfo.image}
                  loading="lazy"
                  onLoad={handleImageLoad}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                p: 2,
                bgcolor: theme.palette.common.white,
              }}
              zIndex={1}
            >
              <Typography
                gutterBottom
                variant="h3"
                color={theme.palette.secondary.main}
                align="center"
              >
                {cardInfo.name}
              </Typography>
              <Typography
                component={'p'}
                variant="body2"
                color={theme.palette.text.secondary}
                align="center"
                sx={{
                  overflow: 'hidden',
                  height: descriptionHeight,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {cardInfo.description}
              </Typography>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
    </>
  );
}
