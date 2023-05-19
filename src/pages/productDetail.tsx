import ImageBackground from '@/components/imageBackground';
import {
  Grid,
  Typography,
  useTheme,
  alpha,
  styled,
  Rating,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import banh1 from '../assets/Carousel/1.jpg';
import banh2 from '../assets/Carousel/2.jpg';
import banh3 from '../assets/Carousel/3.jpg';
import formatPrice from '@/utilities/formatCurrency';
import Carousel from 'react-material-ui-carousel';
import Link from 'next/link';
import Image from 'next/image';
import { CustomButton } from '@/components/Inputs/Buttons';
import theme from '@/styles/themes/lightTheme';

const product = {
  name: 'Bánh Croissant',

  type: 'Bánh mặn',
  state: {
    content: 'Còn hàng',
    color: 'success', // success | error
  },
  description:
    'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
  rating: 4.5,
  numReviews: 123,
  prices: {
    //Mỗi object trong sizes ứng với 1 button của phần chọn size
    min: 150000,
    max: 200000,
    items: {
      price1: { display: 150000, value: 150000, checked: false },
      price2: { display: 150000, value: 150000, checked: false },
      price3: { display: 150000, value: 150000, checked: false },
      price4: { display: 150000, value: 150000, checked: false },
    },
  },
  sizes: {
    //Mỗi object trong sizes ứng với 1 button của phần chọn size
    small: { display: 'Nhỏ', value: 'S', checked: false },
    medium: { display: 'Vừa', value: 'M', checked: false },
    large: { display: 'Lớn', value: 'L', checked: false },
  },
  materials: {
    //Mỗi object trong sizes ứng với 1 button của phần chọn size
    strawbery: { display: 'Mức dâu', value: 'strawbery', checked: false },
    coconut: { display: 'Mức dừa', value: 'coconut', checked: false },
    pineapple: { display: 'Mức thơm', value: 'pineapple', checked: false },
  },
  images: [
    {
      src: banh1.src,
      alt: '',
    },
    {
      src: banh2.src,
      alt: '',
    },
    {
      src: banh3.src,
      alt: '',
    },
  ],
};

function ProductCarousel(props: any) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  function handleChange(index: any) {
    setActiveIndex(index);
  }

  return (
    <Box
      sx={{
        position: 'relative',
        border: 3,
        borderColor: theme.palette.secondary.main,
        overflow: 'hidden',
        borderRadius: '8px',
      }}
    >
      <Carousel
        animation="fade"
        duration={700}
        interval={10000}
        indicators={false}
        index={activeIndex}
        onChange={handleChange}
      >
        {product.images.map((image, i) => (
          <Box
            key={i}
            sx={{
              height: '50vh',
              width: '100%',
            }}
          >
            <Box
              component={Image}
              fill={true}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                ':hover': {
                  transform: 'scale(1.3) rotate(5deg)',
                },
              }}
            />
          </Box>
        ))}
      </Carousel>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'auto',
          zIndex: 10,
        }}
      >
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'end'}
          spacing={1}
          sx={{
            pr: 1,
            pb: 1,
            background: `linear-gradient(to bottom, ${alpha(
              theme.palette.common.white,
              0,
            )}, ${alpha(theme.palette.common.white, 0.5)})`,
          }}
        >
          {product.images.map((image, i: number) => (
            <Grid key={i} item>
              <Box
                sx={{
                  height: i == activeIndex ? '9vh' : '6vh',
                  width: i == activeIndex ? '12vh' : '6vh',
                  borderColor:
                    i == activeIndex
                      ? theme.palette.common.white
                      : 'transparent',
                  opacity: i == activeIndex ? 1 : 0.5,
                  border: 3,
                  transition: 'all 0.5s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  ':hover': {
                    opacity: 1,
                  },
                }}
                onClick={() => handleChange(i)}
              >
                <Image
                  fill={true}
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  style={{
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function ProductRating({ rating, numReviews }: any) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating
        name="product-rating"
        value={rating}
        sx={{ color: theme.palette.secondary.main }}
        precision={0.5}
        max={5}
        readOnly
        size="small"
      />
      <Typography
        variant="button"
        sx={{
          ml: 1,
          color: theme.palette.secondary.main,
        }}
      >
        ({numReviews} lượt đánh giá)
      </Typography>
    </Box>
  );
}

function CheckboxButtonGroup({ object }: any) {
  const [buttons, setButtons] = useState(object);

  const handleClick = (choosingKey: string) => {
    const updatedButtons = { ...buttons };
    Object.keys(updatedButtons).forEach((key) => {
      if (key === choosingKey) {
        updatedButtons[key].checked = !updatedButtons[key].checked;
      } else {
        updatedButtons[key].checked = false;
      }
    });

    setButtons(updatedButtons);
  };

  const theme = useTheme();
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {Object.keys(buttons).map((key, i) => (
        <Grid key={i} item>
          <Button
            key={i}
            variant="contained"
            onClick={() => handleClick(key)}
            sx={{
              bgcolor: buttons[key].checked
                ? theme.palette.secondary.main
                : 'transparent',
              color: buttons[key].checked
                ? theme.palette.common.white
                : theme.palette.secondary.main,
              transition: 'opacity 0.2s',
              py: 1.5,
              px: 3,
              border: 3,
              borderColor: theme.palette.secondary.main,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.common.white,
              },
            }}
          >
            {typeof buttons[key].display === 'number'
              ? formatPrice(buttons[key].display)
              : buttons[key].display}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

function NumberInputWithButtons({ min, max }: any) {
  const [value, setValue] = useState(0);

  const handleAddClick = () => {
    if (value < max) {
      setValue((prevValue) => prevValue + 1);
    }
  };

  const handleMinusClick = () => {
    if (value > min) {
      setValue((prevValue) => prevValue - 1);
    }
  };

  const handleOnBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      spacing={1}
      alignItems={'center'}
    >
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        <CustomButton
          onClick={handleMinusClick}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: '8px',
          }}
          children={() => (
            <Typography variant="body1" color={theme.palette.common.white}>
              -
            </Typography>
          )}
        />
      </Grid>
      <Grid item>
        <TextField
          value={value}
          onBlur={handleOnBlur}
          onChange={(e) => setValue(Number(e.target.value))}
          type="number"
          variant="filled"
          hiddenLabel
          maxRows="1"
          sx={{
            '&:hover': {
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3,
              )}`,
            },
          }}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <Typography
                  variant="body1"
                  color={theme.palette.secondary.main}
                >
                  {'/' + max.toString()}
                </Typography>
              </InputAdornment>
            ),
          }}
          style={{
            border: `3px solid ${theme.palette.secondary.main}`,
            borderRadius: '8px',
            borderColor: theme.palette.secondary.main,
            borderStyle: 'solid',
            overflow: 'hidden',
          }}
          inputProps={{
            sx: {
              fontSize: theme.typography.body1.fontSize,
              color: theme.palette.common.black,
              fontWeight: theme.typography.body1.fontWeight,
              fontFamily: theme.typography.body1.fontFamily,
              padding: 1.5,
              backgroundColor: theme.palette.common.white,
            },
            min: min,
            max: max,
          }}
        />
      </Grid>
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        <CustomButton
          onClick={handleAddClick}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: '8px',
          }}
          children={() => (
            <Typography variant="body1" color={theme.palette.common.white}>
              +
            </Typography>
          )}
        />
      </Grid>
    </Grid>
  );
}

function ProductDetailInfo(props: any) {
  const theme = useTheme();
  return (
    <Grid
      container
      direction={'row'}
      justifyContent={'center'}
      alignItems={'start'}
      spacing={4}
    >
      <Grid item xs={12}>
        <ProductCarousel />
      </Grid>

      <Grid item xs={12} md={8} lg={6}>
        <Box
          sx={{
            border: 3,
            borderColor: theme.palette.secondary.main,
            borderRadius: '8px',
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography variant="h2" color={theme.palette.secondary.main}>
                {product.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <ProductRating
                rating={product.rating}
                numReviews={product.numReviews}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Giá tiền:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">
                    {formatPrice(product.prices.min) +
                      ' - ' +
                      formatPrice(product.prices.max)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Loại:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{product.type}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Trạng thái:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    variant="body1"
                    color={
                      product.state.color === 'success'
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  >
                    {product.state.content}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Mô tả:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{product.description}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <Box
          sx={{
            border: 3,
            borderColor: theme.palette.secondary.main,
            borderRadius: '8px',
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography variant="h2" color={theme.palette.secondary.main}>
                Phần bạn chọn
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Kích thước:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CheckboxButtonGroup object={product.sizes} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Vật liệu:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CheckboxButtonGroup object={product.materials} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Giá tiền:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CheckboxButtonGroup object={product.prices.items} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Số lượng:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <NumberInputWithButtons min={0} max={10} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default function productDetail() {
  const theme = useTheme();
  return (
    <>
      <Box>
        <ImageBackground
          children={() => (
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
              sx={{ px: 6 }}
            >
              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  spacing={2}
                >
                  <Grid item xs={12}>
                    <Link href="/products" style={{ textDecoration: 'none' }}>
                      <Typography
                        align="center"
                        variant="h3"
                        color={theme.palette.primary.main}
                        sx={{
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sản phẩm
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      align="center"
                      variant="h2"
                      color={theme.palette.primary.main}
                    >
                      Bánh Croissant
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        />

        <Box sx={{ px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={8}
            sx={{ pt: 8 }}
          >
            <Grid item xs={12}>
              <ProductDetailInfo />
            </Grid>

            <Grid item xs={12}></Grid>

            <Grid item xs={12}></Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
