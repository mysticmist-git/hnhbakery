import { TextField } from '@mui/material';

export default function Outlined_TextField(props: any) {
  return (
    <>
      <TextField
        variant="outlined"
        color={props.color ?? 'secondary'}
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
        {...props}
      >
        {props.children}
      </TextField>
    </>
  );
}
