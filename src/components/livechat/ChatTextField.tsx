import { SendRounded } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { iconButtonProp, iconProp } from './LiveChat';

export function ChatTextField() {
  return (
    <Box component={'div'}>
      <TextField
        multiline
        fullWidth
        sx={{
          backgroundColor: 'white',
          borderTop: 2,
          borderColor: 'secondary.main',
          '& fieldset': { border: 'none' },
        }}
        InputProps={{
          sx: {
            fontSize: 'body2.fontSize',
            fontWeight: 500,
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                {...iconButtonProp}
                sx={{
                  color: 'secondary.main',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'secondary.main',
                  },
                }}
              >
                <SendRounded {...iconProp} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
