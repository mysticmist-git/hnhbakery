import { Button, useTheme } from '@mui/material';
import React, { memo } from 'react';

const CustomButton = (props: any) => {
  const theme = useTheme();
  return (
    <Button
      {...props}
      style={{
        backgroundColor: props.sx?.bgcolor ?? theme.palette.secondary.main,
        color: theme.palette.common.white,
        transition: 'opacity 0.2s',
      }}
      variant="contained"
      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {props.children}
    </Button>
  );
};

export default memo(CustomButton);
