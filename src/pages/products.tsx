import bg12 from '@/assets/Decorate/bg12.png';
import BottomSlideInDiv from '@/components/animations/appear/BottomSlideInDiv';
import ImageBackground from '@/components/Imagebackground';
import { ProductList, TypeSort, TypeView } from '@/components/products';
import FilterComponent from '@/components/products/Filter/Filter';
import { getAvailableProductTableRows } from '@/lib/DAO/productDAO';
import { ProductTableRow } from '@/models/product';
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
import React, { useEffect, useState } from 'react';
import * as diacritics from 'diacritics';

export type Filter = {
  sort: number;
  productTypes_id: string[];
  colors: string[];
  sizes: string[];
  price: {
    min: number;
    max: number;
  };
};

const Products = () => {
  const theme = useTheme();
  const router = useRouter();

  const [productData, setProductData] = useState<ProductTableRow[]>([]);
  const [productDataDisplay, setProductDataDisplay] = useState<
    ProductTableRow[]
  >([]);
  const [viewState, setViewState] = useState<'grid' | 'list'>('grid');
  const [searchText, setSearchText] = useState('');

  const [filter, setFilter] = useState<Filter>({
    productTypes_id: [],
    colors: [],
    sizes: [],
    price: { min: 0, max: Infinity },
    sort: 0,
  });

  function handleChangeFilter(
    type: 'price' | 'sizes' | 'colors' | 'productTypes_id' | 'sort',
    value: number | string | { min: number; max: number }
  ) {
    if (type === 'price') {
      setFilter({
        ...filter,
        price: value as { min: number; max: number },
      });
    } else if (type === 'sizes') {
      let sizes = filter.sizes;
      if (filter.sizes.includes(value as string)) {
        sizes = sizes.filter((item) => item !== (value as string));
      } else {
        sizes.push(value as string);
      }
      setFilter({
        ...filter,
        sizes: sizes,
      });
    } else if (type === 'colors') {
      let colors = filter.colors;
      if (filter.colors.includes(value as string)) {
        colors = colors.filter((item) => item !== (value as string));
      } else {
        colors.push(value as string);
      }
      setFilter({
        ...filter,
        colors: colors,
      });
    } else if (type === 'productTypes_id') {
      let productTypes_id = filter.productTypes_id;
      if (filter.productTypes_id.includes(value as string)) {
        productTypes_id = productTypes_id.filter(
          (item) => item !== (value as string)
        );
      } else {
        productTypes_id.push(value as string);
      }
      setFilter({
        ...filter,
        productTypes_id: productTypes_id,
      });
    } else if (type === 'sort') {
      setFilter({
        ...filter,
        sort: value as number,
      });
    }
  }

  useEffect(() => {
    async function fetchData() {
      const finalData = await getAvailableProductTableRows();
      setProductData(finalData);
      setProductDataDisplay(finalData);

      const queryProductTypes = router.query.productType;
      console.log('queryProductTypes', queryProductTypes);

      if (queryProductTypes && queryProductTypes !== '') {
        setFilter({
          ...filter,
          productTypes_id: [queryProductTypes as string],
        });
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSetViewState(value: 'grid' | 'list') {
    setViewState(() => value);
  }

  function handleChangeSearch(e: any) {
    setSearchText(() => e.target.value);
  }

  function handleFilterBatches(type: 'search' | 'sort' | 'filter') {
    var final = [...productData];

    if (type === 'search') {
      if (searchText !== '') {
        final = final.filter((item) => {
          const str = diacritics.remove(
            JSON.stringify([
              item.name.toLowerCase(),
              item.description.toLowerCase(),
              item.ingredients.join(' ').toLowerCase(),
              item.colors.join(' ').toLowerCase(),
              item.how_to_use.toLowerCase(),
              item.preservation.toLowerCase(),
            ])
          );

          const searchValue = diacritics.remove(searchText.toLowerCase());
          return str.includes(searchValue);
        });
        if (final.length === 0) {
          return final;
        }
      }
    }
    if (type === 'sort') {
      if (final.length === 0) {
        return final;
      }
      if (filter.sort == 0) {
        //Mặc định
      } else if (filter.sort == 1) {
        //Giá tăng dần
        final = final.sort((a, b) => {
          const minA: number = a.variants
            ? a.variants.length > 0
              ? a.variants
                  .map((item) => item.price)
                  .reduce((a, b) => Math.min(a, b))
              : 0
            : 0;

          const minB: number = b.variants
            ? b.variants.length > 0
              ? b.variants
                  .map((item) => item.price)
                  .reduce((a, b) => Math.min(a, b))
              : 0
            : 0;

          return minA - minB;
        });
      } else if (filter.sort == 2) {
        //Giá giảm dần
        final = final.sort((a, b) => {
          const minA: number = a.variants
            ? a.variants.length > 0
              ? a.variants
                  .map((item) => item.price)
                  .reduce((a, b) => Math.min(a, b))
              : 0
            : 0;

          const minB: number = b.variants
            ? b.variants.length > 0
              ? b.variants
                  .map((item) => item.price)
                  .reduce((a, b) => Math.min(a, b))
              : 0
            : 0;
          return minB - minA;
        });
      } else if (filter.sort == 3) {
        //A - Z
        final = final.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filter.sort == 4) {
        //Z - A
        final = final.sort((a, b) => b.name.localeCompare(a.name));
      } else if (filter.sort == 5) {
        //Cũ nhất
        final = final.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (filter.sort == 6) {
        //Mới nhất
        final = final.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (filter.sort == 7) {
        //Bán chạy nhất
        final = final.sort((a, b) => {
          const amountFB_A = a.feedbacks?.length ?? 0;
          const amountFB_B = b.feedbacks?.length ?? 0;
          return amountFB_B - amountFB_A;
        });
      }
    }
    if (type === 'filter') {
      if (filter.productTypes_id.length > 0) {
        final = final.filter((item) => {
          return filter.productTypes_id.includes(item.product_type_id);
        });

        if (final.length === 0) {
          return final;
        }
      }

      if (filter.colors.length > 0) {
        final = final.filter((item) =>
          item.colors.some((color) => filter.colors.includes(color))
        );
        if (final.length === 0) {
          return final;
        }
      }
      if (filter.sizes.length > 0) {
        final = final.filter((item) => {
          return item.variants
            ?.map((variant) => variant.size)
            .some((size) => filter.sizes.includes(size));
        });
        if (final.length === 0) {
          return final;
        }
      }

      final = final.filter((item) => {
        const minPrice = item.variants
          ? item.variants.length > 0
            ? item.variants
                .map((item) => item.price)
                .reduce((a, b) => Math.min(a, b))
            : 0
          : 0;
        return filter.price.min <= minPrice && minPrice <= filter.price.max;
      });
    }
    return final;
  }

  useEffect(() => {
    setProductDataDisplay(() => handleFilterBatches('filter'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setProductDataDisplay(() => handleFilterBatches('sort'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.sort]);

  useEffect(() => {
    setProductDataDisplay(() => handleFilterBatches('search'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleClick = () => {
    const top: number = 280;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
      <Box component={'div'}>
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
          <Box
            component={'div'}
            sx={{ pt: 4, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}
          >
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'start'}
              spacing={4}
            >
              <Grid item xs={12}>
                <Box
                  component={'div'}
                  sx={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundImage: `url(${bg12.src})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
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

              <Grid item md={3} xs={12}>
                <FilterComponent
                  filter={filter}
                  handleChangeFilter={handleChangeFilter}
                />
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
                        <TypeView
                          viewState={viewState}
                          handleSetViewState={handleSetViewState}
                        />
                      </Grid>
                      <Grid item width={{ sm: 'auto', xs: '100%' }}>
                        <TypeSort
                          filter={filter}
                          handleChangeFilter={handleChangeFilter}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <ProductList
                      products={productDataDisplay}
                      viewState={viewState}
                      imageHeight="20vh"
                      imageHeightList="30vh"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </BottomSlideInDiv>
      </Box>
    </>
  );
};

export default Products;
