import bg12 from '@/assets/Decorate/bg12.png';
import BottomSlideInDiv from '@/components/animations/appear/BottomSlideInDiv';
import ImageBackground from '@/components/Imagebackground';
import { ProductList, TypeSort, TypeView } from '@/components/products';
import FilterComponent from '@/components/products/Filter/Filter';
import ProductsContext from '@/lib/contexts/productsContext';
import { getAvailableBatchById, getAvailableBatches } from '@/lib/DAO/batchDAO';
import {
  getAvailableProductTypeTableRows,
  getProductTypes,
} from '@/lib/DAO/productTypeDAO';
import { fetchAvailableBatches } from '@/lib/firestore';
import { BatchObject } from '@/lib/models';
import { cachedCreateProductsOnProductsPage } from '@/lib/pageSpecific/products';
import { filterDuplicatesById } from '@/lib/utils';
import Batch, { BatchTableRow } from '@/models/batch';
import ProductType, { ProductTypeTableRow } from '@/models/productType';
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

  const [batches, setBatches] = useState<BatchTableRow[]>([]);
  const [batchesDisplay, setBatchesDisplay] = useState<BatchTableRow[]>([]);
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
      const finalBatches = await getAvailableBatches(true);
      setBatches(finalBatches);
      setBatchesDisplay(finalBatches);

      const queryProductTypes = router.query.productType;

      if (queryProductTypes && queryProductTypes !== '') {
        setFilter({
          ...filter,
          productTypes_id: [queryProductTypes as string],
        });
      }
    }
    fetchData();
  }, []);

  function handleSetViewState(value: 'grid' | 'list') {
    setViewState(() => value);
  }

  function handleChangeSearch(e: any) {
    setSearchText(() => e.target.value);
  }

  function handleFilterBatches(type: 'search' | 'sort' | 'filter') {
    var final = [...batches];

    if (type === 'search') {
      if (searchText !== '') {
        final = final.filter((item) => {
          return item.product?.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
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
          const aPrice =
            a.discount.start_at <= new Date()
              ? a.variant!.price * (1 - a.discount.percent / 100)
              : a.variant!.price;
          const bPrice =
            b.discount.start_at <= new Date()
              ? b.variant!.price * (1 - b.discount.percent / 100)
              : b.variant!.price;
          return aPrice - bPrice;
        });
      } else if (filter.sort == 2) {
        //Giá giảm dần
        final = final.sort((a, b) => {
          const aPrice =
            a.discount.start_at <= new Date()
              ? a.variant!.price * (1 - a.discount.percent / 100)
              : a.variant!.price;
          const bPrice =
            b.discount.start_at <= new Date()
              ? b.variant!.price * (1 - b.discount.percent / 100)
              : b.variant!.price;
          return bPrice - aPrice;
        });
      } else if (filter.sort == 3) {
        //A - Z
        final = final.sort((a, b) =>
          a.product!.name.localeCompare(b.product!.name)
        );
      } else if (filter.sort == 4) {
        //Z - A
        final = final.sort((a, b) =>
          b.product!.name.localeCompare(a.product!.name)
        );
      } else if (filter.sort == 5) {
        //Cũ nhất
        final = final.sort(
          (a, b) => new Date(a.mfg).getTime() - new Date(b.mfg).getTime()
        );
      } else if (filter.sort == 6) {
        //Mới nhất
        final = final.sort(
          (a, b) => new Date(b.mfg).getTime() - new Date(a.mfg).getTime()
        );
      } else if (filter.sort == 7) {
        //Bán chạy nhất
        final = final.sort((a, b) => {
          const aSold = a.quantity - a.sold;
          const bSold = b.quantity - b.sold;
          return bSold - aSold;
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
        final = final.filter((item) => {
          item.product?.colors.forEach((color) => {
            if (filter.colors.includes(color)) {
              return true;
            }
          });
        });
        if (final.length === 0) {
          return final;
        }
      }
      if (filter.sizes.length > 0) {
        final = final.filter((item) => {
          return filter.sizes.includes(item.variant!.size);
        });
        if (final.length === 0) {
          return final;
        }
      }

      final = final.filter((item) => {
        const price =
          item.discount.start_at <= new Date()
            ? item.variant!.price * (1 - item.discount.percent / 100)
            : item.variant!.price;
        return filter.price.min <= price && price <= filter.price.max;
      });
    }
    return final;
  }

  useEffect(() => {
    setBatchesDisplay(() => handleFilterBatches('filter'));
  }, [filter]);

  useEffect(() => {
    setBatchesDisplay(() => handleFilterBatches('sort'));
  }, [filter.sort]);

  useEffect(() => {
    setBatchesDisplay(() => handleFilterBatches('search'));
  }, [searchText]);

  const handleClick = () => {
    const top: number = 280;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
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
                <Box
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
                      batches={batchesDisplay}
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
