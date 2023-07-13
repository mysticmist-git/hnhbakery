import { TextField } from '@mui/material';

export function Outlined_TextField(props: any) {
  return (
    <>
      <TextField
        {...props}
        variant="outlined"
        fullWidth
        InputProps={{
          readOnly: true,
          style: {
            borderRadius: '8px',
            pointerEvents: 'none',
          },
          ...props.InputProps,
        }}
        inputProps={{
          sx: {
            ...props.textStyle,
            ...props.inputProps?.sx,
          },
        }}
        type="text"
      >
        {props.children}
      </TextField>
    </>
  );
}
