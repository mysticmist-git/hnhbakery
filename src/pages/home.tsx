import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import Image from 'next/image';
import banh1 from '../assets/Carousel/3.jpg';
import { alpha } from '@mui/system';
import Skeleton_img from '@/components/skeleton_img';

export default function Home() {
  //#region Style
  const theme = useTheme();
  const styles = {
    text: {
      white: {
        color: theme.palette.common.white,
      },
      grey: {
        color: theme.palette.text.secondary,
      },
      black: {
        color: theme.palette.common.black,
      },
      primary: {
        color: theme.palette.secondary.main,
      },
    },
    gridDesktop: { display: { xs: 'none', lg: 'block' } },
    gridPhone: { display: { xs: 'block', lg: 'none' } },
  };
  //#endregion

  //#region Ad carousel
  function CustomCarousel(props: any) {
    const [imagePaths, setImagePaths] = useState<any[]>([]);

    useEffect(() => {
      const importImages = async () => {
        const imagePaths = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];

        const images = await Promise.all(
          imagePaths.map((path) => import(`../assets/Carousel/${path}`)),
        );

        setImagePaths(images.map((image) => image.default));
      };
      importImages();
    }, []);

    console.log(imagePaths);

    return (
      <Carousel animation="slide" duration={props.duration}>
        {imagePaths.map((image, i) => (
          <Box
            key={i}
            sx={{ height: props.height, width: '100%', position: 'relative' }}
          >
            <Box
              height={'100%'}
              width={'100%'}
              component={'img'}
              loading="lazy"
              alt=""
              src={image.src}
              sx={{ objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Carousel>
    );
  }

  //#endregion

  //#region Card Slider carousel

  function CakeCard(props: any) {
    const { image, name, descripton } = props;

    const defaultImage = banh1;
    const defaultName = 'Bánh';
    const defaultDes = 'Bánh ngon dữ lắm bà ơi';
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
        <CardActionArea>
          <Grid container direction={'column'}>
            <Grid item width={'100%'} height={imageHeight}>
              <Box
                component={'img'}
                sx={
                  cardHover ? imageStyles.cardHovered : imageStyles.cardNormal
                }
                alt=""
                src={image ? image.src : defaultImage.src}
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
                color={styles.text.black}
              >
                {name ? name : defaultName}
              </Typography>
              <Typography variant="body2" color={styles.text.grey}>
                {descripton ? descripton : defaultDes}
              </Typography>
            </Grid>
          </Grid>
        </CardActionArea>
        <CardActions
          sx={{ p: 2, bgcolor: theme.palette.common.white, zIndex: 1 }}
        >
          <Button
            sx={{ px: 2 }}
            style={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.common.white,
            }}
          >
            <Typography variant="button">Thêm vào giỏ hàng</Typography>
          </Button>
        </CardActions>
      </Card>
    );
  }
  const Products: {
    image?: string;
    name?: string;
    descripton?: string;
  }[] = [
    {
      image: '',
      name: '1',
      descripton: '',
    },
    {
      image: '',
      name: '2',
      descripton: '',
    },
    {
      image: '',
      name: '3',
      descripton: '',
    },
    {
      image: '',
      name: '4',
      descripton: '',
    },
    {
      image: '',
      name: '5',
      descripton: '',
    },
    {
      image: '',
      name: '6',
      descripton: '',
    },
    {
      image: '',
      name: '7',
      descripton: '',
    },
  ];
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
    const [products_display, setProducts_display] = useState<any[]>([]);
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
      let listColumn: { image?: string; name?: string; descripton?: string }[] =
        [];
      for (let i = 0; i < Products.length; i++) {
        listColumn.push({
          image: Products[i].image,
          name: Products[i].name,
          descripton: Products[i].descripton,
        });
        if ((i + 1) % column == 0 || i + 1 == Products.length) {
          listRow.push(listColumn);
          listColumn = [];
        }
      }
      setProducts_display(listRow);
    }, [Products, oneColumn, twoColumn, threeColumn]);

    return (
      <>
        <Typography variant="h1" color={styles.text.primary} align={'center'}>
          {props.title}
        </Typography>
        <Box>
          <Carousel animation="slide" duration={props.duration} sx={{ pt: 4 }}>
            {products_display.map((listColumn, i) => (
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
  //#endregion

  //#region đa dạng loại bánh

  function TypeCakeCard(props: any) {
    const defaultImage = banh1;
    const defaultName = 'Bánh Ngọt';
    const defaultDes = 'Bánh ngọt nhưng giảm cân!';
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
          <CardActionArea>
            <Grid container direction={'column'}>
              <Grid item width={'100%'} height={imageHeight}>
                <Box
                  component={'img'}
                  sx={
                    cardHover ? imageStyles.cardHovered : imageStyles.cardNormal
                  }
                  alt=""
                  src={props.image ? props.image : defaultImage.src}
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
                  color={styles.text.primary}
                  align="center"
                >
                  {props.name ? props.name : defaultName}
                </Typography>
                <Typography
                  variant="body2"
                  color={styles.text.grey}
                  align="center"
                >
                  {props.descripton ? props.descripton : defaultDes}
                </Typography>
              </Grid>
            </Grid>
          </CardActionArea>
        </Card>
      </>
    );
  }

  function TypeCake(props: any) {
    const Products: {
      image?: string;
      name?: string;
      descripton?: string;
    }[] = [
      {
        image: '',
        name: '',
        descripton: '',
      },
      {},
      {},
      {},
      {},
      {},
    ];

    return (
      <>
        <Typography variant="h1" color={styles.text.primary} align={'center'}>
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
            {Products.map((_item, i) => (
              <Grid item key={i}>
                <Grid container justifyContent={'center'} alignItems={'center'}>
                  <TypeCakeCard _item={{ ..._item }} />
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

  function CustomTextField(props: any) {
    return (
      <>
        <TextField
          sx={{
            borderRadius: '8px',
            width: '350px',
            bgcolor: theme.palette.common.white,
          }}
          inputProps={{
            style: {
              fontSize: theme.typography.body2.fontSize,
              color: 'black',
              fontWeight: theme.typography.body2.fontWeight,
              fontFamily: theme.typography.body2.fontFamily,
            },
          }}
          InputProps={{ disableUnderline: true }}
          hiddenLabel
          fullWidth
          placeholder="Email của bạn"
          type="email"
          variant="filled"
          maxRows="1"
        />
      </>
    );
  }

  function DangKyKhuyenMai(props: any) {
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
                Đăng ký email để nhận ưu đãi và thông tin các chương trình
                khuyến mãi
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
                  <CustomTextField />
                </Grid>
                <Grid item>
                  <Button
                    sx={{ height: '100%', borderRadius: '8px', py: 1.5, px: 3 }}
                    style={{
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.common.white,
                    }}
                    variant="contained"
                  >
                    <Typography variant="button">Đăng ký</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
  //#endregion

  return (
    <>
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
    </>
  );
}
