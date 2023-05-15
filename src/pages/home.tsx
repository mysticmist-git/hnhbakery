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
import React, { useEffect, useState, createContext, useContext } from 'react';
import Carousel from 'react-material-ui-carousel';
import banh1 from '../assets/Carousel/3.jpg';
import { alpha } from '@mui/system';
import CustomTextField from '@/components/CustomTextField';
import CustomButton from '@/components/customButton';

// #region Carousel
interface CarouselImageItem {
  src: string;
  alt: string;
  href: string;
}

function CustomCarousel(props: any) {
  const theme = useTheme();
  const context = useContext(HomeContext);
  return (
    <Carousel animation="slide" duration={props.duration}>
      {context.carouselImages.map((image, i) => (
        <Box
          key={i}
          sx={{ height: props.height, width: '100%', position: 'relative' }}
        >
          <a href={image.href}>
            <Box
              height={'100%'}
              width={'100%'}
              component={'img'}
              loading="lazy"
              alt=""
              src={image.src}
              sx={{ objectFit: 'cover' }}
            />
          </a>
        </Box>
      ))}
    </Carousel>
  );
}
//#endregion

// #region Best seller
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

function CakeCard(props: any) {
  const theme = useTheme();
  const context = useContext(HomeContext);
  const defaultInformation: BestSellerItem = {
    image: banh1.src,
    name: 'Bánh',
    description: 'Bánh ngon dữ lắm bà ơi',
    href: '#',
  };

  const imageHeight = props.imageHeight;

  const imageStyles = {
    cardNormal: {
      width: '100%',
      height: '100%',
      maxWidth: 345,
      minWidth: 320,
      transition: 'transform 0.25s ease-in-out',
    },
    cardHovered: {
      width: '100%',
      height: '100%',
      maxWidth: 345,
      minWidth: 320,
      transition: 'transform 0.4s ease-in-out',
      transform: 'scale(1.5)',
    },
  };

  const [cardHover, setCardHover] = useState(false);

  return (
    <Card
      onMouseOver={() => setCardHover(true)}
      onMouseOut={() => setCardHover(false)}
      raised={cardHover}
      sx={{ borderRadius: '16px' }}
    >
      <CardActionArea href={props.href ? props.href : defaultInformation.href}>
        <Grid container direction={'column'}>
          <Grid item width={'100%'} height={imageHeight}>
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
          >
            <Typography
              gutterBottom
              variant="body1"
              color={theme.palette.common.black}
            >
              {props.name ? props.name : defaultInformation.name}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              {props.description
                ? props.description
                : defaultInformation.description}
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
            <Typography variant="button">Thêm vào giỏ hàng</Typography>
          )}
        />
      </CardActions>
    </Card>
  );
}

function CardSliderItem(props: any) {
  const { listColumn } = props;
  return (
    <>
      <Grid container direction={'row'} justifyContent={'center'} spacing={2}>
        {listColumn.map((_item: any, i: React.Key | null | undefined) => (
          <Grid key={i} item xs={12 / listColumn.length}>
            <Grid container justifyContent={'center'} alignItems={'center'}>
              <props.card
                image={_item.image}
                name={_item.name}
                descripton={_item.descripton}
                imageHeight={props.imageHeight}
              ></props.card>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function CustomCardSlider(props: any) {
  const theme = useTheme();
  const context = useContext(HomeContext);

  const [bestSellerDisplay, setBestSellerDisplay] = useState<any[]>([]);
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
    let listRow = [];
    let listColumn: BestSellerItem[] = [];
    for (let i = 0; i < context.bestSeller.length; i++) {
      listColumn.push({
        image: context.bestSeller[i].image,
        name: context.bestSeller[i].name,
        description: context.bestSeller[i].description,
        href: context.bestSeller[i].href,
      });
      if ((i + 1) % column == 0 || i + 1 == context.bestSeller.length) {
        listRow.push(listColumn);
        listColumn = [];
      }
    }
    setBestSellerDisplay(listRow);
  }, [context.bestSeller, oneColumn, twoColumn, threeColumn]);

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
        <Carousel animation="slide" duration={props.duration} sx={{ pt: 4 }}>
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
}
// #endregion

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

function TypeCakeCard(props: any) {
  const theme = useTheme();
  const context = useContext(HomeContext);

  const defaultInformation: TypeCakeItem = {
    image: banh1.src,
    name: 'Bánh Ngọt',
    description: 'Bánh ngọt nhưng giảm cân!',
    href: '#',
  };

  const imageHeight = props.imageHeight;

  const imageStyles = {
    cardNormal: {
      width: '100%',
      height: '100%',
      maxWidth: 345,
      minWidth: 320,
      transition: 'transform 0.25s ease-in-out',
    },
    cardHovered: {
      width: '100%',
      height: '100%',
      maxWidth: 345,
      minWidth: 320,
      transition: 'transform 0.4s ease-in-out',
      transform: 'scale(1.5)',
    },
  };

  const [cardHover, setCardHover] = useState(false);
  return (
    <>
      <Card
        onMouseOver={() => setCardHover(true)}
        onMouseOut={() => setCardHover(false)}
        raised={cardHover}
        sx={{ borderRadius: '16px' }}
      >
        <CardActionArea
          href={props.href ? props.href : defaultInformation.href}
        >
          <Grid container direction={'column'}>
            <Grid item width={'100%'} height={imageHeight}>
              <Box
                component={'img'}
                sx={
                  cardHover ? imageStyles.cardHovered : imageStyles.cardNormal
                }
                alt=""
                src={props.image ? props.image : defaultInformation.image}
                loading="lazy"
              />
            </Grid>
            <Grid
              item
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
                {props.name ? props.name : defaultInformation.name}
              </Typography>
              <Typography
                variant="body2"
                color={theme.palette.text.secondary}
                align="center"
              >
                {props.descripton
                  ? props.descripton
                  : defaultInformation.description}
              </Typography>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
    </>
  );
}

function TypeCake(props: any) {
  const theme = useTheme();
  const context = useContext(HomeContext);
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
            <Grid item key={i}>
              <Grid container justifyContent={'center'} alignItems={'center'}>
                <TypeCakeCard {...item} />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
//#endregion

//#region Khuyến mãi
function DangKyKhuyenMai(props: any) {
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
}
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

export default function Home() {
  const theme = useTheme();

  const [carouselImagesState, setCarouselImagesState] = useState<
    CarouselImageItem[]
  >([]);

  const [bestSellerState, setBestSellerState] =
    useState<BestSellerItem[]>(initBestSeller);

  const [typeCakeState, setTypeCakeState] =
    useState<TypeCakeItem[]>(initTypeCake);

  useEffect(() => {
    const importImages = async () => {
      const imagePaths = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];

      const images = await Promise.all(
        imagePaths.map((path) => import(`../assets/Carousel/${path}`)),
      );

      setCarouselImagesState(
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

  return (
    <>
      <HomeContext.Provider
        value={{
          carouselImages: carouselImagesState,
          bestSeller: bestSellerState,
          typeCake: typeCakeState,
        }}
      >
        <CustomCarousel height="400px" duration={500} />
        <Box sx={{ pt: 8 }}>
          <CustomCardSlider
            duration={1000}
            imageHeight="240px"
            card={CakeCard}
            title={'Best Seller'}
          />
        </Box>
        <Box sx={{ pt: 8, px: { md: 8, xs: 3 } }}>
          <TypeCake title="Đa dạng loại bánh" imageHeight="240px" />
        </Box>
        <DangKyKhuyenMai />
      </HomeContext.Provider>
    </>
  );
}
