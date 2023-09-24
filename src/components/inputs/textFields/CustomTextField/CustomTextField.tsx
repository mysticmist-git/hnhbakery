import { TextField, alpha, useTheme } from '@mui/material';
import React, { ComponentPropsWithRef } from 'react';

const CustomTextField: React.FC<
  ComponentPropsWithRef<typeof TextField> & {
    textAlign?: string;
    borderColor?: string;
    py?: string;
  }
> = (props, ref) => {
  const theme = useTheme();

  return (
    <TextField
      {...props}
      variant="filled"
      maxRows="1"
      InputProps={{
        ...props.InputProps,
        disableUnderline: true,
      }}
      inputProps={{
        sx: {
          textAlign: props.textAlign ? props.textAlign : 'left',
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
              0.3
            )}`,
          },
          '&:focus': {
            backgroundColor: theme.palette.common.white,
            boxShadow: `0px 0px 5px 2px ${alpha(
              theme.palette.secondary.main,
              0.3
            )}`,
          },
        },
      }}
    />
  );
};
export default CustomTextField;
