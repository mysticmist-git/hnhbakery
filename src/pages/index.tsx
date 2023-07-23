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
import { getBestSellterProducts, getCollection } from '@/lib/firestore';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import { alpha } from '@mui/system';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

const TEXT_SERVER_ERROR = 'Đã có lỗi phía Server';

interface HomeProps {
  isSuccess: boolean;
  productTypes: ProductTypeObject[];
  bestSellers: ProductObject[];
}

function Home() {
  //#region States
  const [carouselImagesState, setCarouselImagesState] = useState<
    CarouselImageItem[]
  >([]);

  //#endregion

  const [productTypes, setProductTypes] = useState<ProductTypeObject[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductObject[]>([]);

  //#region Hooks

  const theme = useTheme();

  //#endregion

  //#region UseEffects

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productTypesPromise, bestSellersPromise] =
          await Promise.allSettled([
            await getProductTypes(),
            await getBestSellers(),
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
  }, []);

  useEffect(() => {
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
          sx={{
            backgroundImage: `url(${bg2.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.85),
              backdropFilter: 'blur(1px)',
            }}
          >
            <TopSlideInDiv>
              <Box
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

const getProductTypes = async () => {
  const productTypes = await getCollection<ProductTypeObject>(
    COLLECTION_NAME.PRODUCT_TYPES
  );

  return productTypes || [];
};

const getBestSellers = async () => {
  const bestSellers = await getBestSellterProducts();

  return bestSellers;
};

export default Home;
