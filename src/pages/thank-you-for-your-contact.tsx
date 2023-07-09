import { Box, Button, Link, Typography } from '@mui/material';
import React, { memo } from 'react';

const ThankYou = () => {
  return (
    <Box
      sx={{
        my: 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h2">
        Cảm ơn rất nhiều vì những đóng góp của bạn!
      </Typography>
      <Link href="/">
        <Button variant="contained" color="secondary">
          Trở về Trang chủ
        </Button>
      </Link>
    </Box>
  );
};

export default memo(ThankYou);
