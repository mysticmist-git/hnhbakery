import { Link, Typography } from '@mui/material';
import { memo } from 'react';

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link
        color="inherit"
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
