import { ChatContext } from '@/lib/contexts/chatContext';
import { MessageRounded, Try } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  IconButtonProps,
  Slide,
  SvgIconProps,
  Typography,
  Zoom,
  useTheme,
} from '@mui/material';
import { useContext, useState } from 'react';
import { ChatFrame } from './ChatFrame';
import { createUserChat, getUserChat } from '@/lib/DAO/userChatDAO';
import UserChat, { ChatWithType } from '@/models/userChat';

export const iconButtonProp: IconButtonProps = {
  size: 'small',
  sx: {
    color: 'primary.main',
    '&:hover': {
      color: 'secondary.main',
      backgroundColor: 'primary.main',
    },
  },
};

export const iconProp: SvgIconProps = {
  fontSize: 'inherit',
  color: 'inherit',
};

export function LiveChat() {
  const theme = useTheme();
  const { state, dispatch } = useContext(ChatContext);
  console.log(state);

  return (
    <>
      <Box
        component={'div'}
        sx={{
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(3),
          zIndex: theme.zIndex.drawer,
          display: state.canChat ? 'block' : 'none',
        }}
      >
        <Zoom in={!state.open}>
          <IconButton
            onClick={async () => {
              async function getuserchat() {
                try {
                  if (state.uidClient == '') return;
                  const userChat = await getUserChat(state.uidClient);

                  if (!userChat) {
                    const data: UserChat = {
                      uid: state.uidClient,
                      chatWith: [],
                    };
                    await createUserChat(data);
                  }
                } catch (error) {
                  console.log(error);
                }
              }
              if (state.uidClient != '') {
                await getuserchat();
              }

              dispatch({ type: 'setOpen', payload: { ...state, open: true } });
            }}
            sx={{
              height: theme.spacing(8),
              width: theme.spacing(8),
              border: 2,
              borderColor: 'secondary.main',
              backgroundColor: 'secondary.main',
              color: 'white',
              boxShadow: 3,
              '&:hover': {
                opacity: 0.9,
                color: 'secondary.main',
                backgroundColor: 'white',
              },
            }}
          >
            <MessageRounded color="inherit" />
          </IconButton>
        </Zoom>
      </Box>

      <Box
        component={'div'}
        sx={{
          position: 'fixed',
          bottom: 0,
          right: theme.spacing(3 + 8 + 3),
          zIndex: theme.zIndex.drawer,
          display: state.canChat ? 'block' : 'none',
        }}
      >
        <Slide direction="up" in={state.open} mountOnEnter unmountOnExit>
          <Box
            component={'div'}
            sx={{
              backgroundColor: 'primary.main',
              border: 2,
              borderRadius: '16px 16px 0 0',
              boxShadow: 3,
              borderColor: 'secondary.main',
              overflow: 'hidden',
              width: '328px',
              height: '400px',
            }}
          >
            <ChatFrame />
          </Box>
        </Slide>
      </Box>
    </>
  );
}
