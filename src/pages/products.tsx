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
  Link,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import React, { createContext, useContext, useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import banh1 from '../assets/Carousel/3.jpg';
import GridView from '@mui/icons-material/GridView';
import ListAlt from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import formatPrice from '@/utilities/formatCurrency';
import ImageBackground from '@/components/imageBackground';
import CustomIconButton from '@/components/Inputs/Buttons/CustomIconButton';
import {
  getCollection,
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore/firestoreLib';
import { ProductObject } from '@/lib/models';
import { db } from '@/firebase/config';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { BatchObject } from '@/lib/models/Batch';

// #region Filter
interface BoLocItem {
  heading: string;
  heading_value: string;
  children: {
    display: string;
    value: string;
    color?: boolean;
    isChecked: boolean;
  }[];
}

const initGroupBoLoc = [
  {
    heading: 'Màu sắc',
    heading_value: 'color',
    children: [
      { display: 'Đỏ', value: 'red', color: true, isChecked: false },
      { display: 'Xanh lá', value: 'green', color: true, isChecked: false },
      { display: 'Xanh dương', value: 'blue', color: true, isChecked: false },
    ],
  },
  {
    heading: 'Size bánh',
    heading_value: 'size',
    children: [
      { display: 'Nhỏ', value: 'small', isChecked: false },
      { display: 'Thường', value: 'medium', isChecked: false },
      { display: 'Lớn', value: 'big', isChecked: false },
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
function CustomAccordion(props: any) {
  const context = useContext(ProductsContext);
  const theme = useTheme();
  const head_Information = props.head_Information;
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
                        item.value,
                      )
                    }
                  />
                }
                label={
                  <Typography
                    style={{
                      backgroundColor: item.color ? item.value : 'transparent',
                    }}
                    variant="button"
                    color={
                      item.color
                        ? theme.palette.common.white
                        : theme.palette.common.black
                    }
                    sx={{ px: item.color ? 1 : 0 }}
                  >
                    {item.display}
                  </Typography>
                }
              />
            ),
          )}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
function Filter(props: any) {
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
}
// #endregion

// #region View
function TypeView(props: any) {
  const theme = useTheme();
  const context = useContext(ProductsContext);
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
      value: 'grid',
      Icon: (
        <GridView
          sx={context.View == 'grid' ? buttonStyles.fill : buttonStyles.nonFill}
        />
      ),
    },
    {
      value: 'list',
      Icon: (
        <ListAlt
          sx={context.View == 'list' ? buttonStyles.fill : buttonStyles.nonFill}
        />
      ),
    },
  ];
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
              children={() => item.Icon}
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
}
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

function TypeSort(props: any) {
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
}
//#endregion

// #region Products
interface ProductItem {
  id: string;
  image: string;
  name: string;
  price: number;
  MFG: Date;
  description: string;
  totalSoldQuantity: number;
  href: string;
}

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

function CakeCard(props: any) {
  const theme = useTheme();
  const context = useContext(ProductsContext);
  const imageHeight = props.imageHeight;
  const productDefault: ProductItem = {
    id: '1',
    image: banh1.src,
    name: 'Bánh Quy',
    price: 100000,
    MFG: new Date(),
    description: 'Bánh ngon dữ lắm bà ơi',
    totalSoldQuantity: 15,
    href: '#',
  };
  var isList = context.View !== 'grid';

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
      transform: 'scale(1.5)',
      objectFit: 'cover',
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
        flexDirection: isList ? 'row' : 'column',
        width: '100%',
        height: 'auto',
      }}
    >
      <CardActionArea
        href={props.href ? props.href : productDefault.href}
        sx={{ width: isList ? '50%' : '100%', height: imageHeight }}
      >
        <Box
          component={'img'}
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
              <CustomIconButton
                children={() => (
                  <>
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
                  </>
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

function ProductList(props: any) {
  //#region Defined Values

  const imageHeight = props.imageHeight ? props.imageHeight : '240px';

  //#endregion

  //#region States

  const [displayProducts, setDisplayProducts] = useState<ProductItem[]>([]);

  //#endregion

  //#region Hooks

  const theme = useTheme();
  const context = useContext(ProductsContext);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    const filteredProductList = filterProductList(context.ProductList);
    const sortedProductList = sortProductList(filteredProductList);

    console.log(sortedProductList);

    setDisplayProducts(sortedProductList);
  }, [context.ProductList, context.SortList, context.GroupBoLoc]);

  //#endregion

  //#region Functions

  function sortProductList(productList: ProductItem[]): ProductItem[] {
    console.log('sorting...');

    const choosenSort: string = context.SortList.value;

    console.log(choosenSort);

    console.log(productList);

    console.log(productList.map((item) => item.MFG.valueOf()));

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
        return [...productList].sort(
          (a, b) => a.MFG.valueOf() - b.MFG.valueOf(),
        );
      // Mới nhất
      case '6':
        console.log('Option raised');
        return [...productList].sort(
          (a, b) => b.MFG.valueOf() - a.MFG.valueOf(),
        );
      // Bán chạy nhất
      case '7':
        console.log('Option raised');
        return [...productList].sort(
          (a, b) => b.totalSoldQuantity - a.totalSoldQuantity,
        );
      default:
        console.log('Option raised');
        return [...productList];
    }
  }

  function filterProductList(productList: ProductItem[]): ProductItem[] {
    console.log(context.GroupBoLoc);

    //#region Local Functions

    function filterColor(productList: ProductItem[]): ProductItem[] {
      return [...productList];
    }

    function filterSize(productList: ProductItem[]): ProductItem[] {
      return [...productList];
    }

    function filterPrice(productList: ProductItem[]): ProductItem[] {
      // Get price range
      const priceFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'price',
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
          console.log(filter);

          if (filter.isChecked) {
            console.log('Find price checked, adding it');
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
        priceRanges: PriceRange[],
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

    return filteredProductList;
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
            <CakeCard {...item} imageHeight={imageHeight} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

//#endregion

// #region Context
export interface ProductsContextType {
  GroupBoLoc: BoLocItem[];
  handleCheckBox: any;
  View: 'grid' | 'list';
  handleSetViewState: any;
  SortList: any;
  handleSetSortList: any;
  ProductList: ProductItem[];
}

const initProductsContext: ProductsContextType = {
  GroupBoLoc: [],
  View: 'grid',
  SortList: {},
  ProductList: [],

  handleCheckBox: () => {},
  handleSetViewState: () => {},
  handleSetSortList: () => {},
};

export const ProductsContext =
  createContext<ProductsContextType>(initProductsContext);
// #endregion

export default function Products({ products }: { products: string }) {
  //#region States

  const [groupBoLocState, setGroupBoLocState] =
    useState<BoLocItem[]>(initGroupBoLoc);
  const [viewState, setViewState] = useState<'grid' | 'list'>('grid');
  const [sortListState, setSortListState] = useState<any>(initSortList);

  const [productListState, setProductListState] = useState<ProductItem[]>(
    JSON.parse(products),
  );

  //#endregion

  //#region Hooks

  const theme = useTheme();

  //#endregion

  //#region UseEffects

  useEffect(() => {
    //Van Hen
    console.log('thaydoi', groupBoLocState, sortListState);
  }, [groupBoLocState, sortListState]);

  //#endregion

  //#region Functions

  //#endregion

  //#region Handlers

  function handdleCheckBox(heading_value: string, value: string) {
    setGroupBoLocState(
      groupBoLocState.map((item) => {
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
      }),
    );
  }

  function handleSetViewState(value: 'grid' | 'list') {
    setViewState(value);
  }

  function handleSetSortList(value: any) {
    setSortListState({ ...sortListState, value: value });
  }
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
        }}
      >
        <Box>
          <ImageBackground
            children={() => (
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
                  <Link href="#">
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
                  </Link>
                </Grid>
              </Grid>
            )}
          />

          <Box sx={{ py: 8, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}>
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
                    <ProductList imageHeight={'184px'} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ProductsContext.Provider>
    </>
  );
}

//#region Local Functions

function firestoreTimestampToISOString(timestamp: Timestamp): string {
  const jsDate = timestamp.toDate();
  const isoString = jsDate.toISOString();

  return isoString;
}

async function fetchAvailableBatches(): Promise<BatchObject[]> {
  try {
    const batchesRef = collection(db, 'batches');
    const batchesQuery = query(batchesRef, where('EXP', '>', Timestamp.now()));

    const batchSnapshots = await getDocs(batchesQuery);
    const batches = batchSnapshots.docs.map(
      (batch) =>
        ({
          id: batch.id,
          ...batch.data(),
          MFG: batch.data().MFG.toDate(),
          EXP: batch.data().MFG.toDate(),
        } as BatchObject),
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
  batches: BatchObject[],
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
      groupedBatches,
    ).map((product_id) => {
      const pricesAndMFGs = groupedBatches[product_id];
      const priceAndMFGThatHasTheLowestPrice = pricesAndMFGs.find(
        (priceAndMFG: any) => priceAndMFG.price === pricesAndMFGs[0].price,
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
  const batchesRef = collection(db, 'batches');
  const batchesQuery = query(batchesRef, where('product_id', '==', productId));
  const batchesSnapshot = await getDocs(batchesQuery);

  const batches: BatchObject[] = batchesSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as BatchObject),
  );

  const totalSoldQuantity: number = batches.reduce((acc, batch) => {
    return acc + batch.soldQuantity;
  }, 0);

  return totalSoldQuantity;
}

async function fetchProductTypesWithLowestPrices(
  lowestPricesAndTheirMFGs: LowestPriceAndItsMFGProductId[],
): Promise<ProductItem[]> {
  try {
    const products = await Promise.all(
      lowestPricesAndTheirMFGs.map(async ({ id, price, MFG }) => {
        const productDoc = await getDoc(doc(db, 'products', id));
        const productData = {
          id: productDoc.id,
          ...productDoc.data(),
        } as ProductObject;

        return {
          id: productData.id,
          name: productData.name,
          description: productData.description,
          price: price,
          MFG: MFG,
          image: await getDownloadUrlFromFirebaseStorage(productData.images[0]),
          href: productData.id,
          totalSoldQuantity: await getTotalSoldQuantity(productData.id),
        } as ProductItem;
      }),
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
    batches,
  );

  const products = await fetchProductTypesWithLowestPrices(
    lowestPricesAndTheirMFGs,
  );

  return {
    props: {
      products: JSON.stringify(products),
    },
  };
}
