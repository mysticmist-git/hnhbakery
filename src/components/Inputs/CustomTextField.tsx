import { TextField, alpha, useTheme } from '@mui/material';
import React, { memo } from 'react';

const CustomTextField = (props: any) => {
  const theme = useTheme();
  return (
    <>
      <TextField
        {...props}
        hiddenLabel
        variant="filled"
        maxRows="1"
        InputProps={{
          disableUnderline: true,
        }}
        inputProps={{
          sx: {
            fontSize: theme.typography.body2.fontSize,
            color: theme.palette.common.black,
            fontWeight: theme.typography.body2.fontWeight,
            fontFamily: theme.typography.body2.fontFamily,
            backgroundColor: theme.palette.common.white,
            border: 3,
            borderColor: props.borderColor
              ? props.borderColor
              : theme.palette.secondary.main,
            py: props.py ? props.py : 1.5,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: theme.palette.common.white,
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3,
              )}`,
            },
            '&:focus': {
              backgroundColor: theme.palette.common.white,
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3,
              )}`,
            },
          },
        }}
      />
    </>
  );
};
export default memo(CustomTextField);
