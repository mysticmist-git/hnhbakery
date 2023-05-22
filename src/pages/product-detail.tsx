import ImageBackground from '@/components/imageBackground';
import {
  Grid,
  Typography,
  useTheme,
  alpha,
  Rating,
  Button,
  Pagination,
  useMediaQuery,
  Box,
} from '@mui/material';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import formatPrice from '@/utilities/formatCurrency';
import Carousel from 'react-material-ui-carousel';
import Link from 'next/link';
import Image from 'next/image';
import { CustomButton } from '@/components/Inputs/Buttons';
import { CustomCard, CustomCardSlider } from '@/components/Layouts/components';
import banh1 from '../assets/Carousel/1.jpg';
import banh2 from '../assets/Carousel/2.jpg';
import banh3 from '../assets/Carousel/3.jpg';
import { GetServerSidePropsContext } from 'next';
import {
  CartItem,
  ProductDetail,
  ProductDetailContext,
  ProductDetailContextType,
} from '@/lib/contexts/productDetail';
import { ProductObject } from '@/lib/models';
import { BatchObject } from '@/lib/models/Batch';
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
import { useSnackbarService } from '@/lib/contexts';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { LOCAL_CART_KEY } from '@/lib';

// Mock Data

const comments = {
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
};

const similiarProducts = [
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
];

// #region Đọc export default trước rồi hả lên đây!

function ProductCarousel(props: any) {
  const theme = useTheme();
  const context = useContext(ProductDetailContext);
  const { productDetail } = context;
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
        {productDetail.images.map((image: any, i: number) => (
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
          {productDetail.images.map((image: any, i: number) => (
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

function CheckboxButtonGroup({
  options,
  value: paramValue,
  onChange,
}: {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState<string>(paramValue ?? options[0]);

  const handleClick = (newValue: string) => {
    if (newValue && newValue !== '') setValue(() => newValue);
  };

  const theme = useTheme();

  useEffect(() => {
    console.log(value);

    if (onChange) onChange(value);
  }, [value]);

  console.log(options);

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {options.map((key, i) => (
        <Grid key={i} item>
          <Button
            key={i}
            variant="contained"
            onClick={() => handleClick(key)}
            sx={{
              bgcolor:
                key === value ? theme.palette.secondary.main : 'transparent',
              color:
                key === value
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
            {Boolean(parseInt(key)) ? formatPrice(parseInt(key)) : key}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

function Comments(props: any) {
  const theme = useTheme();
  const context = useContext(ProductDetailContext);
  const { productDetail } = context;
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
                  <ProductRating rating={comments.ratingAverage} size="large" />
                </Box>
              </Grid>
              <Grid item xs={8}>
                {/* <CheckboxButtonGroup
                  object={starState}
                  setObject={setStarState}
                /> */}
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
            {comments.items.map((comment: any) => (
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

const SUCCESS_ADD_CART_MSG = 'Sản phẩm đã được thêm vào giỏ hàng.';
const FAIL_ADD_CART_MSG = 'Thêm sản phẩm vào giỏ hàng thất bại.';
const INVALID_DATA_MSG = 'Thông tin đặt hàng không hợp lệ';

interface CartItemAddingResult {
  isSuccess: boolean;
  msg: string;
}

const ProductDetailInfo = withAuthUser()((props: any) => {
  // #region Hooks

  const theme = useTheme();
  const { productDetail, form, setForm } =
    useContext<ProductDetailContextType>(ProductDetailContext);
  const { id: userId } = useAuthUser();
  const router = useRouter();

  const handleSnackbarAlert = useSnackbarService();

  // #endregion

  // #region useMemos

  const sizeOptions = useMemo(() => {
    const sizes = productDetail.batches.map((batch) => batch.size);
    const uniqueSizes = sizes.filter((size, i, arr) => arr.indexOf(size) === i);

    return uniqueSizes;
  }, [productDetail]);

  const materialOptions = useMemo(() => {
    console.log(form.size);

    console.log(productDetail.batches);

    const newMaterials = productDetail.batches
      .filter((batch) => batch.size === form.size)
      .map((batch) => batch.material);

    const uniqueMaterials = newMaterials.filter(
      (material, i, arr) => arr.indexOf(material) === i,
    );

    setForm((prev: any) => ({ ...prev, material: uniqueMaterials[0] }));

    console.log(form);

    return uniqueMaterials;
  }, [form.size]);

  const { price, discountPrice } = useMemo(() => {
    const selectedBatch = productDetail.batches
      .filter((batch) => batch.size === form.size)
      .filter((batch) => batch.material === form.material);

    const price = selectedBatch.map((batch) => batch.price)[0];

    const _discountInfo = selectedBatch
      .map((batch) => ({
        discountDate: batch.discountDate,
        percent: batch.discountPercent,
      }))
      .filter(
        (batch) =>
          new Date(batch.discountDate).getTime() < new Date().getTime(),
      )[0];

    return {
      price: price,
      discountPrice: _discountInfo?.percent
        ? parseFloat(price.toString()) -
          (parseFloat(price.toString()) * _discountInfo.percent) / 100
        : -1,
    };
  }, [form.material, form.size]);

  const maxQuantity = useMemo(() => {
    return productDetail.batches
      .filter((batch) => batch.size === form.size)
      .filter((batch) => batch.material === form.material)
      .map((batch) => batch.totalQuantity - batch.soldQuantity)[0];
  }, [form.material]);

  const expireDate = useMemo(() => {
    const exps = productDetail.batches
      .filter((batch) => batch.size === form.size)
      .filter((batch) => batch.material === form.material)
      .map((batch) => batch.EXP)[0];

    if (exps) {
      return new Date(exps).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    return 'Vui lòng điền các lựa chọn';
  }, [form.material]);

  const priceRange = useMemo(() => {
    const minPrice = Math.min(
      ...productDetail.batches.map((batch) => batch.price),
    );
    const maxPrice = Math.max(
      ...productDetail.batches.map((batch) => batch.price),
    );

    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    } else {
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
  }, [productDetail]);

  // #endregion

  // #region Handlers

  const handleAddProductToCart = async () => {
    const data = createDataFromForm();

    console.log(data);

    const isValid = validateData(data);

    if (!isValid) {
      handleSnackbarAlert('error', INVALID_DATA_MSG);
      return;
    }

    // TODO: make this strong type
    const result: CartItemAddingResult = await addProductToCart(data);

    if (result.isSuccess) {
      handleSnackbarAlert('success', result.msg);
    } else {
      handleSnackbarAlert('error', result.msg);
    }
  };

  // #endregion

  // #region Methods

  const createDataFromForm = (): CartItem => {
    const batchId = getBatchIdFromForm();

    return {
      id: nanoid(),
      userId: userId,
      batchId: batchId,
      productId: productDetail.id,
      href: `/product-detail?id=${productDetail.id}`,
      quantity: form.quantity,
      price: price,
      discountPrice: discountPrice,
    } as CartItem;
  };
  const getBatchIdFromForm = () => {
    const batchId = productDetail.batches
      .filter((batch) => batch.size === form.size)
      .filter((batch) => batch.material === form.material)[0].id;

    return batchId;
  };

  // TODO: make this strong type
  const validateData = (data: CartItem): boolean => {
    if (!data) return false;

    if (
      !data.batchId ||
      !data.productId ||
      data.quantity <= 0 ||
      data.price < 0
    )
      return false;

    return true;
  };

  // TODO: make this strong type
  const addProductToCart = async (
    data: CartItem,
  ): Promise<CartItemAddingResult> => {
    const localResult = addProductToLocalCart(data);

    if (!localResult.isSuccess) {
      return {
        isSuccess: false,
        msg: FAIL_ADD_CART_MSG,
      };
    }

    const firestoreResult = await addProductToFirestoreCart(data);

    if (!firestoreResult.isSuccess) {
      return {
        isSuccess: false,
        msg: FAIL_ADD_CART_MSG,
      };
    }

    redirectToCartPage();

    return {
      isSuccess: true,
      msg: SUCCESS_ADD_CART_MSG,
    };
  };

  // TODO: Finish this: addProductToLocalCart
  const addProductToLocalCart = (data: CartItem) => {
    const currentLocalCart = localStorage.getItem(LOCAL_CART_KEY);
    try {
      if (!currentLocalCart) {
        const firstCartItem = JSON.stringify([data]);
        localStorage.setItem(LOCAL_CART_KEY, firstCartItem);
      } else {
        const currentCart = JSON.parse(currentLocalCart);
        const updatedCart = [...currentCart, data];
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updatedCart));
      }

      return {
        isSuccess: true,
        msg: 'Thêm vào giỏ local thành công',
      };
    } catch (error) {
      console.log(error);
      return {
        isSuccess: false,
        msg: FAIL_ADD_CART_MSG,
      };
    }
  };

  const addProductToFirestoreCart = (data: CartItem) => {
    return {
      isSuccess: true,
      msg: 'Thêm vào giỏ firestore thành công',
    };
  };

  const redirectToCartPage = () => {
    router.push('/cart');
  };
  // #endregion

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
                {productDetail.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <ProductRating
                rating={comments.ratingAverage}
                numReviews={comments.numReviews}
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
                  <Typography variant="body1">{priceRange}</Typography>
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
                  <Typography variant="body1">{productDetail.type}</Typography>
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
                      productDetail.state === true
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  >
                    {productDetail.state ? 'Còn hàng' : 'Không còn hàng'}
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
                    {productDetail.description}
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
                    {productDetail.ingredients.join(', ')}
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
                    {productDetail.howToUse}
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
                    {productDetail.preservation}
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
                    options={sizeOptions}
                    value={form.size}
                    onChange={(value) =>
                      setForm((prev: any) => ({ ...prev, size: value }))
                    }
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
                    options={materialOptions}
                    value={form.material}
                    onChange={(value) =>
                      setForm((prev: any) => ({ ...prev, material: value }))
                    }
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'start',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: discountPrice >= 0 ? 'normal' : 'bold',
                        textDecoration:
                          discountPrice >= 0 ? 'line-through' : 'none',
                        opacity: discountPrice >= 0 ? 0.5 : 1,
                      }}
                    >
                      {formatPrice(price)}
                    </Typography>
                    {discountPrice >= 0 && (
                      <Typography variant="body1" sx={{}}>
                        {formatPrice(discountPrice)}
                      </Typography>
                    )}
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
                      {`Hạn sử dụng: ${expireDate}`}
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
                  {maxQuantity && (
                    <NumberInputWithButtons
                      min={0}
                      max={maxQuantity}
                      value={form.quantity}
                      onChange={(value: number) => {
                        setForm((prev: any) => ({ ...prev, quantity: value }));
                      }}
                    />
                  )}
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
                  onClick={handleAddProductToCart}
                  sx={{
                    py: 1.5,
                    width: '100%',
                    borderRadius: '8px',
                  }}
                >
                  <Typography
                    variant="body1"
                    color={theme.palette.common.white}
                  >
                    Thêm vào giỏ hàng
                  </Typography>
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
});

// #endregion

//#region Giả dữ liệu
const initProduct = {
  id: 1,
  name: 'Bánh Croissant',
  type: 'Bánh mặn',
  state: true,
  description:
    'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',

  ingredients: 'Bột mì, trứng, sữa, đường, muối',
  howToUse: 'Dùng ngay khi mở túi',
  preservation: 'Bảo quản ở nhiệt độ dưới 30 độ C',
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
  prices: [25000, 35000, 100000],
  sizes: ['nhỏ', 'vừa', 'lớn'],
  materials: ['Mức dâu', 'Mức dừa', 'Mức thơm'],
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

  const convertedProductDetail: ProductDetail = useMemo(
    () => JSON.parse(productDetail),
    [ProductDetail],
  );

  const [starState, setStarState] = useState(initStars);

  const defaultBatch = useMemo(
    () => convertedProductDetail.batches[0],
    [convertedProductDetail],
  );

  const [form, setForm] = useState({
    size: defaultBatch.size,
    material: defaultBatch.material,
    quantity: 0,
  });

  console.log(JSON.parse(productDetail));
  console.log(form);

  return (
    <>
      <ProductDetailContext.Provider
        value={{
          productDetail: convertedProductDetail,
          starState,
          setStarState,
          form: form,
          setForm: setForm,
        }}
      >
        <Box>
          <ImageBackground>
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
          </ImageBackground>

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
              productList={similiarProducts}
            />
          </Box>
        </Box>
      </ProductDetailContext.Provider>
    </>
  );
};

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
    type: productTypeName,
    state: stockAvailable,
    description: product.description,
    ingredients: product.ingredients,
    howToUse: product.howToUse,
    preservation: product.preservation,
    images: images.map((image: string) => ({ src: image, alt: product.name })),
    batches: filteredBatches,
  };

  return {
    props: {
      productDetail: JSON.stringify(productDetail),
    },
  };
};

export default memo(ProductDetail);
