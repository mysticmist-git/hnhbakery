import ProductsContext, {
  ProductsContextType,
} from '@/lib/contexts/productsContext';
import { valueComparer } from '@/lib/pageSpecific/products';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useCallback, useContext, useMemo } from 'react';
import CakeCard from '../CakeCard';
import { BatchTableRow } from '@/models/batch';

function ProductList({
  batches,
  viewState,
  imageHeight,
  imageHeightList,
}: {
  batches: BatchTableRow[];
  viewState: 'grid' | 'list';
  imageHeight: string;
  imageHeightList: string;
}) {
  const theme = useTheme();

  function removeAccents(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  return (
    <>
      <Grid
        container
        direction={'row'}
        justifyContent={'flex-start'}
        alignItems={'start'}
        spacing={{ md: 2, xs: 3 }}
      >
        {batches.map((item, i) => (
          <Grid
            item
            key={i}
            xs={viewState != 'grid' ? 12 : 12}
            sm={viewState != 'grid' ? 12 : 6}
            md={viewState != 'grid' ? 12 : 6}
            lg={viewState != 'grid' ? 12 : 4}
          >
            <CakeCard
              batch={item}
              viewState={viewState}
              imageHeight={imageHeight}
              imageHeightList={imageHeightList}
            />
          </Grid>
        ))}
        {batches.length <= 0 && (
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
