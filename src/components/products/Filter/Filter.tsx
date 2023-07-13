import ProductsContext from '@/lib/contexts/productsContext';
import { Grid } from '@mui/material';
import { useContext } from 'react';
import CustomAccordion from '../CustomAccordion';

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

export default Filter;
