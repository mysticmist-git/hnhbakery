import { ChatContext } from '@/lib/contexts/chatContext';
import { ZoomOutMapRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useContext, useState } from 'react';

export function ChatImage({
  src,
  handleDialogImage,
}: {
  src: string;
  handleDialogImage: (str: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const { state } = useContext(ChatContext);

  return (
    <>
      <Box
        component={'div'}
        onClick={() => {
          handleDialogImage(src);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          position: 'relative',
          cursor: 'pointer',
          width: state.senderType == 'client' ? '100%' : '50%',
          aspectRatio: '1/0.7',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Box
          component={'img'}
          src={src}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        <Box
          component={'div'}
          sx={{
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.2s ease',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <ZoomOutMapRounded fontSize="small" color="inherit" />
        </Box>
      </Box>
    </>
  );
}
