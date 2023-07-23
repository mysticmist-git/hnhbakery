import { CustomCard } from '@/components/cards';
import { Grid } from '@mui/material';

export function TypeCakeItem({
  imageHeight,
  descriptionHeight,
  cardInfo,
}: any) {
  return (
    <Grid item md={4} sm={6} xs={12}>
      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        width={'100%'}
      >
        <CustomCard
          imageHeight={imageHeight}
          descriptionHeight={descriptionHeight}
          cardInfo={cardInfo}
        />
      </Grid>
    </Grid>
  );
}
