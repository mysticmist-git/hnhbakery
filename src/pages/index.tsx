import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
          {/* <a href={image.href}>
            <Box
              height={'100%'}
              width={'100%'}
              component={'img'}
              loading="lazy"
              alt=""
              src={image.src}
              sx={{ objectFit: 'cover' }}
            />
          </a> */}
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
  {
    image: '',
    name: '5',
    description: '',
    href: '#',
  },
  {
    image: '',
    name: '6',
    description: '',
    href: '#',
  },
  {
    image: '',
    name: '7',
    description: '',
    href: '#',
  },
];

const CakeCard = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(HomeContext);

  const imageHeight = useMemo(() => props.imageHeight, [props.imageHeight]);

  const defaultInformation: BestSellerItem = useMemo(
    () => ({
      image: banh1.src,
      name: 'Bánh',
      description: 'Bánh ngon dữ lắm bà ơi',
      href: '#',
    }),
    [banh1],
  );

  const imageStyles = useMemo(
    () => ({
      cardNormal: {
        width: '100%',
        height: imageHeight,
        transition: 'transform 0.25s ease-in-out',
        objectFit: 'cover',
      },
      cardHovered: {
        width: '100%',
        height: imageHeight,
        transition: 'transform 0.25s ease-in-out',
        transform: 'scale(1.5)',
        objectFit: 'cover',
      },
    }),
    [imageHeight],
  );

  const [cardHover, setCardHover] = useState(false);

  return (
    <Card
      onMouseOver={() => setCardHover(true)}
      onMouseOut={() => setCardHover(false)}
      raised={cardHover}
      sx={{ borderRadius: '16px', width: '100%' }}
    >
      <CardActionArea
        href={props.href ? props.href : defaultInformation.href}
        sx={{ width: '100%', height: 'auto' }}
      >
        <Grid
          container
          direction={'row'}
          spacing={0}
          justifyContent={'center'}
          alignItems={'center'}
          width={'100%'}
          height={'auto'}
        >
          <Grid item xs={12}>
            <Box
              component={'img'}
              sx={cardHover ? imageStyles.cardHovered : imageStyles.cardNormal}
              alt=""
              src={props.image ? props.image : defaultInformation.image}
              loading="lazy"
            />
          </Grid>
          <Grid
            item
            sx={{ p: 2, pb: 0, bgcolor: theme.palette.common.white }}
            zIndex={1}
            xs={12}
          >
            <Typography
              gutterBottom
              variant="body1"
              color={theme.palette.common.black}
            >
              {props.name ?? defaultInformation.name}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.text.secondary}
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {props.description ?? defaultInformation.description}
            </Typography>
          </Grid>
        </Grid>
      </CardActionArea>
      <CardActions
        sx={{ p: 2, bgcolor: theme.palette.common.white, zIndex: 1 }}
      >
        <CustomButton
          sx={{ px: 2 }}
          children={() => (
            <Typography
              sx={{ color: theme.palette.common.white }}
              variant="button"
            >
              Thêm vào giỏ hàng
            </Typography>
          )}
        />
      </CardActions>
    </Card>
  );
});

const CardSliderItem = memo((props: any) => {
  const { listColumn } = props;

  return (
    <>
      <Grid container direction={'row'} justifyContent={'center'} spacing={2}>
        {listColumn.map((_item: any, i: React.Key | null | undefined) => (
          <Grid key={i} item xs={12 / listColumn.length}>
            <Grid
              container
              justifyContent={'center'}
              alignItems={'center'}
              width={'100%'}
            >
              <props.card
                image={_item.image}
                name={_item.name}
                description={_item.description}
                imageHeight={props.imageHeight}
              ></props.card>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
});

const CustomCardSlider = memo((props: any) => {
  //#region States

  const [bestSellerDisplay, setBestSellerDisplay] = useState<any[]>([]);

  //#endregion

  //#region Hooks

  const theme = useTheme();
  const context = useContext<HomeContextType>(HomeContext);

  //#endregion

  //#region UseEffects

  const oneColumn = useMediaQuery(theme.breakpoints.down('sm'));
  const twoColumn = useMediaQuery(theme.breakpoints.up('sm'));
  const threeColumn = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    let column = 1;

    if (threeColumn) {
      column = 3;
    } else if (twoColumn) {
      column = 2;
    } else if (oneColumn) {
      column = 1;
    }

    let listRow: any[] = [];
    let listColumn: BestSellerItem[] = [];

    const bestSellerCount = context.bestSeller.length;

    for (let i = 0; i < bestSellerCount; i++) {
      listColumn.push(context.bestSeller[i] as BestSellerItem);

      if ((i + 1) % column == 0 || i + 1 == context.bestSeller.length) {
        listRow.push(listColumn);

        listColumn = [];
      }
    }

    setBestSellerDisplay(() => listRow);
  }, [context.bestSeller, oneColumn, twoColumn, threeColumn]);

  //#endregion

  return (
    <>
      <Typography
        variant="h1"
        color={theme.palette.secondary.main}
        align={'center'}
      >
        {props.title}
      </Typography>
      <Box>
        <Carousel
          animation="slide"
          duration={props.duration}
          sx={{ pt: 4, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}
        >
          {bestSellerDisplay.map((listColumn, i) => (
            <CardSliderItem
              key={i}
              listColumn={listColumn}
              imageHeight={props.imageHeight}
              card={props.card}
            />
          ))}
        </Carousel>
      </Box>
    </>
  );
});
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

const TypeCakeCard = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(HomeContext);

  const defaultInformation: TypeCakeItem = useMemo(
    () => ({
      image: banh1.src,
      name: 'Bánh Ngọt',
      description: 'Bánh ngọt nhưng giảm cân!',
      href: '#',
    }),
    [banh1],
  );

  const imageHeight = useMemo(() => props.imageHeight, [props.imageHeight]);
  const descriptionHeight = useMemo(
    () => props.descriptionHeight,
    [props.descfiptionHeight],
  );

  const [cardHover, setCardHover] = useState(false);

  console.log(props);

  return (
    <>
      <Card
        onMouseOver={() => setCardHover(true)}
        onMouseOut={() => setCardHover(false)}
        raised={cardHover}
        sx={{ borderRadius: '16px', width: '100%' }}
      >
        <CardActionArea
          href={props.href ?? defaultInformation.href}
          sx={{ width: '100%' }}
        >
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            width={'100%'}
            spacing={0}
          >
            <Grid item xs={12} height={'auto'}>
              <Box
                component={'img'}
                sx={{
                  transition: 'transform 0.25s ease-in-out',
                  objectFit: 'cover',
                  width: '100%',
                  height: imageHeight,
                  maxHeight: imageHeight,
                  '&:hover': {
                    transform: 'scale(1.5)',
                  },
                }}
                alt=""
                src={props.image ?? defaultInformation.image}
                loading="lazy"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                p: 2,
                bgcolor: theme.palette.common.white,
              }}
              zIndex={1}
            >
              <Typography
                gutterBottom
                variant="h3"
                color={theme.palette.secondary.main}
                align="center"
              >
                {props.name ?? defaultInformation.name}
              </Typography>
              <Typography
                component={'p'}
                variant="body2"
                color={theme.palette.text.secondary}
                align="center"
                sx={{
                  overflow: 'hidden',
                  height: descriptionHeight,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.description ?? defaultInformation.description}
              </Typography>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
    </>
  );
});

const TypeCake = memo((props: any) => {
  const theme = useTheme();
  const context = useContext<HomeContextType>(HomeContext);
  return (
    <>
      <Typography
        variant="h1"
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
                <TypeCakeCard
                  {...item}
                  imageHeight={props.imageHeight}
                  descriptionHeight={props.descriptionHeight}
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
            <Typography align="center" variant="h2">
              Khuyến mãi mỗi ngày
            </Typography>
            <Typography variant="body2" align="center">
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
                  width={'350px'}
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
                    <Typography variant="button">Đăng ký</Typography>
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
  bestSeller: BestSellerItem[];
  typeCake: TypeCakeItem[];
}

const initHomeContext: HomeContextType = {
  carouselImages: [],
  bestSeller: [],
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
          bestSeller: bestSellerState,
          typeCake: typeCakeState,
        }}
      >
        <Box>
          <CustomCarousel height="400px" duration={500} />
          <Box sx={{ pt: 8 }}>
            <CustomCardSlider
              duration={1000}
              imageHeight="184px"
              card={CakeCard}
              title={'Best Seller'}
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
