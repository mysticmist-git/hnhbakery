import { CartItem } from '@/@types/cart';
import banh1 from '@/assets/Carousel/1.jpg';
import banh2 from '@/assets/Carousel/2.jpg';
import banh3 from '@/assets/Carousel/3.jpg';
import ImageBackground from '@/components/Imagebackground';
import { CustomCard, CustomCardSlider } from '@/components/cards';
import Feedbacks from '@/components/product-detail/Comments/Feedbacks';
import ProductDetailInfo from '@/components/product-detail/ProductDetailInfo';
import { auth, db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { CartItemFactory } from '@/lib/factories/CartItemFactory';
import { assembleProduct, getDocFromFirestore } from '@/lib/firestore';
import {
  BatchObjectWithDiscount,
  FeedbackObject,
  ProductObject,
  ProductVariant,
  feedbackConverter,
} from '@/lib/models';
import { ProductDetailInfoProps } from '@/lib/types/product-detail';
import { AssembledProduct } from '@/lib/types/products';
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { isTimeView } from '@mui/x-date-pickers/internals/utils/time-utils';
import { useLocalStorageValue } from '@react-hookz/web';
import { collection, query, where } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
    name: 'Bánh bông lan',
    description:
      'Bánh bông lan với cốt bánh đặc trưng thơm béo, ngất ngây lòng người,...',
  },
  {
    id: 1,
    image: banh3.src,
    href: '#',
    name: 'Bánh kem',
    description:
      'Bánh kem với lớp kem độc quyền từ H&H mang đến trải nghiệm đột phá ở đầu lưỡi,...',
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

function ProductDetail({
  invalid,
  product: paramProduct,
}: {
  invalid?: boolean;
  product: string;
}) {
  // #region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  // #endregion

  // #region States

  const [backdropOpen, setBackdropOpen] = useState<boolean>(false);
  const [user, loading, error] = useAuthState(auth);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedBatch, setSelectedBatch] =
    useState<BatchObjectWithDiscount | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsLoading] = useState<boolean>(false);
  const { value: cart, set: setCart } = useLocalStorageValue<CartItem[]>(
    'cart',
    {
      defaultValue: [],
      initializeWithValue: false,
      parse(str, fallback) {
        if (!str) return fallback;

        const value: any[] = JSON.parse(str);
        const items = value.map(
          (item) =>
            new CartItem(item._userId, item._batchId, item._quantity, item._id)
        );

        return items;
      },
    }
  );

  // #endregion

  //#region Callbacks

  const product: AssembledProduct = useMemo(() => {
    const product = JSON.parse(paramProduct);
    return product;
  }, [paramProduct]);

  const handleAddToCart = useCallback(() => {
    setIsLoading(() => true);

    if (loading) {
      handleSnackbarAlert('error', 'Đang tải người dùng');
      return;
    }

    if (!product) {
      handleSnackbarAlert('error', 'Lỗi khi tải sản phẩm');
      return;
    }

    if (!selectedVariant) {
      handleSnackbarAlert('error', 'Lỗi khi tải biến thể');
      return;
    }

    if (!selectedBatch) {
      handleSnackbarAlert('error', 'Lỗi khi tải lô hàng');
      return;
    }

    const factory = new CartItemFactory();

    if (!cart) {
      handleSnackbarAlert('error', 'Lỗi khi tải giỏ hàng');
      return;
    }

    const clonedCart: CartItem[] = cart.map((item) => item.clone());

    console.log(clonedCart);
    console.log(selectedBatch.id);

    const duplicateItem = clonedCart.find(
      (item) => item.batchId === selectedBatch.id
    );

    console.log(duplicateItem);

    if (duplicateItem) {
      duplicateItem.quantity = duplicateItem.quantity + quantity;
    } else {
      const cartItem: CartItem = factory.create(
        user?.uid ?? '',
        selectedBatch.id,
        quantity
      );

      clonedCart.push(cartItem);
    }

    setCart(clonedCart);

    handleSnackbarAlert('success', 'Đã thêm sản phẩm vào giỏ hàng');

    router.push('/cart');

    setIsLoading(() => false);
  }, [
    cart,
    handleSnackbarAlert,
    loading,
    product,
    quantity,
    router,
    selectedBatch,
    selectedVariant,
    setCart,
    user?.uid,
  ]);

  //#endregion

  //#region useMemo

  const batchOptions: BatchObjectWithDiscount[] = useMemo(() => {
    if (!selectedVariant) return [];

    const batches = product.batches.filter(
      (b) => b.variant_id === selectedVariant.id
    );

    return batches;
  }, [product.batches, selectedVariant]);

  const [feedbacks, fLoading, fError] = useCollectionData<FeedbackObject>(
    product
      ? query(
          collection(db, COLLECTION_NAME.FEEDBACKS),
          where('product_id', '==', product.id)
        ).withConverter(feedbackConverter)
      : undefined,
    {
      initialValue: [],
    }
  );

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
      comments: feedbacks ?? [],
      onAddToCart: handleAddToCart,
    };
  }, [
    product,
    selectedVariant,
    selectedBatch,
    batchOptions,
    quantity,
    feedbacks,
    handleAddToCart,
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

  useEffect(() => {
    setBackdropOpen(() => isAdding);
  }, [isAdding]);

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
              {fLoading ? (
                <div>Loading...</div>
              ) : (
                <Feedbacks
                  userId={user?.uid ?? ''}
                  productId={product.id}
                  comments={feedbacks ?? []}
                />
              )}
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
        onClick={() => setBackdropOpen(() => false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
