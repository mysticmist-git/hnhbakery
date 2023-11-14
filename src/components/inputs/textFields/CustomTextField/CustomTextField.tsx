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

  console.log(props);

  return (
    <TextField
      variant="filled"
      maxRows="1"
      InputProps={{
        disableUnderline: true,
        ...props.InputProps,
      }}
      inputProps={{
        sx: {
          textAlign: 'left',
          fontSize: theme.typography.body2.fontSize,
          color: theme.palette.common.black,
          fontWeight: theme.typography.body2.fontWeight,
          fontFamily: theme.typography.body2.fontFamily,
          backgroundColor: theme.palette.common.white,
          border: 3,
          borderColor: theme.palette.secondary.main,
          py: 1.5,
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
          ...props.inputProps?.sx,
        },
      }}
      {...props}
    />
  );
};
export default CustomTextField;
