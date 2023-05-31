import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardActionArea,
  CardActions,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Link as MuiLink,
  MenuItem,
  Select,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import banh1 from '../assets/Carousel/3.jpg';
import bg12 from '../assets/Decorate/bg12.png';
import GridView from '@mui/icons-material/GridView';
import ListAlt from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import formatPrice from '@/utilities/formatCurrency';
import ImageBackground from '@/components/imageBackground';
import {
  getCollection,
  getCollectionWithQuery,
  getDocFromFirestore,
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore/firestoreLib';
import { Timestamp, where } from 'firebase/firestore';
import { BatchObject } from '@/lib/models/Batch';
import { CustomIconButton } from '@/components/Inputs/Buttons';
import ProductsContext, {
  BoLocItem,
  ProductItem,
  ProductsContextType,
} from '@/lib/contexts/productsContext';
import Image from 'next/image';
import { ProductTypeObject } from '@/lib/models';
import { useRouter } from 'next/router';

const DETAIL_PATH = '/product-detail';

const dateComparer = (a: Date, b: Date) => {
  if (a.valueOf() > b.valueOf()) {
    return -1;
  }
  if (a.valueOf() < b.valueOf()) {
    return 1;
  }
  return 0;
};

// #region Filter

const initGroupBoLoc = [
  {
    heading: 'Loại bánh',
    heading_value: 'typeCake',
    children: [
      { display: 'Bánh kem', value: 'id loại bánh 1', isChecked: false },
      { display: 'Bánh que', value: 'id loại bánh 2', isChecked: false },
    ],
  },
  {
    heading: 'Màu sắc',
    heading_value: 'color',
    children: [
      {
        display: 'Đỏ',
        value: '#F43545',
        realValue: 'đỏ',
        color: true,
        isChecked: false,
      },
      {
        display: 'Cam',
        value: '#FA8901',
        realValue: 'cam',
        color: true,
        isChecked: false,
      },
      {
        display: 'Vàng',
        value: '#C4A705',
        realValue: 'vàng',
        color: true,
        isChecked: false,
      },
      {
        display: 'Lục',
        value: '#00BA71',
        realValue: 'lục',
        color: true,
        isChecked: false,
      },
      {
        display: 'Lam',
        value: '#00C2DE',
        realValue: 'lam',
        color: true,
        isChecked: false,
      },
      {
        display: 'Chàm',
        value: '#00418D',
        realValue: 'chàm',
        color: true,
        isChecked: false,
      },
      {
        display: 'Tím',
        value: '#5F2879',
        realValue: 'tím',
        color: true,
        isChecked: false,
      },
    ],
  },
  {
    heading: 'Size bánh',
    heading_value: 'size',
    children: [
      { display: 'Nhỏ', value: 'nhỏ', isChecked: false },
      { display: 'Thường', value: 'vừa', isChecked: false },
      { display: 'Lớn', value: 'lớn', isChecked: false },
    ],
  },
  {
    heading: 'Giá bánh',
    heading_value: 'price',
    children: [
      { display: 'Dưới 100,000đ', value: '<100', isChecked: false },
      { display: '100,000đ - 200,000đ', value: '100-200', isChecked: false },
      { display: '200,000đ - 300,000đ', value: '200-300', isChecked: false },
      { display: '300,000đ - 400,000đ', value: '300-400', isChecked: false },
      { display: 'Trên 500,000đ', value: '>500', isChecked: false },
    ],
  },
];

const CustomAccordion = memo((props: any) => {
  const context = useContext(ProductsContext);
  const theme = useTheme();

  const head_Information = useMemo(
    () => props.head_Information,
    [props.head_Information]
  );

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
        expandIcon={
          <ExpandMoreIcon sx={{ color: theme.palette.common.white }} />
        }
      >
        <Typography variant="button" color={theme.palette.common.white}>
          {head_Information.heading}
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
          {head_Information.children.map(
            (item: any, i: React.Key | null | undefined) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    sx={{ color: theme.palette.secondary.main }}
                    color="secondary"
                    checked={item.isChecked}
                    onChange={() =>
                      context.handleCheckBox(
                        head_Information.heading_value,
                        item.value
                      )
                    }
                  />
                }
                label={
                  <Typography
                    variant="button"
                    color={
                      item.color
                        ? theme.palette.common.white
                        : theme.palette.common.black
                    }
                    sx={{
                      px: item.color ? 1 : 0,
                      background: item.color ? item.value : 'transparent',
                      borderRadius: '4px',
                      width: '100%',
                    }}
                  >
                    {item.display}
                  </Typography>
                }
              />
            )
          )}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
});

const Filter = memo((props: any) => {
  const context = useContext(ProductsContext);
  return (
    <>
      <Grid container spacing={2} justifyContent={'space-between'}>
        {context.GroupBoLoc.map((item, i) => (
          <Grid key={i} item width={{ md: '100%', sm: '49%', xs: '100%' }}>
            <CustomAccordion head_Information={item} />
          </Grid>
        ))}
      </Grid>
    </>
  );
});

// #endregion

// #region View
const TypeView = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(ProductsContext);

  const buttonStyles = useMemo(
    () => ({
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
    }),
    []
  );

  const ListTypeSort = useMemo(() => {
    return [
      {
        value: 'grid',
        Icon: (
          <GridView
            sx={
              context.View == 'grid' ? buttonStyles.fill : buttonStyles.nonFill
            }
          />
        ),
      },
      {
        value: 'list',
        Icon: (
          <ListAlt
            sx={
              context.View == 'list' ? buttonStyles.fill : buttonStyles.nonFill
            }
          />
        ),
      },
    ];
  }, [context.View, buttonStyles]);

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
          <Typography variant="body2" color={theme.palette.common.black}>
            Xem dưới dạng:
          </Typography>
        </Grid>

        <Grid item>
          {ListTypeSort.map((item, i) => (
            <CustomIconButton
              key={i}
              onClick={() => context.handleSetViewState(item.value)}
            >
              {item.Icon}
            </CustomIconButton>
          ))}
        </Grid>
      </Grid>
    </>
  );
});
// #endregion

// #region Sort
interface SortListItem {
  display: string;
  value: string;
}

const initSortList = {
  value: '0',
  options: [
    { display: 'Mặc định', value: '0' },
    { display: 'Giá tăng dần', value: '1' },
    { display: 'Giá giảm dần', value: '2' },
    { display: 'A - Z', value: '3' },
    { display: 'Z - A', value: '4' },
    { display: 'Cũ nhất', value: '5' },
    { display: 'Mới nhất', value: '6' },
    { display: 'Bán chạy nhất', value: '7' },
  ],
};

const TypeSort = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(ProductsContext);
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
          <Typography variant="body2" color={theme.palette.common.black}>
            Sắp xếp:
          </Typography>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <Select
              value={context.SortList.value}
              onChange={(e) => context.handleSetSortList(e.target.value)}
              defaultValue={context.SortList.value}
              sx={{
                '& .MuiSvgIcon-root': {
                  color: theme.palette.common.white,
                },
                color: theme.palette.common.white,
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
                    color: theme.palette.common.black,
                    '& .MuiMenuItem-root.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                    },
                    '& .MuiMenuItem-root:hover': {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.common.white,
                    },
                    '& .MuiMenuItem-root.Mui-selected:hover': {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.common.white,
                    },
                  },
                },
              }}
            >
              {context.SortList.options.map((item: SortListItem, i: number) => (
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
});
//#endregion

// #region Products

// const initProductList: ProductItem[] = [
//   {
//     id: '1',
//     image: banh1.src,
//     name: 'Product 1',
//     price: 250000, // 250,000 VND
//     description: 'This is product 1',
//     href: 'https://example.com/product1',
//   },
//   {
//     id: '2',
//     image: banh1.src,
//     name: 'Product 1',
//     price: 250000, // 250,000 VND
//     description: 'This is product 1',
//     href: 'https://example.com/product1',
//   },
//   {
//     id: '3',
//     image: banh1.src,
//     name: 'Product 1',
//     price: 250000, // 250,000 VND
//     description: 'This is product 1',
//     href: 'https://example.com/product1',
//   },
// ];

const productDefault: ProductItem = {
  id: '1',
  image: banh1.src,
  name: 'Bánh Quy',
  price: 100000,
  sizes: ['nhỏ', 'lớn'],
  colors: ['đỏ, vàng'],
  MFG: new Date(),
  description: 'Bánh ngon dữ lắm bà ơi',
  totalSoldQuantity: 15,
  productType_id: '0',
  href: '#',
};

const CakeCard = memo((props: any) => {
  // #region States

  const [cardHover, setCardHover] = useState(false);

  // #endregion

  // #region Hooks

  const theme = useTheme();
  const context = useContext(ProductsContext);

  // #endregion

  // #region useEffects

  // #endregion

  const isList = useMemo(() => context.View === 'list', [context.View]);
  const imageHeight = useMemo(() => props.imageHeight, [props.imageHeight]);
  const imageHeightList = useMemo(
    () => props.imageHeightList,
    [props.imageHeightList]
  );
  const imageStyles = {
    cardNormal: {
      width: '100%',
      height: '100%',
      transition: 'transform 0.25s ease-in-out',
      objectFit: 'cover',
    },
    cardHovered: {
      width: '100%',
      height: '100%',
      transition: 'transform 0.4s ease-in-out',
      transform: 'scale(1.3)',
      objectFit: 'cover',
    },
  };

  return (
    <Card
      onMouseOver={() => setCardHover(true)}
      onMouseOut={() => setCardHover(false)}
      raised={cardHover}
      sx={{
        borderRadius: '16px',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        width: '100%',
        height: 'auto',
      }}
    >
      <CardActionArea
        LinkComponent={Link}
        href={props.href ? props.href : productDefault.href}
        sx={{
          width: isList ? '50%' : '100%',
          height: isList ? imageHeightList : imageHeight,
        }}
      >
        <Box
          fill={true}
          component={Image}
          sx={cardHover ? imageStyles.cardHovered : imageStyles.cardNormal}
          alt=""
          src={props.image ? props.image : productDefault.image}
          loading="lazy"
        />
      </CardActionArea>
      <CardActions
        sx={{
          p: 0,
          bgcolor: theme.palette.common.white,
          zIndex: 1,
          width: isList ? '50%' : '100%',
          height: 'auto',
          maxHeight: isList ? imageHeightList : imageHeight,
        }}
      >
        <Grid
          container
          direction={isList ? 'column' : 'row'}
          justifyContent={'space-between'}
          alignItems={isList ? 'start' : 'center'}
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
              spacing={1}
              sx={{
                height: '100%',
              }}
            >
              <Grid item>
                <Typography variant="body1" color={theme.palette.common.black}>
                  {props.name ? props.name : productDefault.name}
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                  display={isList ? 'block' : 'none'}
                  sx={{
                    maxHeight: '10vh',
                    whiteSpace: 'normal',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    fontWeight: 'medium',
                  }}
                >
                  {props.description
                    ? props.description
                    : productDefault.description}
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
                    <Typography
                      variant="body2"
                      color={theme.palette.text.secondary}
                    >
                      Giá:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={theme.palette.secondary.main}
                    >
                      {props.price
                        ? formatPrice(props.price)
                        : formatPrice(productDefault.price)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Box
              sx={{
                bgcolor: theme.palette.secondary.main,
                borderRadius: '8px',
              }}
            >
              <CustomIconButton>
                <ShoppingCartIcon
                  sx={{
                    color: theme.palette.common.white,
                    display: isList ? 'none' : 'block',
                  }}
                />
                <Typography
                  variant="body2"
                  color={theme.palette.common.white}
                  display={isList ? 'block' : 'none'}
                  sx={{
                    px: 0.5,
                  }}
                >
                  Thêm vào giỏ hàng
                </Typography>
              </CustomIconButton>
            </Box>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
});

const ProductList = memo((props: any) => {
  //#region Hooks

  const theme = useTheme();
  const context = useContext<ProductsContextType>(ProductsContext);

  //#endregion

  //#region UseEffects

  //#endregion

  //#region useMemo

  const imageHeight = useMemo(
    () => props.imageHeight ?? '20vh',
    [props.imageHeight]
  );

  const imageHeightList = useMemo(
    () => props.imageHeightList ?? '30vh',
    [props.imageHeightList]
  );

  const displayProducts: ProductItem[] = useMemo(() => {
    const filteredProductList = filterProductList(context.ProductList);
    const sortedProductList = sortProductList(filteredProductList);
    const searchResultProductList = searchProductList(
      sortedProductList,
      context.searchText
    );

    return searchResultProductList;
  }, [
    context.ProductList,
    context.SortList,
    context.GroupBoLoc,
    context.searchText,
  ]);

  //#endregion

  //#region Functions

  function sortProductList(productList: ProductItem[]): ProductItem[] {
    const choosenSort: string = context.SortList.value;

    switch (choosenSort) {
      // Mặc định
      case '0':
        console.log('Option raised');
        return [...productList];
      // Giá tăng dần
      case '1':
        console.log('Option raised');
        return [...productList].sort((a, b) => a.price - b.price);
      // Giá giảm dần
      case '2':
        console.log('Option raised');
        return [...productList].sort((a, b) => b.price - a.price);
      // A - Z
      case '3':
        console.log('Option raised');
        return [...productList].sort((a, b) => a.name.localeCompare(b.name));
      // Z - A
      case '4':
        console.log('Option raised');
        return [...productList].sort((a, b) => b.name.localeCompare(a.name));
      // Cũ nhất
      case '5':
        console.log('Option raised');
        return [...productList].sort((a, b) => {
          return dateComparer(a.MFG, b.MFG);
        });
      // Mới nhất
      case '6':
        console.log('Option raised');
        return [...productList].sort((a, b) => {
          return dateComparer(b.MFG, a.MFG);
        });
      // Bán chạy nhất
      case '7':
        console.log('Option raised');
        return [...productList].sort(
          (a, b) => b.totalSoldQuantity - a.totalSoldQuantity
        );
      default:
        console.log('Option raised');
        return [...productList];
    }
  }

  function filterProductList(productList: ProductItem[]): ProductItem[] {
    //#region Local Functions

    function filterProductType(productList: ProductItem[]): ProductItem[] {
      const productTypeFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'typeCake'
      );

      const productTypeIdChecked = productTypeFilter?.children
        .filter((item) => item.isChecked)
        .map((item) => item.value);

      if (productTypeIdChecked?.length === 0) return [...productList];

      const productTypeFilteredResult = [
        ...productList.filter((product) => {
          return productTypeIdChecked?.includes(product.productType_id);
        }),
      ];

      return productTypeFilteredResult;
    }

    function filterColor(productList: ProductItem[]): ProductItem[] {
      const colorFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'color'
      );

      if (!colorFilter) return [...productList];

      const colorChecks = colorFilter.children
        .filter((item) => item.isChecked)
        .map((item) => item.realValue);

      if (colorChecks.length === 0) return [...productList];

      return [
        ...productList.filter((product) => {
          for (const color of product.colors) {
            if (colorChecks.includes(color)) {
              return true;
            }
          }
          return false;
        }),
      ];
    }

    function filterSize(productList: ProductItem[]): ProductItem[] {
      // Get size filter
      const sizeFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'size'
      );

      if (!sizeFilter) return [...productList];

      const sizeChecks = sizeFilter.children
        .filter((item) => item.isChecked)
        .map((item) => item.value);

      if (sizeChecks.length === 0) return [...productList];

      return [
        ...productList.filter((product) => {
          for (const size of sizeChecks) {
            if (!product.sizes.includes(size)) {
              return false;
            }
          }
          return true;
        }),
      ];
    }

    function filterPrice(productList: ProductItem[]): ProductItem[] {
      // Get price range
      const priceFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'price'
      );

      if (!priceFilter) return [...productList];

      const priceRanges = filterPriceRange(priceFilter);

      if (priceRanges.length === 0) return [...productList];

      return filterProductListBaseOnPriceRanges(productList, priceRanges);

      //#region Local Functions

      interface PriceRange {
        min: number | 'infinity';
        max: number | 'infinity';
      }

      function filterPriceRange(priceFilter: BoLocItem): PriceRange[] {
        const priceRanges: PriceRange[] = [];

        for (const filter of priceFilter.children) {
          if (filter.isChecked) {
            priceRanges.push(processPriceRange(filter.value));
          }
        }

        return priceRanges;
      }

      function processPriceRange(priceRangeValue: string): PriceRange {
        if (priceRangeValue === '<100') {
          return {
            min: 0,
            max: 100000,
          };
        } else if (priceRangeValue === '100-200') {
          return {
            min: 100000,
            max: 200000,
          };
        } else if (priceRangeValue === '200-300') {
          return {
            min: 200000,
            max: 300000,
          };
        } else if (priceRangeValue === '300-400') {
          return {
            min: 300000,
            max: 400000,
          };
        } else if (priceRangeValue === '>500') {
          return {
            min: 500000,
            max: Infinity,
          };
        } else {
          throw new Error('Invalid price range value');
        }
      }

      function filterProductListBaseOnPriceRanges(
        productList: ProductItem[],
        priceRanges: PriceRange[]
      ): ProductItem[] {
        return productList.filter((product) => {
          return priceRanges.some((range) => {
            const minInRange = range.min === 'infinity' ? -Infinity : range.min;
            const maxInRange = range.max === 'infinity' ? Infinity : range.max;
            return product.price >= minInRange && product.price <= maxInRange;
          });
        });
      }

      //#endregion
    }

    //#endregion

    let filteredProductList: ProductItem[] = productList;

    // Filter Color
    filteredProductList = filterColor(filteredProductList);

    // Filter Size
    filteredProductList = filterSize(filteredProductList);

    // Filter Price
    filteredProductList = filterPrice(filteredProductList);

    filteredProductList = filterProductType(filteredProductList);

    return filteredProductList;
  }
  function removeAccents(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  function searchProductList(productList: ProductItem[], searchText: string) {
    return productList.filter((product) => {
      return removeAccents(product.name.toLowerCase()).includes(
        searchText.toLowerCase()
      );
    });
  }

  //#endregion

  return (
    <>
      <Grid
        container
        direction={'row'}
        justifyContent={'flex-start'}
        alignItems={'start'}
        spacing={{ md: 2, xs: 3 }}
      >
        {displayProducts.map((item, i) => (
          <Grid
            item
            key={i}
            xs={context.View != 'grid' ? 12 : 12}
            sm={context.View != 'grid' ? 12 : 6}
            md={context.View != 'grid' ? 12 : 6}
            lg={context.View != 'grid' ? 12 : 4}
          >
            <CakeCard
              {...item}
              imageHeight={imageHeight}
              imageHeightList={imageHeightList}
            />
          </Grid>
        ))}
        {displayProducts.length <= 0 && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Typography variant="h2">Không tìm thấy sản phẩm nào</Typography>
          </Box>
        )}
      </Grid>
    </>
  );
});

//#endregion

const Products = ({
  products,
  productTypesNamesAndIds: stringifiedProductTypesNamesAndIds,
}: {
  products: string;
  productTypesNamesAndIds: string;
}) => {
  //#region Hooks

  const theme = useTheme();
  const router = useRouter();

  // #endregion

  // #region functions

  const generateGroupBoLoc = (stringifiedProductTypesNamesAndIds: string) => {
    const productTypesNamesAndIds: { id: string; name: string }[] = JSON.parse(
      stringifiedProductTypesNamesAndIds
    );

    let children = productTypesNamesAndIds.map((productType) => ({
      display: productType.name,
      value: productType.id,
      isChecked: false,
    }));

    // This is to handle if a product type is selected from the index.tsx page
    const initialProductTypeCheckk = router.query.product_type;

    children = children.map((item) => {
      if (item.value === initialProductTypeCheckk) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      } else {
        return { ...item };
      }
    });

    const productTypeFilter = {
      heading: 'Loại bánh',
      heading_value: 'typeCake',
      children: children,
    };

    return [
      productTypeFilter,
      {
        heading: 'Màu sắc',
        heading_value: 'color',
        children: [
          {
            display: 'Đỏ',
            value: '#F43545',
            realValue: 'đỏ',
            color: true,
            isChecked: false,
          },
          {
            display: 'Cam',
            value: '#FA8901',
            realValue: 'cam',
            color: true,
            isChecked: false,
          },
          {
            display: 'Vàng',
            value: '#C4A705',
            realValue: 'vàng',
            color: true,
            isChecked: false,
          },
          {
            display: 'Lục',
            value: '#00BA71',
            realValue: 'lục',
            color: true,
            isChecked: false,
          },
          {
            display: 'Lam',
            value: '#00C2DE',
            realValue: 'lam',
            color: true,
            isChecked: false,
          },
          {
            display: 'Chàm',
            value: '#00418D',
            realValue: 'chàm',
            color: true,
            isChecked: false,
          },
          {
            display: 'Tím',
            value: '#5F2879',
            realValue: 'tím',
            color: true,
            isChecked: false,
          },
        ],
      },
      {
        heading: 'Size bánh',
        heading_value: 'size',
        children: [
          { display: 'Nhỏ', value: 'nhỏ', isChecked: false },
          { display: 'Thường', value: 'vừa', isChecked: false },
          { display: 'Lớn', value: 'lớn', isChecked: false },
        ],
      },
      {
        heading: 'Giá bánh',
        heading_value: 'price',
        children: [
          { display: 'Dưới 100,000đ', value: '<100', isChecked: false },
          {
            display: '100,000đ - 200,000đ',
            value: '100-200',
            isChecked: false,
          },
          {
            display: '200,000đ - 300,000đ',
            value: '200-300',
            isChecked: false,
          },
          {
            display: '300,000đ - 400,000đ',
            value: '300-400',
            isChecked: false,
          },
          { display: 'Trên 500,000đ', value: '>500', isChecked: false },
        ],
      },
    ];
  };

  // #endregion

  //#region States

  const [groupBoLocState, setGroupBoLocState] = useState<BoLocItem[]>(
    generateGroupBoLoc(stringifiedProductTypesNamesAndIds)
  );
  const [viewState, setViewState] = useState<'grid' | 'list'>('grid');
  const [sortListState, setSortListState] = useState<any>(initSortList);
  const [searchText, setSearchText] = useState('');

  //#endregion

  // #region useMemos

  const productListState: ProductItem[] = useMemo(
    () => JSON.parse(products),
    [products]
  );

  // #endregion

  //#region Handlers

  function handdleCheckBox(heading_value: string, value: string) {
    setGroupBoLocState((currentGroupBoLocState) =>
      currentGroupBoLocState.map((item) => {
        if (item.heading_value === heading_value) {
          return {
            ...item,
            children: item.children.map((child) => {
              if (child.value === value) {
                return {
                  ...child,
                  isChecked: !child.isChecked,
                };
              }
              return child;
            }),
          };
        }
        return item;
      })
    );
  }

  function handleSetViewState(value: 'grid' | 'list') {
    setViewState(() => value);
  }

  function handleSetSortList(value: any) {
    setSortListState((currentSortListState: any) => ({
      ...currentSortListState,
      value: value,
    }));
  }

  function handleChangeSearch(e: any) {
    setSearchText(() => e.target.value);
  }

  //#endregion

  // #region scroll

  const handleClick = () => {
    const top: number = 280;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  //#endregion

  return (
    <>
      <ProductsContext.Provider
        value={{
          GroupBoLoc: groupBoLocState,
          handleCheckBox: handdleCheckBox,
          View: viewState,
          handleSetViewState: handleSetViewState,
          SortList: sortListState,
          handleSetSortList: handleSetSortList,
          ProductList: productListState,
          searchText: searchText,
        }}
      >
        <Box>
          <ImageBackground>
            <Grid
              sx={{ px: 6 }}
              height={'100%'}
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              spacing={2}
            >
              <Grid item xs={12}>
                <MuiLink href="#" style={{ textDecoration: 'none' }}>
                  <Typography
                    align="center"
                    variant="h2"
                    color={theme.palette.primary.main}
                    sx={{
                      '&:hover': {
                        color: theme.palette.common.white,
                      },
                    }}
                  >
                    Tất cả sản phẩm
                  </Typography>
                </MuiLink>
              </Grid>
            </Grid>
          </ImageBackground>

          <Box sx={{ pt: 4, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'start'}
              spacing={4}
            >
              <Grid item xs={12}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'center'}
                  alignItems={'start'}
                >
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundImage: `url(${bg12.src})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: 'auto',
                        height: 'auto',
                      }}
                    >
                      <TextField
                        placeholder="Tìm kiếm loại bánh ngon nhất?"
                        hiddenLabel
                        fullWidth
                        type="text"
                        autoFocus
                        variant="filled"
                        maxRows="1"
                        value={searchText}
                        onChange={handleChangeSearch}
                        onClick={handleClick}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            color: theme.palette.common.black,
                          },
                        }}
                        inputProps={{
                          sx: {
                            textAlign: 'center',
                            fontSize: theme.typography.body1.fontSize,
                            color: theme.palette.common.black,
                            fontWeight: theme.typography.body2.fontWeight,
                            fontFamily: theme.typography.body2.fontFamily,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.2
                            ),
                            backdropFilter: 'blur(2px)',
                            border: 3,
                            borderColor: theme.palette.secondary.main,
                            py: 1.5,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: alpha(
                                theme.palette.common.black,
                                0.75
                              ),
                              color: theme.palette.common.white,
                              backdropFilter: 'blur(3px)',
                            },
                            '&:focus': {
                              backgroundColor: alpha(
                                theme.palette.common.black,
                                0.75
                              ),
                              color: theme.palette.common.white,
                              backdropFilter: 'blur(3px)',
                            },
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

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
                  </Grid>

                  <Grid item xs={12}>
                    <ProductList
                      imageHeight={'20vh'}
                      imageHeightList={'30vh'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ProductsContext.Provider>
    </>
  );
};

//#region Local Functions

async function fetchAvailableBatches(): Promise<BatchObject[]> {
  try {
    let batches = await getCollectionWithQuery<BatchObject>(
      'batches',
      where('EXP', '>=', Timestamp.now())
    );

    batches = batches.filter(
      (batch) => batch.soldQuantity < batch.totalQuantity
    );

    return batches;
  } catch (error) {
    console.log('Error at fetchAvailableBatches:', error);
    return [];
  }
}

interface LowestPriceAndItsMFGProductId {
  id: string;
  price: number;
  MFG: Date;
}

async function fetchLowestPriceAndMFGBatchProductIds(
  batches: BatchObject[]
): Promise<LowestPriceAndItsMFGProductId[]> {
  try {
    const groupedBatches = batches.reduce((acc: any, batch: BatchObject) => {
      if (!acc[batch.product_id]) {
        acc[batch.product_id] = [];
      }
      acc[batch.product_id].push({ price: batch.price, MFG: batch.MFG });
      return acc;
    }, {});

    const lowestPrices: LowestPriceAndItsMFGProductId[] = Object.keys(
      groupedBatches
    ).map((product_id) => {
      const pricesAndMFGs = groupedBatches[product_id];
      const priceAndMFGThatHasTheLowestPrice = pricesAndMFGs.find(
        (priceAndMFG: any) => priceAndMFG.price === pricesAndMFGs[0].price
      );
      // const lowestPrice = Math.min(...pricesAndMFGs.map((priceAndMFG) => priceAndMFG.price));
      return {
        id: product_id,
        price: priceAndMFGThatHasTheLowestPrice.price,
        MFG: priceAndMFGThatHasTheLowestPrice.MFG,
      };
    });

    return lowestPrices;
  } catch (error) {
    console.log('Error at fetchLowestPriceBatchProductIds:', error);
    return [];
  }
}

async function getTotalSoldQuantity(productId: string): Promise<number> {
  const batches = await getCollectionWithQuery<BatchObject>(
    'batches',
    where('product_id', '==', productId)
  );

  const totalSoldQuantity: number = batches.reduce((acc, batch) => {
    return acc + batch.soldQuantity;
  }, 0);

  return totalSoldQuantity;
}

async function fetchProductTypesWithLowestPrices(
  lowestPricesAndTheirMFGs: LowestPriceAndItsMFGProductId[]
): Promise<ProductItem[]> {
  try {
    const products = await Promise.all(
      lowestPricesAndTheirMFGs.map(async ({ id, price, MFG }) => {
        const productData = await getDocFromFirestore('products', id);

        return {
          id: productData.id,
          name: productData.name,
          description: productData.description,
          price: price,
          MFG: MFG,
          image: await getDownloadUrlFromFirebaseStorage(productData.images[0]),
          href: `${DETAIL_PATH}?id=${productData.id}`,
          totalSoldQuantity: await getTotalSoldQuantity(productData.id),
          colors: productData.colors,
          productType_id: productData.productType_id,
        } as ProductItem;
      })
    );

    return products;
  } catch (error) {
    console.log('Error at fetchProductTypesWithLowestPrices:', error);
    return [];
  }
}

//#endregion

export async function getStaticProps() {
  const batches = await fetchAvailableBatches();

  const lowestPricesAndTheirMFGs = await fetchLowestPriceAndMFGBatchProductIds(
    batches
  );

  const fetchedProducts = await fetchProductTypesWithLowestPrices(
    lowestPricesAndTheirMFGs
  );

  const productTypes = await getCollection<ProductTypeObject>('productTypes');
  const productTypesNamesAndIds = productTypes.map((productType) => {
    return {
      name: productType.name,
      id: productType.id,
    };
  });

  const products = fetchedProducts.map((product) => {
    const productBatches: BatchObject[] = batches.filter(
      (batch) => batch.product_id === product.id
    );

    const sizes = productBatches.map((batch) => batch.size);

    return {
      ...product,
      sizes: sizes.filter(function (item, pos) {
        return sizes.indexOf(item) == pos;
      }),
    };
  });

  return {
    props: {
      products: JSON.stringify(products),
      productTypesNamesAndIds: JSON.stringify(productTypesNamesAndIds),
    },
  };
}

export default memo(Products);
