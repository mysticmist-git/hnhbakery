import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, TextField, alpha, useTheme } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { ForwardedRef, forwardRef, useState } from 'react';

const CustomTextFieldPassWord = (
  props: any,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <TextField
        {...props}
        inputRef={ref}
        placeholder={props.placeholder ? props.placeholder : ''}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                backgroundColor: theme.palette.common.white,
                maxHeight: 'none',
                height: 'auto',
                alignSelf: 'stretch',
                pr: 1,
              }}
            >
              <IconButton onClick={handleTogglePassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="filled"
        maxRows="1"
        style={{
          border: `3px solid ${
            props.borderColor ? props.borderColor : theme.palette.secondary.main
          }`,
          borderRadius: '8px',
          borderColor: props.borderColor
            ? props.borderColor
            : theme.palette.secondary.main,
          borderStyle: 'solid',
          overflow: 'hidden',
        }}
        sx={{
          ...props.sx,
          '&:hover': {
            boxShadow: `0px 0px 5px 2px ${alpha(
              theme.palette.secondary.main,
              0.3
            )}`,
          },
          '& .MuiInputBase-root': {
            p: 0,
          },
          '& .MuiInputAdornment-root': {
            m: 0,
          },
        }}
        inputProps={{
          sx: {
            fontSize: theme.typography.body2.fontSize,
            color: theme.palette.common.black,
            fontWeight: theme.typography.body2.fontWeight,
            fontFamily: theme.typography.body2.fontFamily,
            padding: '11.5px',
            backgroundColor: theme.palette.common.white,
          },
        }}
      />
    </>
  );
};

export default forwardRef<HTMLInputElement, any>(CustomTextFieldPassWord);
