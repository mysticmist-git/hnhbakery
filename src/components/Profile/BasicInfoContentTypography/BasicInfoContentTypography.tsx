import theme from '@/styles/themes/lightTheme';
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
        color: theme.palette.common.black,
      }}
    >
      {children}
    </Typography>
  );
};

export default memo(BasicInfoContentTypography);
