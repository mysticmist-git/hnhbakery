import { storage } from '@/firebase/config';
import { ProductDetailContext } from '@/lib/contexts/productDetail';
import { ProductCarouselProps } from '@/lib/types/product-detail';
import { Box, Grid, alpha, useTheme } from '@mui/material';
import { ref } from 'firebase/storage';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import Carousel from 'react-material-ui-carousel';

function ProductCarousel({ images }: ProductCarouselProps) {
  const theme = useTheme();
  const context = useContext(ProductDetailContext);
  const [activeIndex, setActiveIndex] = useState(0);
  function handleChange(index: any) {
    setActiveIndex(index);
  }

  return (
    <Box
      sx={{
        position: 'relative',
        border: 3,
        borderColor: theme.palette.secondary.main,
        overflow: 'hidden',
        borderRadius: '8px',
      }}
    >
      <Carousel
        animation="fade"
        duration={700}
        interval={10000}
        indicators={false}
        index={activeIndex}
        onChange={handleChange}
      >
        {images.map((image: any, i: number) => (
          <CarouselItem key={i} Image={Image} image={image} />
        ))}
      </Carousel>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'auto',
          zIndex: 10,
        }}
      >
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'end'}
          spacing={1}
          sx={{
            pr: 1,
            pb: 1,
            background: `linear-gradient(to bottom, ${alpha(
              theme.palette.common.white,
              0
            )}, ${alpha(theme.palette.common.white, 0.5)})`,
          }}
        >
          {images.map((image: any, i: number) => (
            <CarouselMiniImageItem
              key={i}
              index={i}
              activeIndex={activeIndex}
              handleChange={handleChange}
              image={image}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default ProductCarousel;

function CarouselItem({ Image, image }: any) {
  const [downloadUrl, imageLoading, imageError] = useDownloadURL(
    image ? ref(storage, image) : undefined
  );

  return (
    <Box
      sx={{
        height: '50vh',
        width: '100%',
      }}
    >
      <Box
        component={Image}
        fill={true}
        src={downloadUrl || ''}
        alt={'Product gallery image'}
        loading="lazy"
        sx={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          cursor: 'pointer',
          transition: 'transform 0.3s ease-in-out',
          ':hover': {
            transform: 'scale(1.3) rotate(5deg)',
          },
        }}
      />
    </Box>
  );
}

function CarouselMiniImageItem({
  index,
  activeIndex,
  handleChange,
  image,
}: any) {
  const theme = useTheme();

  const [downloadURL, imageLoading, imageError] = useDownloadURL(
    image ? ref(storage, image) : undefined
  );

  return (
    <Grid item>
      <Box
        sx={{
          height: index == activeIndex ? '9vh' : '6vh',
          width: index == activeIndex ? '12vh' : '6vh',
          borderColor:
            index == activeIndex ? theme.palette.common.white : 'transparent',
          opacity: index == activeIndex ? 1 : 0.5,
          border: 3,
          transition: 'all 0.5s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          ':hover': {
            opacity: 1,
          },
        }}
        onClick={() => handleChange(index)}
      >
        <Image
          fill={true}
          src={downloadURL || ''}
          alt={'Product gallery image'}
          loading="lazy"
          style={{
            objectFit: 'cover',
            cursor: 'pointer',
          }}
        />
      </Box>
    </Grid>
  );
}
