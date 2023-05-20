import theme from '@/styles/themes/lightTheme';
import { Typography } from '@mui/material';
import { memo } from 'react';

const BasicInfoHeadingTypography = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Typography variant="body2" color={theme.palette.common.black}>
      {children}
    </Typography>
  );
};

export default memo(BasicInfoHeadingTypography);
