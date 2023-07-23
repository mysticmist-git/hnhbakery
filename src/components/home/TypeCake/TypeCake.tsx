import { HomeContext, HomeContextType } from '@/lib/contexts/homeContext';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useContext } from 'react';
import { TypeCakeItem } from '../TypeCakeItem/TypeCakeItem';

//#endregion
function TypeCakes(props: any) {
  const theme = useTheme();
  const { productTypes } = useContext<HomeContextType>(HomeContext);

  return (
    <>
      <Typography
        variant="h2"
        color={theme.palette.secondary.main}
        align={'center'}
      >
        {props.title}
      </Typography>
      <Box sx={{ pt: 4 }}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          {productTypes.map((item, i) => (
            <TypeCakeItem
              key={i}
              imageHeight={props.imageHeight}
              descriptionHeight={props.descriptionHeight}
              cardInfo={item}
            />
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default TypeCakes;
