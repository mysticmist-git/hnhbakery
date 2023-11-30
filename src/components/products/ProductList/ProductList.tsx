import ProductsContext, {
  ProductsContextType,
} from '@/lib/contexts/productsContext';
import { valueComparer } from '@/lib/pageSpecific/products';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useCallback, useContext, useMemo } from 'react';
import CakeCard from '../CakeCard';
import { ProductTableRow } from '@/models/product';
function ProductList({
  products,
  viewState,
  imageHeight,
  imageHeightList,
}: {
  products: ProductTableRow[];
  viewState: 'grid' | 'list';
  imageHeight: string;
  imageHeightList: string;
}) {
  const theme = useTheme();

  return (
    <>
      <Grid
        container
        direction={'row'}
        justifyContent={'flex-start'}
        alignItems={'start'}
        spacing={3}
      >
        {products.map((item, i) => (
          <Grid
            item
            key={i}
            xs={viewState != 'grid' ? 12 : 12}
            sm={viewState != 'grid' ? 12 : 6}
            md={viewState != 'grid' ? 12 : 6}
            lg={viewState != 'grid' ? 12 : 4}
          >
            <CakeCard
              product={item}
              viewState={viewState}
              imageHeight={imageHeight}
              imageHeightList={imageHeightList}
            />
          </Grid>
        ))}
        {products.length <= 0 && (
          <Box
            component={'div'}
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
