import bg2 from '@/assets/Decorate/bg2.png';
import { Box, Typography, useTheme } from '@mui/material';
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
import { alpha } from '@mui/system';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getProductTypes } from '@/lib/DAO/productTypeDAO';
import ProductType from '@/models/productType';
import Product from '@/models/product';
import { getBatches } from '@/lib/DAO/batchDAO';
import Batch from '@/models/batch';
import { getProduct } from '@/lib/DAO/productDAO';

function Home() {
  //#region States
  const [carouselImagesState, setCarouselImagesState] = useState<
    CarouselImageItem[]
  >([]);

  //#endregion

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  //#region Hooks

  const theme = useTheme();

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
        console.log(productTypes);
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
        </Box>
      </HomeContext.Provider>
    </>
  );
}

const getHomeProductTypes = async () => {
  const productTypes: ProductType[] = await getProductTypes();

  return (
    productTypes.map((type) => ({
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
      href: `/product-detail?id=${product.id}`,
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

  const productResult: Product[] = [];
  for (let batch of batchesResult) {
    const product = await getProduct(batch.product_type_id, batch.product_id);
    if (product) {
      productResult.push(product);
    }
  }

  return productResult;
}

export default Home;
