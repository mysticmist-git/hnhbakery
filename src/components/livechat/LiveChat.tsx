import { ChatContext } from '@/lib/contexts/chatContext';
import { MessageRounded, RecommendRounded, Try } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  IconButton,
  IconButtonProps,
  Slide,
  Stack,
  SvgIconProps,
  Typography,
  Zoom,
  useTheme,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChatFrame } from './ChatFrame';
import {
  createUserChat,
  getUserChat,
  getUserChatRefByUid,
  updateUserChat,
} from '@/lib/DAO/userChatDAO';
import UserChat, { ChatWithType } from '@/models/userChat';
import { onSnapshot } from 'firebase/firestore';

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
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (state.uidSender == '') {
      return;
    }

    const unsub = onSnapshot(getUserChatRefByUid(state.uidSender), (doc) => {
      let data = doc.data();
      if (!data) {
        setIsNew(false);
      } else {
        const isRead = data.chatWith.find(
          (item) => item.id == state.combileId
        )?.isRead;
        if (isRead == false) {
          setIsNew(true);
        } else {
          setIsNew(false);
        }
      }
    });

    return () => {
      unsub();
    };
  }, [state.uidSender]);

  return (
    <>
      <Box
        component={'div'}
        sx={{
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(3),
          zIndex: theme.zIndex.drawer,
          display:
            state.canChat && state.senderType == 'client' ? 'block' : 'none',
        }}
      >
        <Zoom in={!state.open}>
          <Badge badgeContent={isNew ? 1 : 0} color="secondary">
            <IconButton
              onClick={async () => {
                async function getuserchat() {
                  try {
                    if (state.uidSender == '') return;
                    const userChat = await getUserChat(state.uidSender);

                    if (!userChat) {
                      const data: UserChat = {
                        uid: state.uidSender,
                        chatWith: [],
                      };
                      await createUserChat(data);
                    } else {
                      const isRead = userChat.chatWith.find(
                        (item) => item.id == state.combileId
                      )?.isRead;
                      if (isRead == false) {
                        await updateUserChat(userChat.uid, {
                          ...userChat,
                          chatWith: userChat.chatWith.map((item) => {
                            if (item.id == state.combileId) {
                              return {
                                ...item,
                                isRead: true,
                              };
                            } else {
                              return item;
                            }
                          }),
                        });
                      }
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
                if (state.uidSender != '') {
                  await getuserchat();
                }

                dispatch({
                  type: 'setOpen',
                  payload: { ...state, open: true },
                });
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
          </Badge>
        </Zoom>
      </Box>

      <Box
        component={'div'}
        sx={{
          position: 'fixed',
          bottom: 0,
          right: theme.spacing(3 + 8 + 3),
          zIndex: theme.zIndex.drawer,
          display:
            state.canChat && state.senderType == 'client' ? 'block' : 'none',
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
