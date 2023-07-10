import banh1 from '@/assets/Carousel/1.jpg';
import banh2 from '@/assets/Carousel/2.jpg';
import banh3 from '@/assets/Carousel/3.jpg';
import ImageBackground from '@/components/Imagebackground';
import { CustomCard, CustomCardSlider } from '@/components/cards';
import Comments from '@/components/product-detail/Comments';
import ProductDetailInfo from '@/components/product-detail/ProductDetailInfo';
import { COLLECTION_NAME } from '@/lib/constants';
import { AssembledProduct } from '@/lib/contexts/productsContext';
import { assembleProduct, getDocFromFirestore } from '@/lib/firestore';
import {
  BatchObject,
  BatchObjectWithDiscount,
  ProductObject,
  ProductVariant,
} from '@/lib/models';
import { ProductDetailInfoProps } from '@/lib/types/product-detail';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

// Mock Data

const comments = {
  ratingAverage: 4.5,
  numReviews: 123,
  items: [
    {
      id: '1',
      rating: 5,
      comment: 'Ôi là trời',
      time: '12:00 20/01/2023',
      user: {
        id: '1',
        name: 'Nguyen Van A',
        image: banh1.src,
      },
    },
    {
      id: '2',
      rating: 5,
      comment: 'Ôi là trời, cứu mẹ',
      time: '09:00 20/01/2023',
      user: {
        id: '1',
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

function ProductDetail({
  invalid,
  product: paramProduct,
}: {
  invalid?: boolean;
  product: string;
}) {
  if (invalid) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h2">
          Đã có lỗi xảy ra hoặc Không tồn tại sản phẩm này
        </Typography>
      </Box>
    );
  }

  // #region Hooks

  const theme = useTheme();
  const router = useRouter();

  // #endregion

  // #region States

  const [starState, setStarState] = useState(initStars);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedBatch, setSelectedBatch] =
    useState<BatchObjectWithDiscount | null>(null);

  const [quantity, setQuantity] = useState<number>(1);

  // #endregion

  //#region useMemo

  const product: AssembledProduct = useMemo(() => {
    const product = JSON.parse(paramProduct);
    return product;
  }, [paramProduct]);

  const batchOptions: BatchObjectWithDiscount[] = useMemo(() => {
    if (!selectedVariant) return [];

    const batches = product.batches.filter(
      (b) => b.variant_id === selectedVariant.id
    );

    return batches;
  }, [selectedVariant]);

  const productDetailInfoProps: ProductDetailInfoProps = useMemo(() => {
    return {
      product: product,
      variant: selectedVariant,
      onVariantChange: handleVariantChange,
      batch: selectedBatch,
      onBatchChange: handleBatchChange,
      batchOptions: batchOptions,
      quantity: quantity,
      onQuantityChange: handleQuantityChange,
      comments: comments,
      onAddToCart: () => {},
    };
  }, [
    product,
    selectedVariant,
    handleVariantChange,
    selectedBatch,
    handleBatchChange,
    batchOptions,
    quantity,
    handleQuantityChange,
    comments,
  ]);

  //#endregion

  //#region useEffects

  useEffect(() => {
    if (product.variants.length > 0)
      setSelectedVariant(() => product.variants[0]);
  }, [product.variants]);

  useEffect(() => {
    if (batchOptions && batchOptions.length > 0) {
      setSelectedBatch(() => batchOptions[0]);
    }
  }, [batchOptions]);

  //#endregion

  //#region Handlers

  function handleVariantChange(variant: ProductVariant) {
    setSelectedVariant(() => variant);
  }

  function handleBatchChange(batch: BatchObjectWithDiscount) {
    setSelectedBatch(() => batch);
  }

  function handleQuantityChange(quantity: number) {
    setQuantity(() => quantity);
  }

  //#endregion

  return (
    <>
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
                    {product.name}
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
              <ProductDetailInfo {...productDetailInfoProps} />
            </Grid>

            <Grid item xs={12}>
              <Comments comments={comments} />
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
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  if (!context.query.id) {
    console.log('null id in query');
    // Redirect
    return {
      invalid: true,
    };
  }

  try {
    // Get product
    const productId = context.query.id as string;
    const product = await getDocFromFirestore<ProductObject>(
      COLLECTION_NAME.PRODUCTS,
      productId
    );

    const assembledProduct = await assembleProduct(product);

    console.log(assembledProduct);

    return {
      props: {
        invalid: false,
        product: JSON.stringify(assembledProduct),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        invalid: true,
      },
    };
  }
};

export default ProductDetail;
