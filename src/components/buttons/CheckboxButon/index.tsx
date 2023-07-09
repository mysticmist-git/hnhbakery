import { Button, useTheme } from '@mui/material';
import React, { memo, useState } from 'react';

function CheckboxButton(props: any) {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
  };
  const theme = useTheme();
  return (
    <Button
      {...props}
      variant="contained"
      onClick={handleClick}
      sx={{
        bgcolor: checked ? theme.palette.secondary.main : 'transparent',
        color: checked
          ? theme.palette.common.white
          : theme.palette.secondary.main,
        transition: 'opacity 0.2s',
        py: 1.5,
        px: 3,
        border: 3,
        borderColor: theme.palette.secondary.main,
        borderRadius: '8px',
        '&:hover': {
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.common.white,
        },
      }}
    >
      {props.display}
    </Button>
  );
}

export default memo(CheckboxButton);
