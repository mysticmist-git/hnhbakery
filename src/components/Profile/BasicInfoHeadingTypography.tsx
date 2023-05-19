import { Typography } from '@mui/material';
import { memo } from 'react';

const BasicInfoHeadingTypography = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Typography variant="body2">{children}</Typography>;
};

export default memo(BasicInfoHeadingTypography);
