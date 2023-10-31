import { CartItem } from '@/@types/cart';
import banh1 from '@/assets/Carousel/1.jpg';
import banh2 from '@/assets/Carousel/2.jpg';
import banh3 from '@/assets/Carousel/3.jpg';
import ImageBackground from '@/components/Imagebackground';
import { CustomCard, CustomCardSlider } from '@/components/cards';
import Feedbacks from '@/components/product-detail/Comments/Feedbacks';
import ProductDetailInfo from '@/components/product-detail/ProductDetailInfo';
import { auth } from '@/firebase/config';
import { getProductDetail } from '@/lib/DAO/productDAO';
import { getProductTypes } from '@/lib/DAO/productTypeDAO';
import { useSnackbarService } from '@/lib/contexts';
import { CartItemFactory } from '@/lib/factories/CartItemFactory';
import useCartItems from '@/lib/hooks/useCartItems';
import Batch from '@/models/batch';
import { ProductDetail } from '@/models/product';
import ProductType from '@/models/productType';
import { VariantTableRow } from '@/models/variant';
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { useLocalStorageValue } from '@react-hookz/web';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

/**
 * Similiar products mock data
 */
const similiarProductsSample = [
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

function ProductDetail() {
  // #region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  // #endregion

  // #region States

  const [backdropOpen, setBackdropOpen] = useState<boolean>(false);
  const [user, loading, error] = useAuthState(auth);
  const [isAdding, setIsLoading] = useState<boolean>(false);

  const [productDetail, setProductDetail] = useState<ProductDetail | undefined>(
    undefined
  );

  const [similiarProducts, setSimiliarProducts] = useState<ProductType[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<Batch | undefined>(
    undefined
  );

  function handleBatchChange(batch: Batch) {
    setSelectedBatch(() => batch);
  }

  const [quantity, setQuantity] = useState<number>(1);
  function handleQuantityChange(quantity: number) {
    setQuantity(() => quantity);
  }

  const [selectedVariant, setSelectedVariant] = useState<
    VariantTableRow | undefined
  >(undefined);
  function handleVariantChange(variant: VariantTableRow) {
    setSelectedVariant(() => variant);
  }

  const [cart, setCart] = useCartItems();

  // const [product, setProduct] = useState<AssembledProduct | null>(null);

  // #endregion

  const handleAddToCart = useCallback(() => {
    setIsLoading(true);

    if (loading) {
      handleSnackbarAlert('error', 'Đang tải người dùng');
      return;
    }

    if (!productDetail) {
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

    const duplicatedItem = clonedCart.find(
      (item) => item.batchId === selectedBatch.id
    );

    console.log(duplicatedItem);

    if (duplicatedItem) {
      duplicatedItem.quantity = duplicatedItem.quantity + quantity;
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
    productDetail,
    quantity,
    router,
    selectedBatch,
    selectedVariant,
    setCart,
    user?.uid,
  ]);

  const batchOptions: Batch[] = useMemo(() => {
    if (!selectedVariant || !productDetail) return [];

    const batches =
      productDetail.variants?.find((v) => v.id === selectedVariant.id)
        ?.batcheObjects ?? [];

    return batches;
  }, [productDetail, selectedVariant]);

  // const [feedbacks, fLoading, fError] = useCollectionData<FeedbackObject>(
  //   product
  //     ? query(
  //         collection(db, COLLECTION_NAME.FEEDBACKS),
  //         where('product_id', '==', product.id)
  //       ).withConverter(feedbackConverter)
  //     : undefined,
  //   {
  //     initialValue: [],
  //   }
  // );

  // const productDetailInfoProps: ProductDetailInfoProps = useMemo(() => {
  //   return {
  //     product: product,
  //     variant: selectedVariant,
  //     onVariantChange: handleVariantChange,
  //     batch: selectedBatch,
  //     onBatchChange: handleBatchChange,
  //     batchOptions: batchOptions,
  //     quantity: quantity,
  //     onQuantityChange: handleQuantityChange,
  //     comments: feedbacks ?? [],
  //     onAddToCart: handleAddToCart,
  //   };
  // }, [
  //   product,
  //   selectedVariant,
  //   selectedBatch,
  //   batchOptions,
  //   quantity,
  //   feedbacks,
  //   handleAddToCart,
  // ]);

  useEffect(() => {
    const fetchData = async () => {
      const batch_id = router.query.id;

      try {
        const finalDetail = await getProductDetail(batch_id as string);
        setSimiliarProducts(
          (await getProductTypes()).filter(
            (p) => p.id !== finalDetail?.product_type_id && p.active
          )
        );
        setProductDetail(finalDetail);
      } catch (error) {
        console.log(error);
        return {
          props: {
            invalid: true,
          },
        };
      }
    };

    fetchData();
  }, [router.query.id]);

  console.log(productDetail);

  useEffect(() => {
    if (!productDetail) {
      setSelectedBatch(undefined);

      return;
    }

    if (productDetail.variants && productDetail?.variants?.length > 0)
      setSelectedVariant(productDetail.variants[0]);
  }, [productDetail, productDetail?.variants]);

  useEffect(() => {
    if (batchOptions && batchOptions.length > 0) {
      setSelectedBatch(() => batchOptions[0]);
    }
  }, [batchOptions]);

  useEffect(() => {
    setBackdropOpen(() => isAdding);
  }, [isAdding]);

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
                    {productDetail?.name ?? ''}
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
              <ProductDetailInfo
                productDetail={productDetail}
                variant={selectedVariant}
                onVariantChange={handleVariantChange}
                batch={selectedBatch}
                onBatchChange={handleBatchChange}
                batchOptions={batchOptions}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                handleAddToCart={handleAddToCart}
              />
            </Grid>

            <Grid item xs={12}>
              <Feedbacks
                productDetail={productDetail}
                userId={user?.uid ?? ''}
                productId={productDetail?.id ?? ''}
                feedbacks={productDetail?.feedbacks ?? []}
              />
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
            productList={similiarProducts ?? similiarProductsSample}
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

export default ProductDetail;
