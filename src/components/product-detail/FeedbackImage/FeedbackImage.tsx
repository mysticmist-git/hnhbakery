import defaultAvatar from '@/assets/defaultAva.jpg';
import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const FeedbackImage = ({ image, alt }: { image: string; alt: string }) => {
  return (
    <Box
      component={Image}
      src={image && image !== '' ? image : defaultAvatar.src}
      alt={alt}
      fill={true}
      loading="lazy"
      sx={{
        objectFit: 'cover',
      }}
    />
  );
};

export default FeedbackImage;
