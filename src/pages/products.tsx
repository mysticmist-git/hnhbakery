import bg12 from '@/assets/Decorate/bg12.png';
import BottomSlideInDiv from '@/components/animations/appear/BottomSlideInDiv';
import ImageBackground from '@/components/Imagebackground';
import { Filter, ProductList, TypeSort, TypeView } from '@/components/products';
import ProductsContext, { BoLocItem } from '@/lib/contexts/productsContext';
import { fetchAvailableBatches } from '@/lib/firestore';
import { BatchObject } from '@/lib/models';
import { cachedCreateProductsOnProductsPage } from '@/lib/pageSpecific/products';
import { ProductForProductsPage } from '@/lib/types/products';
import { filterDuplicatesById } from '@/lib/utils';
import {
  alpha,
  Box,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

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

//#endregion

const Products = ({ products: stringifiedProducts }: { products: string }) => {
  //#region Hooks

  const theme = useTheme();
  const router = useRouter();

  // #endregion

  //#region States

  const [products, setProducts] = useState<ProductForProductsPage[]>([]);

  const [groupBoLocState, setGroupBoLocState] = useState<BoLocItem[]>([]);
  const [viewState, setViewState] = useState<'grid' | 'list'>('grid');
  const [sortListState, setSortListState] = useState<any>(initSortList);
  const [searchText, setSearchText] = useState('');

  //#endregion

  // #region functions

  const generateGroupBoLoc = useCallback(
    (types: { id: string; name: string }[]) => {
      let children = types.map((type) => ({
        display: type.name,
        value: type.id,
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
          return item;
        }
      });

      return [
        {
          heading: 'Loại bánh',
          heading_value: 'typeCake',
          children: children,
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
    },
    [router.query.product_type]
  );

  // #endregion

  //#region useEffects

  useEffect(() => {
    const products: ProductForProductsPage[] = JSON.parse(stringifiedProducts);

    console.log(products);

    setProducts(() => [...products]);

    setGroupBoLocState(() =>
      generateGroupBoLoc(
        filterDuplicatesById(
          products.map((p) => ({
            id: p.productType_id ?? '',
            name: p.typeName,
          }))
        )
      )
    );
  }, [generateGroupBoLoc, stringifiedProducts]);

  //#endregion

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
          ProductList: products,
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

          <BottomSlideInDiv>
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
          </BottomSlideInDiv>
        </Box>
      </ProductsContext.Provider>
    </>
  );
};

export async function getServerSideProps() {
  let batches: BatchObject[] = [];

  try {
    batches = await fetchAvailableBatches();
  } catch (error) {
    console.log(error);
  }

  if (batches.length <= 0) {
    return {
      props: {
        products: JSON.stringify([]),
      },
    };
  }

  const products = await cachedCreateProductsOnProductsPage(batches);

  return {
    props: {
      products: JSON.stringify(products),
    },
  };
}

export default Products;
