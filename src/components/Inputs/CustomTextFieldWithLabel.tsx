import { TextField, alpha, useTheme } from '@mui/material';
import React from 'react';

export default function CustomTextFieldWithLabel(props: any) {
  const theme = useTheme();
  return (
    <TextField
      {...props}
      color="secondary"
      // InputProps={{
      //   sx: { color: theme.palette.common.black },
      // }}
      sx={{
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.main,
          color: theme.palette.common.black,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 2,
          borderRadius: '8px',
        },
      }}
    />
  );
}
