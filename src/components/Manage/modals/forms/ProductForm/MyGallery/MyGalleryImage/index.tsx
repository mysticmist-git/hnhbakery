import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import { memo } from 'react';

const MyGalleryImage = ({
  src,
  readOnly = false,
  handleDeleteImage,
}: {
  src: any;
  readOnly: boolean;
  handleDeleteImage: any;
}) => {
  return (
    <Box
      position="relative"
      sx={{
        '&:hover > button': {
          visibility: 'visible',
          opacity: 1,
        },
        '&:hover > img': {
          border: (theme) => `4px solid ${theme.palette.secondary.main}`,
          transition: 'border 0.2s ease-in-out',
        },
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <Image
        src={src}
        alt="Gallery Image"
        width={172}
        height={240}
        priority
        style={{ objectFit: 'cover', borderRadius: '1rem' }}
      />
      {!readOnly && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
            color: 'common.white',
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
          onClick={() => {
            handleDeleteImage(src);
          }}
          disabled={readOnly}
        >
          <Close />
        </IconButton>
      )}
    </Box>
  );
};

export default memo(MyGalleryImage);
