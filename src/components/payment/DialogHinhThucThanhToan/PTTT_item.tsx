import useDownloadUrl from '@/lib/hooks/useDownloadUrl';
import PaymentMethod from '@/models/paymentMethod';
import { Box, Button, Typography, alpha, useTheme } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

export default function PTTT_item({
  item: { name, image },
  onClick,
}: Readonly<{
  item: PaymentMethod;
  onClick: () => void;
}>) {
  const theme = useTheme();

  const [isHover, setIsHover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const url = useDownloadUrl(image);
  console.log(image, url);

  return (
    <Box
      component={Button}
      onClick={() => onClick()}
      sx={{
        width: '100%',
        aspectRatio: '1/1',
        overflow: 'hidden',
        borderRadius: '8px',
        position: 'relative',
        cursor: 'pointer',
        borderColor: theme.palette.secondary.main,
        border: 3,
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      <Box
        component={Image}
        fill={true}
        src={url}
        alt={name}
        sx={{
          objectFit: 'cover',
          transition: 'all 0.3s ease-in-out',
          transform: isHover ? 'scale(1.3)' : 'scale(1)',
          rotate: isHover ? '5deg' : '0deg',
        }}
      />
      <Box
        component={'div'}
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: alpha(theme.palette.common.black, 0.7),
          opacity: isHover ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Typography variant="h2" color={theme.palette.common.white}>
          {name}
        </Typography>
      </Box>
    </Box>
  );
}
