import ImageBackground from '@/components/imageBackground';
import {
  Grid,
  Typography,
  useTheme,
  alpha,
  styled,
  Rating,
  Button,
  Pagination,
  useMediaQuery,
  Card,
  CardActionArea,
  Box,
} from '@mui/material';
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import formatPrice from '@/utilities/formatCurrency';
import Carousel from 'react-material-ui-carousel';
import Link from 'next/link';
import Image from 'next/image';
import { CustomButton } from '@/components/Inputs/Buttons';
import { CustomCard, CustomCardSlider } from '@/components/Layouts/components';
import banh1 from '../assets/Carousel/1.jpg';
import banh2 from '../assets/Carousel/2.jpg';
import banh3 from '../assets/Carousel/3.jpg';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  ProductDetailContext,
  ProductDetailContextType,
} from '@/lib/contexts/productDetail';
import { ProductObject } from '@/lib/models';
import Batch, { BatchObject } from '@/lib/models/Batch';
import { db } from '@/firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  getDocsFromQuerySnapshot,
  getDownloadUrlsFromFirebaseStorage,
} from '@/lib/firestore';
import { NumberInputWithButtons } from '../components/Inputs/NumberInputWithButtons';

//#region Đọc export default trước rồi hả lên đây!
function ProductCarousel(props: any) {
  const theme = useTheme();
  const context = useContext(ProductDetailContext);
  const { productState } = context;
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
        {productState.images.map((image: any, i: number) => (
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
          {productState.images.map((image: any, i: number) => (
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

function ProductRating({ rating, numReviews, size = 'small' }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const sizeProps = isSmallScreen ? { size: 'small' } : { size };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating
        value={rating}
        sx={{ color: theme.palette.secondary.main }}
        precision={0.5}
        max={5}
        readOnly
        {...sizeProps}
      />
      <Typography
        variant="button"
        sx={{
          ml: 1,
          color: theme.palette.secondary.main,
        }}
      >
        {numReviews ? `(${numReviews} lượt đánh giá)` : ''}
      </Typography>
    </Box>
  );
}

function CheckboxButtonGroup({ object, setObject }: any) {
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
    setObject(updatedButtons);
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
              py: { md: 1.5, xs: 0.5 },
              px: { md: 3, xs: 1 },
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
            {buttons[key].displayMore ? ` (${buttons[key].displayMore})` : ''}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

function ProductDetailInfo(props: any) {
  const theme = useTheme();
  const context = useContext(ProductDetailContext);
  const {
    productState,
    sizeState,
    setSizeState,
    materialState,
    setMaterialState,
    priceState,
    setPriceState,
  } = context;

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
                {productState.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <ProductRating
                rating={productState.comments.ratingAverage}
                numReviews={productState.comments.numReviews}
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
                    {formatPrice(productState.prices.min) +
                      ' - ' +
                      formatPrice(productState.prices.max)}
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
                  <Typography variant="body1">{productState.type}</Typography>
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
                      productState.state.color === 'success'
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  >
                    {productState.state.content}
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
                  <Typography variant="body1">
                    {productState.description}
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
                    Nguyên liệu:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">
                    {productState.ingredients}
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
                    Cách dùng:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">
                    {productState.howToUse}
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
                    Bảo quản:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">
                    {productState.preservation}
                  </Typography>
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
                  <CheckboxButtonGroup
                    object={sizeState}
                    setObject={setSizeState}
                  />
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
                  <CheckboxButtonGroup
                    object={materialState}
                    setObject={setMaterialState}
                  />
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
                  <CheckboxButtonGroup
                    object={priceState}
                    setObject={setPriceState}
                  />
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
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Box
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.9),
                      p: 1,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography
                      variant="button"
                      color={theme.palette.common.white}
                    >
                      Hạn sử dụng: 07/01/2023
                    </Typography>
                  </Box>
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
                  <NumberInputWithButtons
                    min={0}
                    max={productState.maxQuantity}
                  />
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
                <CustomButton
                  onClick={() => {}}
                  sx={{
                    py: 1.5,
                    width: '100%',
                    borderRadius: '8px',
                  }}
                  children={() => (
                    <Typography
                      variant="body1"
                      color={theme.palette.common.white}
                    >
                      Thêm vào giỏ hàng
                    </Typography>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

function Comments(props: any) {
  const theme = useTheme();
  const context = useContext(ProductDetailContext);
  const { productState, starState, setStarState } = context;
  const avatarHeight = '50px';
  return (
    <>
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        spacing={2}
      >
        <Grid item xs={12} md={8} lg={12}>
          <Typography
            variant="h2"
            align="center"
            color={theme.palette.secondary.main}
          >
            Đánh giá
          </Typography>
        </Grid>

        <Grid item xs={12} md={8} lg={12}>
          <Box
            sx={{
              bgcolor: theme.palette.primary.light,
              py: 3,
              px: 4,
              borderRadius: '8px',
            }}
          >
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              spacing={2}
            >
              <Grid item xs={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: { sm: 'row', xs: 'column' },
                    }}
                  >
                    <Typography
                      variant="body1"
                      color={theme.palette.secondary.main}
                    >
                      4.5
                    </Typography>
                    <Typography
                      sx={{ ml: { sm: 1, xs: 0 } }}
                      variant="body2"
                      color={theme.palette.secondary.main}
                    >
                      trên 5 sao
                    </Typography>
                  </Box>
                  <ProductRating
                    rating={productState.comments.ratingAverage}
                    size="large"
                  />
                </Box>
              </Grid>
              <Grid item xs={8}>
                <CheckboxButtonGroup
                  object={starState}
                  setObject={setStarState}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} lg={12}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
            sx={{
              px: 2,
            }}
          >
            {productState.comments.items.map((comment: any) => (
              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'center'}
                  alignItems={'start'}
                  spacing={2}
                >
                  <Grid item xs={'auto'}>
                    <Box
                      sx={{
                        borderRadius: '50%',
                        position: 'relative',
                        width: avatarHeight,
                        height: avatarHeight,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: theme.palette.secondary.main,
                      }}
                    >
                      <Box
                        component={Image}
                        src={comment.user.image}
                        alt={comment.user.name}
                        fill={true}
                        loading="lazy"
                        sx={{
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={true}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'normal',
                        }}
                        color={theme.palette.common.black}
                      >
                        {comment.user.name}
                      </Typography>
                      <ProductRating rating={comment.rating} />
                      <Typography
                        variant="button"
                        color={theme.palette.text.secondary}
                        mt={1}
                      >
                        {comment.time}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                        mt={1}
                      >
                        {comment.comment}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: theme.palette.text.secondary,
                      }}
                    ></Box>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={8} lg={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Pagination
              count={5}
              shape="rounded"
              boundaryCount={2}
              siblingCount={1}
              size="large"
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

//#endregion

//#region Giả dữ liệu
const initProduct = {
  id: 1,
  name: 'Bánh Croissant',
  type: 'Bánh mặn',
  state: {
    content: 'Còn hàng',
    color: 'success', // success | error
  },
  description:
    'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',

  ingredients: 'Bột mì, trứng, sữa, đường, muối',
  howToUse: 'Dùng ngay khi mở túi',
  preservation: 'Bảo quản ở nhiệt độ dưới 30 độ C',
  maxQuantity: 10,
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
  comments: {
    ratingAverage: 4.5,
    numReviews: 123,
    items: [
      {
        id: 1,
        rating: 5,
        comment: 'Ôi là trời',
        time: '12:00 20/01/2023',
        user: {
          id: 1,
          name: 'Nguyen Van A',
          image: banh1.src,
        },
      },
      {
        id: 2,
        rating: 5,
        comment: 'Ôi là trời, cứu mẹ',
        time: '09:00 20/01/2023',
        user: {
          id: 1,
          name: 'Nguyen Van B',
          image: banh2.src,
        },
      },
    ],
  },
  prices: {
    min: 150000,
    max: 200000,
    items: {
      //Mỗi object ứng với 1 button của phần chọn size
      price1: { display: 150000, value: 150000, checked: false },
      price2: { display: 150000, value: 150000, checked: false },
      price3: { display: 150000, value: 150000, checked: false },
      price4: { display: 150000, value: 150000, checked: false },
    },
  },
  sizes: {
    //Mỗi object ứng với 1 button của phần chọn size
    small: { display: 'Nhỏ', value: 'S', checked: false },
    medium: { display: 'Vừa', value: 'M', checked: false },
    large: { display: 'Lớn', value: 'L', checked: false },
  },
  materials: {
    //Mỗi object ứng với 1 button của phần chọn size
    strawbery: { display: 'Mức dâu', value: 'strawbery', checked: false },
    coconut: { display: 'Mức dừa', value: 'coconut', checked: false },
    pineapple: { display: 'Mức thơm', value: 'pineapple', checked: false },
  },
  similarProducts: [
    {
      id: 1,
      image: banh1.src,
      href: '#',
      name: 'Bánh Croissant',
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
    {
      id: 1,
      image: banh2.src,
      href: '#',
      name: '2',
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
    {
      id: 1,
      image: banh3.src,
      href: '#',
      name: '3',
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
    {
      id: 1,
      image: banh1.src,
      href: '#',
      name: '4',
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
  ],
};

const initStars = {
  // object này để hiển thị các nút sao
  all: { display: 'Tất cả', displayMore: 123, value: 'all', checked: true },
  five: { display: '5 sao', displayMore: 50, value: '5', checked: false },
  four: { display: '4 sao', displayMore: 50, value: '4', checked: false },
  three: { display: '3 sao', displayMore: 15, value: '3', checked: false },
  two: { display: '2 sao', displayMore: 5, value: '2', checked: false },
  one: { display: '1 sao', displayMore: 3, value: '1', checked: false },
};

//#endregion

const ProductDetail = ({ productDetail }: { productDetail: string }) => {
  const theme = useTheme();

  const [productState, setProductState] = useState(initProduct);
  const [sizeState, setSizeState] = useState(productState.sizes);
  const [materialState, setMaterialState] = useState(productState.materials);
  const [priceState, setPriceState] = useState(productState.prices.items);

  const [starState, setStarState] = useState(initStars);

  console.log(JSON.parse(productDetail));

  return (
    <>
      <ProductDetailContext.Provider
        value={{
          productState,
          sizeState,
          setSizeState,
          materialState,
          setMaterialState,
          priceState,
          setPriceState,
          starState,
          setStarState,
        }}
      >
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

              <Grid item xs={12}>
                <Comments />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ py: 8 }}>
            <CustomCardSlider
              duration={1000}
              imageHeight="184px"
              descriptionHeight="32px"
              CustomCard={CustomCard}
              title={'Sản phẩm tương tự'}
              productList={productState.similarProducts}
            />
          </Box>
        </Box>
      </ProductDetailContext.Provider>
    </>
  );
};

interface ProductDetail {
  id: string;
  name: string;
  productTypeName: string;
  stockAvailable: boolean;
  description: string;
  ingredients: string[];
  howToUse: string;
  preservation: string;
  images: string[];
  batches: BatchObject[];
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  if (!context.query.id)
    return {
      props: {
        invalid: true,
      },
    };

  // Get product
  const productId = context.query.id;

  const productRef = await getDoc(doc(db, `products/${productId}`));
  const product = { id: productRef.id, ...productRef.data() } as ProductObject;

  // Get product type
  const productTypeRef = await getDoc(
    doc(db, `productTypes/${product.productType_id}`),
  );

  const productTypeName = productTypeRef.data()?.name ?? 'Unknown';

  // Get batches
  const batchesQuery = query(
    collection(db, 'batches'),
    where('product_id', '==', productId),
  );
  const batchesSnapsshot = await getDocs(batchesQuery);
  const batches: BatchObject[] = getDocsFromQuerySnapshot(
    batchesSnapsshot,
  ) as BatchObject[];

  // Filter out batches that out of stock
  const filteredBatches = batches.filter(
    (batch) => batch.soldQuantity < batch.totalQuantity,
  );

  const stockAvailable = filteredBatches.length > 0;

  // Get product images
  const images = await getDownloadUrlsFromFirebaseStorage(product.images);

  const productDetail: ProductDetail = {
    id: product.id,
    name: product.name,
    productTypeName: productTypeName,
    stockAvailable: stockAvailable,
    description: product.description,
    ingredients: product.ingredients,
    howToUse: product.howToUse,
    preservation: product.preservation,
    images: images,
    batches: filteredBatches,
  };

  return {
    props: {
      productDetail: JSON.stringify(productDetail),
    },
  };
};

export default memo(ProductDetail);
