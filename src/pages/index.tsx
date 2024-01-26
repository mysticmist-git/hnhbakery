import bg2 from '@/assets/Decorate/bg2.png';
import {
  Box,
  IconButton,
  Modal,
  Typography,
  Zoom,
  alpha,
  useTheme,
} from '@mui/material';
import React, { memo, useEffect, useState } from 'react';

import BottomSlideInDiv from '@/components/animations/appear/BottomSlideInDiv';
import TopSlideInDiv from '@/components/animations/appear/TopSlideInDiv';
import FadeDiv from '@/components/animations/loof/FadeDiv';
import { CustomCardSlider, CustomCardWithButton } from '@/components/cards';
import {
  DashDownWhite,
  DashUpWhite,
} from '@/components/decorates/DecorateDivider/DecorateDivider';
import { CustomCarousel } from '@/components/home/CustomCarousel/CustomCarousel';
import { DangKyKhuyenMai } from '@/components/home/DangKyKhuyenMai/DangKyKhuyenMai';
import TypeCake from '@/components/home/TypeCake';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  CarouselImageItem,
  HomeCardDisplayItem,
  HomeContext,
} from '@/lib/contexts/homeContext';
// import { getBestSellterProducts as getBestSellerProducts, getCollection } from '@/lib/firestore';
// import { ProductObject, ProductTypeObject } from '@/lib/models';
import KhuyenNghiSanPhamDialog from '@/components/home/KhuyenNghiSanPhamDialog';
import RecommendDialog, {
  cam,
  gradientReconmend,
  hong,
} from '@/components/recommend/RecommendDialog';
import { auth } from '@/firebase/config';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getCustomerReference } from '@/lib/DAO/customerReferenceDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import {
  getAvailableProductTypeTableRows,
  getProductTypes,
} from '@/lib/DAO/productTypeDAO';
import CustomerReference from '@/models/CustomerReference';
import Batch from '@/models/batch';
import Product, { ProductTableRow } from '@/models/product';
import ProductType, { ProductTypeTableRow } from '@/models/productType';
import { RecommendRounded } from '@mui/icons-material';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useAuthState } from 'react-firebase-hooks/auth';

function Home() {
  const [carouselImagesState, setCarouselImagesState] = useState<
    CarouselImageItem[]
  >([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [user, userLoading, userError] = useAuthState(auth);
  const theme = useTheme();

  //#region Gợi ý sản phẩm
  const [openThamGiaKhaoSat, setOpenThamGiaKhaoSat] = React.useState(false);
  const handleClose = () => setOpenThamGiaKhaoSat(false);

  const [openKhuyenNghiSanPham, setOpenKhuyenNghiSanPham] =
    React.useState(false);
  const handleCloseKhuyenNghiSanPham = () => setOpenKhuyenNghiSanPham(false);
  const handleOpenKhuyenNghiSanPham = () => setOpenKhuyenNghiSanPham(true);

  const [customerReferenceData, setCustomerReferenceData] = useState<
    CustomerReference | undefined
  >(undefined);
  //#endregion

  //#region UseEffects

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productTypesPromise, bestSellersPromise] =
          await Promise.allSettled([
            await getHomeProductTypes(),
            await getHomeBestSellers(),
          ]);
        const productTypes =
          productTypesPromise.status === 'fulfilled'
            ? productTypesPromise.value
            : [];
        const bestSellers =
          bestSellersPromise.status === 'fulfilled'
            ? bestSellersPromise.value
            : [];

        setProductTypes(productTypes);
        setBestSellers(bestSellers);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();

    //--------------

    const importImages = async () => {
      const imagePaths = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];

      const images = await Promise.all(
        imagePaths.map((path) => import(`@/assets/Carousel/${path}`))
      );

      setCarouselImagesState(() =>
        images.map(function (image) {
          return {
            src: image.default.src,
            alt: '',
            href: '#',
          };
        })
      );
    };

    importImages();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          return;
        }
        const cusrefer = await getCustomerReference(user.uid);
        if (cusrefer) {
          setCustomerReferenceData(cusrefer);
        } else {
          setOpenThamGiaKhaoSat(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user]);

  //#endregion

  return (
    <>
      <HomeContext.Provider
        value={{
          carouselImages: carouselImagesState,
          productTypes: productTypes,
        }}
      >
        <Box
          component={'div'}
          sx={{
            backgroundImage: `url(${bg2.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
          }}
        >
          <Box
            component={'div'}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.85),
              backdropFilter: 'blur(1px)',
            }}
          >
            <TopSlideInDiv>
              <Box
                component={'div'}
                sx={{
                  overflow: 'hidden',
                  position: 'relative',
                  borderBottom: 3,
                  borderColor: theme.palette.secondary.main,
                }}
              >
                <CustomCarousel height="60vh" duration={500} />
              </Box>
              {/* <SolidDownWhite /> */}
            </TopSlideInDiv>

            <BottomSlideInDiv>
              <FadeDiv>
                <Box
                  component={'div'}
                  sx={{
                    py: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CustomCardSlider
                    duration={1000}
                    imageHeight="184px"
                    descriptionHeight="32px"
                    CustomCard={CustomCardWithButton}
                    title={'Best Seller'}
                    productList={bestSellers}
                    buttonOnclick={() => {}}
                  />
                  {bestSellers.length <= 0 && (
                    <Typography variant="h2">
                      Hiện không có Best Seller nào
                    </Typography>
                  )}
                </Box>
              </FadeDiv>

              <FadeDiv>
                <DashUpWhite />
                <Box
                  component={'div'}
                  sx={{
                    pb: 8,
                    px: { xs: 2, sm: 2, md: 4, lg: 8 },
                    bgcolor: theme.palette.common.white,
                  }}
                >
                  <TypeCake
                    title="Đa dạng loại bánh"
                    imageHeight="184px"
                    descriptionHeight="32px"
                  />
                </Box>
                <DashDownWhite />
              </FadeDiv>

              <FadeDiv>
                <Box
                  component={'div'}
                  sx={{
                    background: `linear-gradient(to bottom,${alpha(
                      theme.palette.primary.main,
                      0.05
                    )}, ${alpha(theme.palette.primary.main, 1)})`,
                  }}
                >
                  <DangKyKhuyenMai />
                </Box>
              </FadeDiv>
            </BottomSlideInDiv>
          </Box>

          <KhuyenNghiSanPhamDialog
            open={openThamGiaKhaoSat}
            handleClose={handleClose}
          />

          <Box
            component={'div'}
            sx={{
              position: 'fixed',
              bottom: theme.spacing(13),
              right: theme.spacing(3),
              zIndex: theme.zIndex.drawer,
            }}
          >
            <Zoom in={true}>
              <Box component={'div'}>
                <IconButton
                  onClick={handleOpenKhuyenNghiSanPham}
                  sx={{
                    height: theme.spacing(8),
                    width: theme.spacing(8),
                    background: gradientReconmend,
                    color: 'white',
                    boxShadow: ' 0 3px 5px 2px rgba(255, 105, 135, .3)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.15) rotate(360deg)',
                      boxShadow: 0,
                    },
                  }}
                >
                  <RecommendRounded color="inherit" />
                </IconButton>
              </Box>
            </Zoom>
          </Box>

          <RecommendDialog
            open={openKhuyenNghiSanPham}
            handleClose={handleCloseKhuyenNghiSanPham}
            customerReferenceData={customerReferenceData}
          />
        </Box>
      </HomeContext.Provider>
    </>
  );
}

const getHomeProductTypes = async () => {
  const productTypes: ProductType[] = await getProductTypes();

  return (
    productTypes
      .filter((type) => type.active)
      .map((type) => ({
        ...type,
        href: `products?product_type=${type.description}`,
      })) ?? []
  );
};

const getHomeBestSellers = async () => {
  const bestSellers = await getBestSellerProducts();

  console.log(bestSellers);

  return (
    bestSellers.map((product) => ({
      ...product,
      image: product.images[0] || '',
      href: `/product-detail?type_id=${product.product_type_id}&id=${product.id}`,
    })) ?? []
  );
};

async function getBestSellerProducts(): Promise<Product[]> {
  // Constants
  const minSoldQuantity = 0;
  const queryLimit = 7;

  const batchesResult: Batch[] = [];
  const batches = (await getBatches()).filter(
    (batch) => new Date(batch.exp).getTime() > new Date().getTime()
  );

  for (let batch of batches) {
    if (batch.sold >= minSoldQuantity) {
      const exist = batchesResult.findIndex(
        (item) =>
          item.product_type_id === batch.product_type_id &&
          item.product_id === batch.product_id
      );
      if (exist === -1) {
        batchesResult.push(batch);
      } else if (batchesResult[exist].sold < batch.sold) {
        batchesResult[exist] = batch;
      }
    }
  }
  batchesResult.sort((a, b) => b.sold - a.sold).slice(0, queryLimit);

  const productResult: Product[] = await Promise.all(
    batchesResult.map(
      async (batch) => await getProduct(batch.product_type_id, batch.product_id)
    )
  ).then(
    (products) =>
      products.filter(
        (product) =>
          product != undefined && product.images.length > 0 && product.active
      ) as Product[]
  );

  return productResult;
}

async function getRecommendProducts(
  customerReference: CustomerReference
): Promise<ProductTableRow[]> {
  const productTypes: ProductTypeTableRow[] =
    await getAvailableProductTypeTableRows(customerReference.productTypeIds);

  let products: ProductTableRow[] = productTypes
    .flatMap((productType) => productType.products)
    .filter(
      (product) =>
        product != undefined && product.images.length > 0 && product.active
    ) as ProductTableRow[];

  const recommendProducts: ProductTableRow[] = products.filter((product) => {
    if (!product) {
      return false;
    }
    const prices = product.variants
      ?.map((variant) => variant.price)
      .filter((price) => price != undefined);

    const price = prices?.some(
      (price) =>
        price <= customerReference.prices.max &&
        price >= customerReference.prices.min
    );
    if (!price) {
      return false;
    }

    const color = product.colors.some((color) =>
      customerReference.colors.includes(color)
    );
    if (!color) {
      return false;
    }
    const sizes = product.variants?.map((variant) => variant.size);
    const size = sizes?.some((size) => customerReference.sizes.includes(size));
    if (!size) {
      return false;
    }
    return true;
  });

  return recommendProducts;
}

//#endregion

export default Home;
