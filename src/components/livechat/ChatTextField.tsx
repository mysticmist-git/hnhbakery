import {
  AddPhotoAlternateRounded,
  CloseRounded,
  SendRounded,
} from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { iconButtonProp, iconProp } from './LiveChat';
import { useCallback, useContext, useRef, useState } from 'react';
import { ChatContext } from '@/lib/contexts/chatContext';
import { getUserChat, updateUserChat } from '@/lib/DAO/userChatDAO';
import UserChat, { ChatWithType } from '@/models/userChat';
import User from '@/models/user';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { createChat, getChat, updateChat } from '@/lib/DAO/chatDAO';
import Chat, { Message } from '@/models/chat';
import { Stack, useTheme } from '@mui/system';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase/config';
import * as uuid from 'uuid';

async function handleSendMessage(
  sender: { uid: string; name?: string },
  receiver: { uid: string; name?: string },
  combileId: string,
  text: string,
  images?: File[]
) {
  if (
    sender.uid == '' ||
    receiver.uid == '' ||
    (text == '' && (!images || images.length == 0))
  ) {
    console.log('Rỗng');
    return;
  }
  const date = new Date();

  // Upload hình
  let imagesUrl: string[] = [];
  if (images) {
    await Promise.all(
      images.map(async (file, i) => {
        const storageRef = ref(
          storage,
          `/chatImages/${sender.uid + '_' + uuid.v4()}`
        );
        return await uploadBytes(storageRef, file).then((snapshot) => {
          imagesUrl.push(snapshot.metadata.fullPath);
        });
      })
    );

    await Promise.all(
      imagesUrl.map(
        async (url, i) =>
          await getDownloadURL(ref(storage, url)).then((url) => {
            imagesUrl[i] = url;
          })
      )
    );
  }

  // Cập nhật Chat
  const textContent: string[] =
    text == '' ? [...imagesUrl] : [text, ...imagesUrl];
  let message: Message = {
    id: '',
    date: date,
    sender: {
      name: sender.name ?? '',
      uid: sender.uid,
    },
    text: textContent,
  };
  let chat: Chat | undefined = await getChat(combileId);
  if (!chat) {
    message.id = '1';
    await createChat({
      id: combileId,
      messages: [message],
    });
  } else {
    message.id = (
      Math.max(...chat.messages.map((item) => parseInt(item.id))) + 1
    ).toString();
    chat.messages.push(message);
    await updateChat(combileId, chat);
  }

  // Lấy UserChat
  let userChats: (UserChat | undefined)[] = [];
  await Promise.all(
    [sender.uid, receiver.uid].map(async (uid) => await getUserChat(uid))
  ).then((res) => (userChats = res));

  if (userChats[0] == undefined || userChats[1] == undefined) {
    console.log('Khong tim thay user chat');
    return;
  }

  // Cập nhật ChatWith
  const lastMessage =
    message.text.length > 0 ? message.text[message.text.length - 1] : '';
  const chatWith: ChatWithType = {
    id: combileId,
    date: date,
    userInfor: {
      uid: receiver.uid,
      name: receiver.name ?? '',
    },
    lastMessage: lastMessage,
    isRead: true,
  };

  // Cập nhật Userchat
  const senderChatWithIndex = userChats[0].chatWith.findIndex(
    (item) => item.id === chatWith.id
  );
  const receiverChatWithIndex = userChats[1].chatWith.findIndex(
    (item) => item.id === chatWith.id
  );
  senderChatWithIndex == -1
    ? userChats[0].chatWith.push(chatWith)
    : (userChats[0].chatWith[senderChatWithIndex] = chatWith);

  const chatWithReceiver = {
    ...chatWith,
    userInfor: {
      uid: sender.uid,
      name: sender.name ?? '',
    },
    isRead: false,
  };
  receiverChatWithIndex == -1
    ? userChats[1].chatWith.push(chatWithReceiver)
    : (userChats[1].chatWith[receiverChatWithIndex] = chatWithReceiver);

  await Promise.all(
    userChats.map(async (item) => await updateUserChat(item!.uid, item!))
  );
}

export function ChatTextField() {
  const theme = useTheme();
  const textRef = useRef<any>(null);
  const { state } = useContext(ChatContext);

  const imageRef = useRef<HTMLInputElement>(null);
  const [imageArray, setImageArray] = useState<File[]>([]);
  const handleImageArrayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const array = Array.from(e.target.files);
        setImageArray((prev) => {
          return [...prev, ...array];
        });
      }
    },
    []
  );
  const removeImage = useCallback((index: number) => {
    setImageArray((prev) => {
      const newImageArray = [...prev];
      newImageArray.splice(index, 1);
      if (imageRef.current && newImageArray.length == 0) {
        imageRef.current.value = '';
      }
      return newImageArray;
    });
  }, []);

  const reset = useCallback(() => {
    textRef.current.value = '';
    setImageArray([]);
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  }, []);

  return (
    <Box
      component={'div'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderTop: 2,
        borderColor: 'secondary.main',
      }}
    >
      <Stack
        direction="row"
        flexWrap={'wrap'}
        sx={{ p: imageArray.length > 0 ? 0.5 : 0 }}
      >
        {imageArray.map((item, index) => (
          <Box
            component={'div'}
            sx={{
              width: 'calc(100% / 4)',
              aspectRatio: '1/1',
              p: 0.5,
              position: 'relative',
            }}
          >
            <Box
              component={'img'}
              src={URL.createObjectURL(item)}
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: 'red',
                borderRadius: 3,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: theme.spacing(1),
                right: theme.spacing(1),
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  color: 'white',
                },
                fontSize: 'caption.fontSize',
              }}
              size="small"
              onClick={() => {
                confirm('Bạn muốn xóa ảnh này?') && removeImage(index);
              }}
            >
              <CloseRounded
                fontSize="inherit"
                sx={{
                  color: 'inherit',
                  pointerEvents: 'none',
                }}
              />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <TextField
        multiline
        fullWidth
        onFocus={async () => {
          if (state.uidSender == '') {
            return;
          }

          const userChat = await getUserChat(state.uidSender);
          if (!userChat) {
            return;
          }
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
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(
              { uid: state.uidSender, name: state.senderName },
              { uid: state.uidReceiver, name: state.receiverName },
              state.combileId,
              textRef.current.value,
              imageArray
            );
            reset();
          }
        }}
        inputRef={textRef}
        sx={{
          backgroundColor: 'white',
          '& fieldset': { border: 'none' },
        }}
        InputProps={{
          sx: {
            fontSize: 'body2.fontSize',
            fontWeight: 500,
          },
          startAdornment: (
            <InputAdornment position="start">
              <Box
                component={'label'}
                sx={{
                  color: 'secondary.main',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'secondary.main',
                    borderRadius: '50%',
                  },
                }}
              >
                <input
                  ref={imageRef}
                  accept="image/*"
                  hidden
                  multiple
                  type="file"
                  onChange={handleImageArrayChange}
                />
                <IconButton
                  {...iconButtonProp}
                  sx={{
                    pointerEvents: 'none',
                    color: 'inherit',
                  }}
                >
                  <AddPhotoAlternateRounded
                    {...iconProp}
                    sx={{ pointerEvents: 'none' }}
                  />
                </IconButton>
              </Box>
            </InputAdornment>
          ),
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
                onClick={() => {
                  handleSendMessage(
                    { uid: state.uidSender, name: state.senderName },
                    { uid: state.uidReceiver, name: state.receiverName },
                    state.combileId,
                    textRef.current.value,
                    imageArray
                  );
                  reset();
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
