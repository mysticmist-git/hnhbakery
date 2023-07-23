import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function CustomCarouselItem(props: any) {
  const { height, image } = props;
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  return (
    <>
      <Box sx={{ height: height, width: '100%', position: 'relative' }}>
        <Link href={image.href} style={{ textDecoration: 'none' }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={'100%'} height={height} />
          ) : null}
          <Image
            fill={true}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            onLoad={handleImageLoad}
            style={{
              objectFit: 'cover',
            }}
          />
        </Link>
      </Box>
    </>
  );
}

export default CustomCarouselItem;
