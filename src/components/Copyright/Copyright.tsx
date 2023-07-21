import theme from '@/styles/themes/lightTheme';
import { Link, Typography } from '@mui/material';
import { memo } from 'react';

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color={theme.palette.common.white}
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link
        color={theme.palette.common.white}
        href="https://mui.com/"
        style={{ textDecoration: 'none' }}
      >
        H&H Barkery
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default memo(Copyright);
