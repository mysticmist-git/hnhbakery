import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import GridView from '@mui/icons-material/GridView';
import ListAlt from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import banh1 from '../assets/Carousel/3.jpg';

export default function Products() {
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

  //#region Bộ lọc

  function CustomAccordion(props: any) {
    const heading = props.boloc.heading;
    const children = props.boloc.children;
    return (
      <Accordion
        sx={{
          '&.MuiPaper-root': {
            backgroundColor: 'transparent',
            borderRadius: '8px',
            boxShadow: 'none',
          },
          width: '100%',
        }}
        disableGutters
        defaultExpanded
      >
        <AccordionSummary
          sx={{
            bgcolor: theme.palette.secondary.main,
            borderRadius: '8px 8px 0px 0px',
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: styles.text.white }} />}
        >
          <Typography variant="button" color={styles.text.white}>
            {heading}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            bgcolor: theme.palette.common.white,
            border: 3,
            borderTop: 0,
            borderColor: theme.palette.secondary.main,
            borderRadius: '0 0 8px 8px',
          }}
        >
          <FormGroup>
            {children.map((item: any, i: React.Key | null | undefined) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    sx={{ color: theme.palette.secondary.main }}
                    color="secondary"
                  />
                }
                label={
                  <Typography
                    style={{
                      backgroundColor: item.color ? item.value : 'transparent',
                    }}
                    variant="button"
                    color={item.color ? styles.text.white : styles.text.black}
                    sx={{ px: item.color ? 1 : 0 }}
                  >
                    {item.display}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    );
  }

  function Filter(props: any) {
    const GroupBoLoc = [
      {
        heading: 'Thương hiệu',
        children: [
          { display: 'Bbang House', value: 'bbang' },
          { display: 'Khiết Minh', value: 'km' },
        ],
      },
      {
        heading: 'Màu sắc',

        children: [
          { display: 'Đỏ', value: 'red', color: true },
          { display: 'Xanh lá', value: 'green', color: true },
          { display: 'Xanh dương', value: 'blue', color: true },
        ],
      },
      {
        heading: 'Size bánh',
        children: [
          { display: 'Nhỏ', value: 'small' },
          { display: 'Thường', value: 'medium' },
          { display: 'Lớn', value: 'big' },
        ],
      },
      {
        heading: 'Giá bánh',
        children: [
          { display: 'Dưới 100,000đ', value: '< 100000' },
          { display: '100,000đ - 200,000đ', value: '' },
          { display: '200,000đ - 300,000đ', value: '' },
          { display: '300,000đ - 400,000đ', value: '' },
          { display: 'Trên 500,000đ', value: '' },
        ],
      },
    ];

    return (
      <>
        <Grid container spacing={2} justifyContent={'space-between'}>
          {GroupBoLoc.map((boLoc, i) => (
            <Grid item width={{ md: '100%', sm: '49%', xs: '100%' }}>
              <CustomAccordion key={i} boloc={{ ...boLoc }} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
  //#endregion

  //#region View và Sort
  const [View, setView] = useState('GridView');
  const buttonStyles = {
    nonFill: {
      bgcolor: theme.palette.common.black,
      color: theme.palette.common.white,
      borderRadius: '4px',
    },
    fill: {
      bgcolor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      borderRadius: '4px',
    },
  };
  const ListTypeSort = [
    {
      value: 'GridView',
      Icon: (
        <GridView
          sx={View == 'GridView' ? buttonStyles.fill : buttonStyles.nonFill}
        />
      ),
    },
    {
      value: 'ListView',
      Icon: (
        <ListAlt
          sx={View == 'ListView' ? buttonStyles.fill : buttonStyles.nonFill}
        />
      ),
    },
  ];

  function TypeView(props: any) {
    return (
      <>
        <Grid
          container
          direction={'row'}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2" color={styles.text.black}>
              Xem dưới dạng:
            </Typography>
          </Grid>

          <Grid item>
            {ListTypeSort.map((item, i) => (
              <IconButton key={i} onClick={() => setView(item.value)}>
                {item.Icon}
              </IconButton>
            ))}
          </Grid>
        </Grid>
      </>
    );
  }

  const SortList = [
    { display: 'Mặc định', value: '0' },
    { display: 'Giá tăng dần', value: '1' },
    { display: 'Giá giảm dần', value: '2' },
    { display: 'A - Z', value: '3' },
    { display: 'Z - A', value: '4' },
    { display: 'Cũ nhất', value: '5' },
    { display: 'Mới nhất', value: '6' },
    { display: 'Bán chạy nhất', value: '7' },
  ];

  const [typeSort, setTypeSort] = React.useState(SortList[0].value);
  function TypeSort(props: any) {
    const handleSetTypeSort = (event: SelectChangeEvent) => {
      setTypeSort(event.target.value as string);
    };

    return (
      <>
        <Grid
          container
          direction={'row'}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2" color={styles.text.black}>
              Sắp xếp:
            </Typography>
          </Grid>
          <Grid item>
            <FormControl size="small">
              <Select
                value={typeSort}
                onChange={handleSetTypeSort}
                defaultValue={SortList[0].value}
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: styles.text.white,
                  },
                  fontFamily: theme.typography.body2.fontFamily,
                  fontSize: theme.typography.body2.fontSize,
                  fontWeight: theme.typography.body2.fontWeight,
                  minWidth: 180,
                  bgcolor: theme.palette.secondary.main,
                  borderRadius: '8px',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: styles.text.black,
                      '& .MuiMenuItem-root.Mui-selected': {
                        bgcolor: theme.palette.primary.main,
                      },
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: theme.palette.secondary.main,
                        color: styles.text.white,
                      },
                      '& .MuiMenuItem-root.Mui-selected:hover': {
                        backgroundColor: theme.palette.secondary.main,
                        color: styles.text.white,
                      },
                    },
                  },
                }}
              >
                {SortList.map((item, i) => (
                  <MenuItem
                    key={i}
                    value={item.value}
                    sx={{
                      fontFamily: theme.typography.body2.fontFamily,
                      fontSize: theme.typography.body2.fontSize,
                      fontWeight: theme.typography.body2.fontWeight,
                    }}
                  >
                    {item.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </>
    );
  }

  function View_Sort(props: any) {
    return (
      <>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item width={{ sm: 'auto', xs: '100%' }}>
            <TypeView />
          </Grid>
          <Grid item width={{ sm: 'auto', xs: '100%' }}>
            <TypeSort />
          </Grid>
        </Grid>
      </>
    );
  }
  //#endregion

  //#region Products
  function CakeCard(props: any) {
    const { image, name, descripton, href, price, view } = props;

    const defaultImage = banh1;
    const defaultName = 'Bánh Quy';
    const defaultDes = 'Bánh ngon dữ lắm bà ơi';
    const defaultHref = '#';
    const defaultPrice = '100.000đ';
    const imageHeight = props.imageHeight;

    const imageStyles = {
      cardNormal: {
        width: '100%',
        height: '100%',
        transition: 'transform 0.25s ease-in-out',
      },
      cardHovered: {
        width: '100%',
        height: '100%',
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
        sx={{
          borderRadius: '16px',
          display: 'flex',
          flexDirection: view != ListTypeSort[0].value ? 'row' : 'column',
        }}
      >
        <CardActionArea
          sx={{ width: view != ListTypeSort[0].value ? '50%' : '100%' }}
        >
          <Box
            height={imageHeight}
            component={'img'}
            sx={cardHover ? imageStyles.cardHovered : imageStyles.cardNormal}
            alt=""
            src={image ? image.src : defaultImage.src}
            loading="lazy"
          />
        </CardActionArea>
        <CardActions
          sx={{
            p: 0,
            bgcolor: theme.palette.common.white,
            zIndex: 1,
            width: view != ListTypeSort[0].value ? '50%' : '100%',
            height: 'auto',
          }}
        >
          <Grid
            container
            direction={view != ListTypeSort[0].value ? 'column' : 'row'}
            justifyContent={'space-between'}
            alignItems={view != ListTypeSort[0].value ? 'start' : 'center'}
            sx={{
              p: 2,
              zIndex: 1,
              width: '100%',
              height: 'auto',
            }}
            spacing={1}
          >
            <Grid item>
              <Grid
                container
                direction={'column'}
                justifyContent={'space-between'}
                alignItems={'start'}
                sx={{
                  height: '100%',
                }}
              >
                <Grid item>
                  <Typography variant="body1" color={styles.text.black}>
                    {name ? name : defaultName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={styles.text.grey}
                    display={view != ListTypeSort[0].value ? 'block' : 'none'}
                  >
                    {descripton ? descripton : defaultDes}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    direction={'row'}
                    spacing={1}
                  >
                    <Grid item>
                      <Typography variant="body2" color={styles.text.grey}>
                        Giá:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="button" color={styles.text.primary}>
                        {price ? price : defaultPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton
                style={{
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: '8px',
                }}
                sx={{
                  width: '100%',
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    color: theme.palette.common.white,
                    display: view != ListTypeSort[0].value ? 'none' : 'block',
                  }}
                />
                <Typography
                  variant="body2"
                  color={styles.text.white}
                  display={view != ListTypeSort[0].value ? 'block' : 'none'}
                  sx={{ px: 0.5 }}
                >
                  Thêm vào giỏ hàng
                </Typography>
              </IconButton>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }

  function Products(props: any) {
    const imageHeight = props.imageHeight ? props.imageHeight : '240px';
    const ListProduct = [
      {
        image: banh1,
        name: 'Bánh',
        price: '100.000đ',
        href: '',
        descripton: 'Bánh ngon dữ lắm bà ơi',
      },
      {},
      {},
      {},
      {},
      {},
    ];

    return (
      <>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'start'}
          spacing={{ md: 2, xs: 3 }}
        >
          {ListProduct.map((item, i) => (
            <Grid
              item
              key={i}
              sx={{
                width:
                  View != ListTypeSort[0].value
                    ? '100%'
                    : { md: '33.33%', sm: '50%', xs: '100%' },
              }}
            >
              <CakeCard {...item} imageHeight={imageHeight} view={View} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
  //#endregion

  return (
    <>
      <Box>
        <Box
          sx={{
            width: '100%',
            height: '320px',
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
                <a href="#">
                  <Typography
                    align="center"
                    variant="h1"
                    color={theme.palette.primary.main}
                    sx={{
                      '&:hover': {
                        color: theme.palette.common.white,
                      },
                    }}
                  >
                    Tất cả sản phẩm
                  </Typography>
                </a>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ pt: 8, px: { md: 8, xs: 3 } }}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'start'}
            spacing={4}
          >
            <Grid item md={3} xs={12}>
              <Filter />
            </Grid>
            <Grid item md={9} xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
                spacing={2}
              >
                <Grid item xs={12}>
                  <View_Sort />
                </Grid>

                <Grid item xs={12}>
                  <Products imageHeight={'240px'} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
