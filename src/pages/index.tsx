import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
  memo,
} from 'react';
import banh1 from '../assets/Carousel/3.jpg';
import { alpha } from '@mui/system';
import CustomTextField from '@/components/Inputs/CustomTextField';
import Carousel from 'react-material-ui-carousel';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import {
  getBestSellterProducts,
  getCollection,
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore/firestoreLib';
import Link from 'next/link';
import Image from 'next/image';
import { CustomButton } from '@/components/Inputs/Buttons';
import {
  CustomCard,
  CustomCardSlider,
  CustomCardWithButton,
} from '@/components/Layouts/components';

// #region Carousel
interface CarouselImageItem {
  src: string;
  alt: string;
  href: string;
}

const CustomCarousel = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(HomeContext);

  return (
    <Carousel animation="slide" duration={props.duration}>
      {context.carouselImages.map((image, i) => (
        <Box
          key={i}
          sx={{ height: props.height, width: '100%', position: 'relative' }}
        >
          <Link href={image.href} style={{ textDecoration: 'none' }}>
            <Image
              fill={true}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              style={{
                objectFit: 'cover',
              }}
            />
          </Link>
        </Box>
      ))}
    </Carousel>
  );
});
//#endregion

//#region BestSeller
interface BestSellerItem {
  image: string;
  name: string;
  description: string;
  href: string;
}

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
interface TypeCakeItem extends BestSellerItem {}

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
        mt: 8,
        width: '100%',
        height: '450px',
        backgroundImage: `url(${banh1.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: alpha(theme.palette.common.black, 0.6),
        }}
      >
        <Grid
          sx={{ px: 6 }}
          height={'100%'}
          container
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item>
            <Typography
              align="center"
              color={theme.palette.common.white}
              variant="h2"
            >
              Khuyến mãi mỗi ngày
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.common.white}
              align="center"
            >
              Đăng ký email để nhận ưu đãi và thông tin các chương trình khuyến
              mãi
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              spacing={1}
            >
              <Grid item>
                <CustomTextField
                  sx={{
                    width: '400px',
                  }}
                  placeholder="Email của bạn"
                  type="email"
                  borderColor={theme.palette.common.white}
                />
              </Grid>
              <Grid item>
                <CustomButton
                  sx={{
                    height: '100%',
                    borderRadius: '8px',
                    py: '12px',
                    px: 3,
                  }}
                  children={() => (
                    <Typography
                      variant="button"
                      color={theme.palette.common.white}
                    >
                      Đăng ký
                    </Typography>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

//#endregion

// #region Context
export interface HomeContextType {
  carouselImages: CarouselImageItem[];
  typeCake: TypeCakeItem[];
}

const initHomeContext: HomeContextType = {
  carouselImages: [],
  typeCake: [],
};

export const HomeContext = createContext<HomeContextType>(initHomeContext);
// #endregion

const Home = ({
  productTypesWithImageFetched: typeCakeState,
  bestSellerProductsWithImageFetched: bestSellerState,
}: {
  productTypesWithImageFetched: TypeCakeItem[];
  bestSellerProductsWithImageFetched: BestSellerItem[];
}) => {
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
        imagePaths.map((path) => import(`../assets/Carousel/${path}`)),
      );

      setCarouselImagesState(() =>
        images.map(function (image) {
          return {
            src: image.default.src,
            alt: '',
            href: '#',
          };
        }),
      );
    };
    importImages();
  }, []);

  //#endregion

  //#region Logs

  console.log(typeCakeState);
  console.log(bestSellerState);

  //#endregion

  return (
    <>
      <HomeContext.Provider
        value={{
          carouselImages: carouselImagesState,
          typeCake: typeCakeState,
        }}
      >
        <Box>
          <CustomCarousel height="400px" duration={500} />
          <Box sx={{ pt: 8 }}>
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h2">Không có dữ liệu</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ pt: 8, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
            <TypeCake
              title="Đa dạng loại bánh"
              imageHeight="184px"
              descriptionHeight="32px"
            />
          </Box>
          <DangKyKhuyenMai />
        </Box>
      </HomeContext.Provider>
    </>
  );
};
//#region Local Functions

async function fetchTypeCakesAndGetTheirImagesToo(
  productTypes: ProductTypeObject[],
): Promise<TypeCakeItem[]> {
  // Get image
  const promises = productTypes.map(async (type) => ({
    ...type,
    url: (await getDownloadUrlFromFirebaseStorage(type.image)) as string,
  }));

  const imageFetchedProductTypes = await Promise.all(promises);

  return imageFetchedProductTypes.map(
    (type) =>
      ({
        image: type.url,
        name: type.name,
        description: type.description,
        href: type.id,
      } as TypeCakeItem),
  );
}

async function fetchBestSellerProductsAndTheirImagesToo(
  bestSellerProducts: ProductObject[],
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
        href: product.id,
      } as BestSellerItem),
  );
}

//#endregion

export async function getServerSideProps() {
  const productTypes = await getCollection<ProductTypeObject>('productTypes');
  const bestSellerProducts = await getBestSellterProducts();

  const productTypesWithImageFetched = await fetchTypeCakesAndGetTheirImagesToo(
    productTypes,
  );

  const bestSellerProductsWithImageFetched =
    await fetchBestSellerProductsAndTheirImagesToo(bestSellerProducts);

  return {
    props: {
      productTypesWithImageFetched,
      bestSellerProductsWithImageFetched,
    },
  };
}

export default memo(Home);
