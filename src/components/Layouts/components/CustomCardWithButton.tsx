import React, { useContext, useMemo, useState } from 'react';
import banh1 from '../../../assets/Carousel/3.jpg';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { CustomButton } from '@/components/Inputs/Buttons';
import Image from 'next/image';

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
        transition: 'transform 0.25s ease-in-out',
        objectFit: 'cover',
      },
      cardHovered: {
        width: '100%',
        height: imageHeight,
        transition: 'transform 0.25s ease-in-out',
        transform: 'scale(1.5)',
        objectFit: 'cover',
      },
    }),
    [imageHeight],
  );

  const [cardHover, setCardHover] = useState(false);

  return (
    <Card
      onMouseOver={() => setCardHover(true)}
      onMouseOut={() => setCardHover(false)}
      raised={cardHover}
      sx={{ borderRadius: '16px', width: imageWidth }}
    >
      <CardActionArea
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
              <Box
                component={Image}
                fill={true}
                sx={
                  cardHover ? imageStyles.cardHovered : imageStyles.cardNormal
                }
                alt=""
                src={cardInfo.image}
                loading="lazy"
              />
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
        <CustomButton
          sx={{ px: 2 }}
          onClick={buttonOnclick}
          children={() => (
            <Typography
              sx={{ color: theme.palette.common.white }}
              variant="button"
            >
              Thêm vào giỏ hàng
            </Typography>
          )}
        />
      </CardActions>
    </Card>
  );
}
