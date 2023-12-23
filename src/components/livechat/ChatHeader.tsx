import { ChatContext } from '@/lib/contexts/chatContext';
import { LocalPhoneRounded, RemoveRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useContext } from 'react';
import { iconButtonProp, iconProp } from './LiveChat';

export function ChatHeader() {
  const { state, dispatch } = useContext(ChatContext);

  return (
    <Box
      component={'div'}
      sx={{
        backgroundColor: 'secondary.main',
        px: 2,
        py: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        borderBottom: 2,
        borderColor: 'primary.main',
      }}
    >
      <Box component={'div'}>
        <Typography variant="caption" fontWeight={'bold'}>
          H&H Bakery
        </Typography>
      </Box>

      <Stack direction="row">
        <IconButton
          {...iconButtonProp}
          onClick={() => {
            window.open('tel: 0343214971', '_blank');
          }}
        >
          <LocalPhoneRounded {...iconProp} />
        </IconButton>
        <IconButton
          {...iconButtonProp}
          onClick={() =>
            dispatch({ type: 'setOpen', payload: { ...state, open: false } })
          }
        >
          <RemoveRounded {...iconProp} />
        </IconButton>
      </Stack>
    </Box>
  );
}
