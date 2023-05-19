import { Typography } from '@mui/material';
import { memo } from 'react';

const BasicInfoContentTypography = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Typography
      variant="body2"
      display={'inline'}
      sx={{
        fontWeight: 'normal',
      }}
    >
      {children}
    </Typography>
  );
};

export default memo(BasicInfoContentTypography);
