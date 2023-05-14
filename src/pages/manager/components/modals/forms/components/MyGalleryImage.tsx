import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';

export default function MyGalleryImage({
  src,
  srcs,
  setSrcs,
}: {
  src: any;
  srcs: string[];
  setSrcs: any;
}) {
  return (
    <Box
      position="relative"
      sx={{
        '&:hover > button': {
          visibility: 'visible',
          opacity: 1,
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
        onClick={() => setSrcs(srcs.filter((s) => s !== src))}
      >
        <Close />
      </IconButton>
    </Box>
  );
}
