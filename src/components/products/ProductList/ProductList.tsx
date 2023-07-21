import ProductsContext, {
  BoLocItem,
  ProductsContextType,
} from '@/lib/contexts/productsContext';
import { valueComparer } from '@/lib/pageSpecific/products';
import { ProductForProductsPage } from '@/lib/types/products';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useContext, useMemo } from 'react';
import CakeCard from '../CakeCard';

function ProductList(props: any) {
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

  const displayProducts: ProductForProductsPage[] = useMemo(() => {
    console.log(context.ProductList);
    const filteredProducts = filterProductList(context.ProductList);
    const sortedProducts = sortProductList(filteredProducts);
    let searchResultProductList = searchProductList(
      sortedProducts,
      context.searchText
    );

    searchResultProductList = minimizeProductPrices(searchResultProductList);

    return minimizeProductPrices(searchResultProductList);
  }, [
    context.ProductList,
    context.SortList,
    context.GroupBoLoc,
    context.searchText,
  ]);

  //#endregion
  //#region Functions
  function sortProductList(
    productList: ProductForProductsPage[]
  ): ProductForProductsPage[] {
    const choosenSort: string = context.SortList.value;

    switch (choosenSort) {
      // Mặc định
      case '0':
        console.log('Option raised');
        return [...productList];
      // Giá tăng dần
      case '1':
        console.log('Option raised');
        return [...productList].sort((a, b) => {
          const aPrice = a.discountPrice === 0 ? a.price : a.discountPrice;
          const bPrice = b.discountPrice === 0 ? b.price : b.discountPrice;

          return aPrice - bPrice;
        });
      // Giá giảm dần
      case '2':
        console.log('Option raised');
        return [...productList].sort((a, b) => {
          const aPrice = a.discountPrice === 0 ? a.price : a.discountPrice;
          const bPrice = b.discountPrice === 0 ? b.price : b.discountPrice;

          return bPrice - aPrice;
        });
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
          return valueComparer(
            new Date(a.MFG).getTime(),
            new Date(b.MFG).getTime()
          );
        });
      // Mới nhất
      case '6':
        console.log('Option raised');
        return [...productList].sort((a, b) => {
          return valueComparer(
            new Date(b.MFG).getTime(),
            new Date(a.MFG).getTime()
          );
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

  function filterProductList(
    products: ProductForProductsPage[]
  ): ProductForProductsPage[] {
    //#region Local Functions
    function filterProductType(
      products: ProductForProductsPage[]
    ): ProductForProductsPage[] {
      const productTypeFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'typeCake'
      );

      const productTypeIdChecked = productTypeFilter?.children
        .filter((item) => item.isChecked)
        .map((item) => item.value);

      if (productTypeIdChecked?.length === 0) return [...products];

      const productTypeFilteredResult = [
        ...products.filter((p) => {
          return productTypeIdChecked?.includes(p.productType_id);
        }),
      ];

      return productTypeFilteredResult;
    }

    function filterColor(
      products: ProductForProductsPage[]
    ): ProductForProductsPage[] {
      const colorFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'color'
      );

      if (!colorFilter) return [...products];

      const colorChecks = colorFilter.children
        .filter((item) => item.isChecked)
        .map((item) => item.realValue);

      if (colorChecks.length === 0) return [...products];

      return [
        ...products.filter((product) => {
          for (const color of product.colors) {
            if (colorChecks.includes(color)) {
              return true;
            }
          }
          return false;
        }),
      ];
    }

    function filterSize(
      products: ProductForProductsPage[]
    ): ProductForProductsPage[] {
      // Get size filter
      const sizeFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'size'
      );

      if (!sizeFilter) return [...products];

      const sizeChecks = sizeFilter.children
        .filter((item) => item.isChecked)
        .map((item) => item.value);

      if (sizeChecks.length === 0) return [...products];

      return [
        ...products.filter((product) => {
          for (const size of sizeChecks) {
            if (!product.variants.map((v) => v.size).includes(size)) {
              return false;
            }
          }
          return true;
        }),
      ];
    }

    function filterPrice(
      products: ProductForProductsPage[]
    ): ProductForProductsPage[] {
      // Get price range
      const priceFilter = context.GroupBoLoc.find(
        (item) => item.heading_value === 'price'
      );

      if (!priceFilter) return [...products];

      const priceRanges = filterPriceRange(priceFilter);

      if (priceRanges.length === 0) return [...products];

      return filterProductListBaseOnPriceRanges(products, priceRanges);

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
        products: ProductForProductsPage[],
        priceRanges: PriceRange[]
      ): ProductForProductsPage[] {
        return products.filter((product) => {
          return priceRanges.some((range) => {
            const minInRange = range.min === 'infinity' ? -Infinity : range.min;
            const maxInRange = range.max === 'infinity' ? Infinity : range.max;
            return (
              Math.min(...product.variants.map((v) => v.price)) >= minInRange &&
              Math.max(...product.variants.map((v) => v.price)) <= maxInRange
            );
          });
        });
      }

      //#endregion
    }

    //#endregion
    let filteredProducts: ProductForProductsPage[] = products;

    // Filter Color
    filteredProducts = filterColor(filteredProducts);

    // Filter Size
    filteredProducts = filterSize(filteredProducts);

    // Filter Price
    filteredProducts = filterPrice(filteredProducts);

    filteredProducts = filterProductType(filteredProducts);

    return filteredProducts;
  }
  function removeAccents(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  function searchProductList(
    productList: ProductForProductsPage[],
    searchText: string
  ) {
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
              name={item.name}
              image={item.image}
              description={item.description}
              price={item.price}
              discountPrice={item.discountPrice}
              discounted={item.discounted}
              href={item.href}
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
}

export default ProductList;

function minimizeProductPrices(
  products: ProductForProductsPage[]
): ProductForProductsPage[] {
  let minPriceProducts: any = {};

  products.forEach((product) => {
    let price =
      product.discountPrice !== 0 ? product.discountPrice : product.price;

    if (
      !minPriceProducts[product.product_id] ||
      price < minPriceProducts[product.product_id].price
    ) {
      minPriceProducts[product.product_id] = product;
      minPriceProducts[product.product_id].price = price;
    }
  });

  // Extract products from the object to form the result array
  let result = Object.values(minPriceProducts);

  return result as ProductForProductsPage[];
}
