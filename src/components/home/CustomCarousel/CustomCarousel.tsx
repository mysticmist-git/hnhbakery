import { HomeContext } from '@/lib/contexts/homeContext';
import { useTheme } from '@mui/material';
import { useContext } from 'react';
import Carousel from 'react-material-ui-carousel';
import CustomCarouselItem from '../CustomCarouselItem';

// #region Carousel
export function CustomCarousel(props: any) {
  const theme = useTheme();
  const context = useContext(HomeContext);
  return (
    <>
      <Carousel
        animation="slide"
        stopAutoPlayOnHover
        autoPlay
        duration={props.duration}
        indicatorContainerProps={{
          style: {
            position: 'absolute',
            bottom: 8,
            left: '0',
            right: '0',
            zIndex: 1,
          },
        }}
      >
        {context.carouselImages.map((image, i) => (
          <CustomCarouselItem key={i} height={props.height} image={image} />
        ))}
      </Carousel>
    </>
  );
}
