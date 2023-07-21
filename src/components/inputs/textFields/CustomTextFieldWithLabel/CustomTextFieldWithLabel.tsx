import { TextField, TextFieldProps, useTheme } from '@mui/material';
import React from 'react';

export default function CustomTextFieldWithLabel(props: TextFieldProps) {
  const theme = useTheme();
  return (
    <TextField
      {...props}
      color="secondary"
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
