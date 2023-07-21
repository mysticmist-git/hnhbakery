import banh1 from '@/assets/Carousel/3.jpg';
import bg10 from '@/assets/Decorate/bg10.png';
import bg2 from '@/assets/Decorate/bg2.png';
import { Box, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import React, { memo, useContext, useEffect, useState } from 'react';

import BottomSlideInDiv from '@/components/Animation/Appear/BottomSlideInDiv';
import TopSlideInDiv from '@/components/Animation/Appear/TopSlideInDiv';
import FadeDiv from '@/components/Animation/Loof/FadeDiv';
import CustomTextField from '@/components/Inputs/textFields/CustomTextField';
import { CustomButton } from '@/components/buttons';
import {
  CustomCard,
  CustomCardSlider,
  CustomCardWithButton,
} from '@/components/cards';
import {
  DashDownWhite,
  DashUpWhite,
} from '@/components/decorates/DecorateDivider/DecorateDivider';
import {
  BestSellerItem,
  CarouselImageItem,
  HomeContext,
  HomeContextType,
  TypeCakeItem,
} from '@/lib/contexts/homeContext';
import {
  getBestSellterProducts,
  getCollection,
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import { alpha } from '@mui/system';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from 'react-material-ui-carousel';

// #region Carousel

const CustomCarousel = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(HomeContext);
  return (
    <>
      <Carousel
        animation="slide"
        stopAutoPlayOnHover
        autoPlay
        duration={props.duration}
        indicatorContainerProps={{
          style: {
            position: 'absolute',
            bottom: 8,
            left: '0',
            right: '0',
            zIndex: 1,
          },
        }}
      >
        {context.carouselImages.map((image, i) => (
          <CustomCarouselItem key={i} height={props.height} image={image} />
        ))}
      </Carousel>
    </>
  );
});

const CustomCarouselItem = memo((props: any) => {
  const { height, image } = props;
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  return (
    <>
      <Box sx={{ height: height, width: '100%', position: 'relative' }}>
        <Link href={image.href} style={{ textDecoration: 'none' }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={'100%'} height={height} />
          ) : null}
          <Image
            fill={true}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            onLoad={handleImageLoad}
            style={{
              objectFit: 'cover',
            }}
          />
        </Link>
      </Box>
    </>
  );
});
//#endregion

//#region BestSeller

const initBestSeller: BestSellerItem[] = [
  {
    image: banh1.src,
    name: '1',
    description:
      'mẹ ới cứu bé mẹ ới cứu bé mẹ ới cứu bé mẹ ới cứu bé mẹ ới cứu bé',
    href: '#',
  },
  {
    image: banh1.src,
    name: '2',
    description: '',
    href: '#',
  },
  {
    image: banh1.src,
    name: '3',
    description: '',
    href: '#',
  },
  {
    image: banh1.src,
    name: '4',
    description: '',
    href: '#',
  },
  {
    image: banh1.src,
    name: '5',
    description: '',
    href: '#',
  },
  {
    image: banh1.src,
    name: '6',
    description: '',
    href: '#',
  },
  {
    image: banh1.src,
    name: '4',
    description: '',
    href: '#',
  },
  {
    image: banh1.src,
    name: '5',
    description: '',
    href: '#',
  },
  {
    image: banh1.src,
    name: '6',
    description: '',
    href: '#',
  },
];
//#endregion

//#region Loại bánh

const initTypeCake: TypeCakeItem[] = [
  {
    image: '',
    name: '1',
    description: '',
    href: '#',
  },
  {
    image: '',
    name: '2',
    description: '',
    href: '#',
  },
  {
    image: '',
    name: '3',
    description: '',
    href: '#',
  },
  {
    image: '',
    name: '4',
    description: '',
    href: '#',
  },
];

const TypeCake = memo((props: any) => {
  const theme = useTheme();
  const context = useContext<HomeContextType>(HomeContext);
  return (
    <>
      <Typography
        variant="h2"
        color={theme.palette.secondary.main}
        align={'center'}
      >
        {props.title}
      </Typography>
      <Box sx={{ pt: 4 }}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          {context.typeCake.map((item, i) => (
            <Grid item key={i} md={4} sm={6} xs={12}>
              <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                width={'100%'}
              >
                <CustomCard
                  imageHeight={props.imageHeight}
                  descriptionHeight={props.descriptionHeight}
                  cardInfo={{
                    image: item.image,
                    name: item.name,
                    description: item.description,
                    href: item.href,
                  }}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
});
//#endregion

//#region Khuyến mãi
const DangKyKhuyenMai = memo((props: any) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        height: '80vh',
        minHeight: '300px',
        backgroundImage: `url(${bg10.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        spacing={2}
        pb={4}
      >
        <Grid item xs={11}>
          <Typography
            align="center"
            color={theme.palette.secondary.main}
            variant="h2"
          >
            Khuyến mãi mỗi ngày
          </Typography>
          <Typography
            variant="body2"
            color={theme.palette.common.black}
            align="center"
          >
            Đăng ký email để nhận ưu đãi và thông tin các chương trình khuyến
            mãi
          </Typography>
        </Grid>
        <Grid item xs={11} sm={8} md={6}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={1}
            width={'100%'}
          >
            <Grid item xs={true}>
              <CustomTextField
                sx={{
                  width: '100%',
                }}
                placeholder="Email của bạn"
                type="email"
                borderColor={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton
                sx={{
                  height: '100%',
                  borderRadius: '8px',
                  py: '12px',
                  px: 3,
                }}
              >
                <Typography variant="button" color={theme.palette.common.white}>
                  Đăng ký
                </Typography>
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

const TEXT_SERVER_ERROR = 'Đã có lỗi phía Server';

interface HomeProps {
  isSuccess: boolean;
  productTypesWithImageFetched: TypeCakeItem[];
  bestSellerProductsWithImageFetched: BestSellerItem[];
}

function Home({
  isSuccess,
  productTypesWithImageFetched: typeCakeState,
  bestSellerProductsWithImageFetched: bestSellerState,
}: HomeProps) {
  if (!isSuccess)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 600,
        }}
      >
        {TEXT_SERVER_ERROR}
      </Box>
    );

  //#region States
  const [carouselImagesState, setCarouselImagesState] = useState<
    CarouselImageItem[]
  >([]);

  //#endregion
  //#region Hooks
  const theme = useTheme();

  //#endregion
  //#region UseEffects
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
  //#region Logs
  //#endregion
  return (
    <>
      <HomeContext.Provider
        value={{
          carouselImages: carouselImagesState,
          typeCake: typeCakeState,
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
                    productList={bestSellerState}
                    buttonOnclick={() => {}}
                  />
                  {bestSellerState.length <= 0 && (
                    <Typography variant="h2">Không có dữ liệu</Typography>
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

//#region Local Functions

async function fetchTypeCakesAndGetTheirImagesToo(
  productTypes: ProductTypeObject[]
): Promise<TypeCakeItem[]> {
  // Get image
  const promises = productTypes.map(async (type) => {
    let image = '';

    try {
      image = await getDownloadUrlFromFirebaseStorage(type.image);
    } catch (error) {
      console.log(error);
    }

    return {
      ...type,
      url: image,
    };
  });

  const imageFetchedProductTypes = await Promise.all(promises);

  return imageFetchedProductTypes.map(
    (type) =>
      ({
        image: type.url,
        name: type.name,
        description: type.description,
        href: `/products?product_type=${type.id}`,
      } as TypeCakeItem)
  );
}

async function fetchBestSellerProductsAndTheirImagesToo(
  bestSellerProducts: ProductObject[]
): Promise<BestSellerItem[]> {
  // Get images
  const promises = bestSellerProducts.map(async (product) => ({
    ...product,
    url: (await getDownloadUrlFromFirebaseStorage(product.images[0])) as string,
  }));

  const imageFetchedProducts = await Promise.all(promises);

  return imageFetchedProducts.map(
    (product) =>
      ({
        image: product.url,
        name: product.name,
        description: product.description,
        href: `/product-detail?id=${product.id}`,
      } as BestSellerItem)
  );
}

//#endregion

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  let productTypesWithImageFetched;
  let bestSellerProductsWithImageFetched;

  try {
    const productTypes = await getCollection<ProductTypeObject>('productTypes');
    const bestSellerProducts = await getBestSellterProducts();

    productTypesWithImageFetched = await fetchTypeCakesAndGetTheirImagesToo(
      productTypes
    );

    bestSellerProductsWithImageFetched =
      await fetchBestSellerProductsAndTheirImagesToo(bestSellerProducts);
  } catch (error: any) {
    console.log(error);
    return {
      props: {
        isSuccess: false,
        message: error.message,
      },
    };
  }

  return {
    props: {
      isSuccess: true,
      productTypesWithImageFetched,
      bestSellerProductsWithImageFetched,
    },
  };
}

export default memo(Home);
