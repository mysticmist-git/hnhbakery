import { Box, useTheme, alpha } from '@mui/material';
import { memo } from 'react';
import contactImage from '@/assets/contact-img.jpg';

const ContactWrapper = ({ children = '' }: { children?: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        mt: 8,
        border: 3,
        borderColor: theme.palette.secondary.main,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundImage: `url(${contactImage.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.common.black, 0.75),
          backdropFilter: 'blur(1px)',
          p: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default memo(ContactWrapper);
