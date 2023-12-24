import { ChatFrame } from '@/components/livechat/ChatFrame';
import { getUserChatRefByUid, updateUserChat } from '@/lib/DAO/userChatDAO';
import { ChatContext } from '@/lib/contexts/chatContext';
import UserChat from '@/models/userChat';
import { InfoRounded, SearchRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import * as diacritics from 'diacritics';

export function ChatManagement() {
  const { state, dispatch } = useContext(ChatContext);

  //#region Tab
  const [uidReceiver, setUidReceiver] = useState(state.combileId);

  const handleUidReceiverChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    if (!userChatData) {
      return;
    }
    setUidReceiver(newValue);
    const receiver = userChatData.chatWith.find((chat) => chat.id === newValue);
    if (!receiver) return;
    dispatch({
      type: 'setUidReceiver',
      payload: {
        ...state,
        uidReceiver: receiver.userInfor.uid,
        receiverName: receiver.userInfor.name,
      },
    });
    if (receiver.isRead == false) {
      const userChat: UserChat = {
        ...userChatData,
        chatWith: userChatData.chatWith.map((item) => {
          if (item.id === newValue) {
            return {
              ...item,
              isRead: true,
            };
          } else {
            return item;
          }
        }),
      };
      setUserChatData(userChat);
      await updateUserChat(state.uidSender, userChat);
    }
  };
  //#endregion

  const [searchText, setSearchText] = useState<string>('');

  const [userChatData, setUserChatData] = useState<UserChat | undefined>(
    undefined
  );

  useEffect(() => {
    if (state.uidSender == '') return;
    const unsub = onSnapshot(getUserChatRefByUid(state.uidSender), (doc) => {
      let data = doc.data();
      setUserChatData(data);
    });

    return () => {
      unsub();
    };
  }, [state.uidSender]);

  // Dialog Image
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [uid, setUid] = useState('');
  const handleDialogUid = (uid: string) => {
    setUid(uid);
    handleOpen();
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems={'stretch'}
        sx={{
          width: '100%',
          boxShadow: 2,
        }}
      >
        <Stack
          sx={{
            width: '30%',
            minWidth: '30%',
            maxWidth: '30%',
            backgroundColor: 'white',
            height: '600px',
            maxHeight: '600px',
            borderRight: 2,
            borderColor: 'primary.main',
          }}
        >
          <Box
            component={'div'}
            sx={{
              width: '100%',
            }}
          >
            <TextField
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                backgroundColor: 'white',
                '& fieldset': { border: 'none' },
                borderBottom: 2,
                borderColor: 'primary.main',
              }}
              InputProps={{
                sx: {
                  fontSize: 'body2.fontSize',
                  fontWeight: 500,
                },
                endAdornment: (
                  <InputAdornment position="end" disablePointerEvents>
                    <IconButton
                      sx={{
                        color: 'primary.dark',
                      }}
                    >
                      <SearchRounded fontSize="inherit" color="inherit" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={uidReceiver}
            onChange={handleUidReceiverChange}
            textColor="secondary"
            indicatorColor="secondary"
            scrollButtons={false}
          >
            {userChatData &&
              userChatData.chatWith
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .filter((item) =>
                  diacritics
                    .remove(item.userInfor.name.toLowerCase())
                    .includes(diacritics.remove(searchText.toLowerCase()))
                )
                .map((item, index) => (
                  <Tab
                    key={index}
                    value={item.id}
                    label={
                      <Stack
                        direction="row"
                        alignItems={'center'}
                        sx={{
                          width: '100%',
                          backgroundColor: 'inherit',
                        }}
                      >
                        <Box
                          component={'div'}
                          sx={{
                            width: '30%',
                            aspectRatio: '1 / 1',
                            borderRadius: '50%',
                            backgroundColor: 'secondary.main',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: '100%',
                              height: '100%',
                              fontSize: 'body2.fontSize',
                              backgroundColor:
                                item.id == uidReceiver
                                  ? 'secondary.main'
                                  : 'primary.dark',
                              textTransform: 'capitalize',
                            }}
                            alt={item.userInfor.name}
                            src="/broken-image.jpg"
                          />
                        </Box>

                        <Stack
                          direction="column"
                          justifyContent={'center'}
                          alignItems={'flex-start'}
                          sx={{
                            pl: 2,
                            width: '70%',
                            maxWidth: '70%',
                            minWidth: '70%',
                            py: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={900}
                            sx={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              width: '100%',
                              textAlign: 'left',
                            }}
                          >
                            {item.userInfor.name}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent={'space-between'}
                            sx={{ width: '100%' }}
                          >
                            <Box
                              component={'div'}
                              sx={{
                                width: '75%',
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight={item.isRead ? 'regular' : 'bold'}
                                sx={{
                                  textAlign: 'left',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {item.lastMessage}
                              </Typography>
                            </Box>

                            <Typography
                              variant="caption"
                              sx={{
                                textAlign: 'right',
                              }}
                            >
                              {item.date.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </Stack>
                        </Stack>

                        <IconButton
                          disableRipple
                          sx={{}}
                          onClick={() => {
                            alert('Call');
                          }}
                        >
                          <InfoRounded />
                        </IconButton>
                      </Stack>
                    }
                  />
                ))}
          </Tabs>
        </Stack>
        <Box component={'div'} sx={{ width: '70%', height: '600px' }}>
          <ChatFrame />
        </Box>
      </Stack>
    </>
  );
}
