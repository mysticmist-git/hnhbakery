import { TextField, alpha, useTheme } from '@mui/material';
import React, { memo } from 'react';

const CustomTextField = (props: any) => {
  const theme = useTheme();
  return (
    <>
      <TextField
        sx={{
          borderRadius: '8px',
          width: props.width ? props.width : '100%',
          bgcolor: theme.palette.common.white,
          overflow: 'hidden',
          border: 3,
          borderColor: props.borderColor
            ? props.borderColor
            : theme.palette.secondary.main,
          '&:hover': {
            boxShadow: `0px 0px 5px 2px ${alpha(
              theme.palette.secondary.main,
              0.3,
            )}`,
          },
        }}
        inputProps={{
          style: {
            fontSize: theme.typography.body2.fontSize,
            color: 'black',
            fontWeight: theme.typography.body2.fontWeight,
            fontFamily: theme.typography.body2.fontFamily,
            padding: '11.5px',
            backgroundColor: theme.palette.common.white,
          },
        }}
        InputProps={{ disableUnderline: true }}
        hiddenLabel
        fullWidth
        placeholder={props.placeholder ? props.placeholder : ''}
        type={props.type ? props.type : 'text'}
        variant="filled"
        maxRows="1"
      />
    </>
  );
};
export default memo(CustomTextField);
