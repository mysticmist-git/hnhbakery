import { getChatRefById } from '@/lib/DAO/chatDAO';
import { ChatContext } from '@/lib/contexts/chatContext';
import Chat, { Message } from '@/models/chat';
import { Avatar, Box, DialogContent, Typography } from '@mui/material';
import { Stack, useTheme } from '@mui/system';
import { onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { isWebUri } from 'valid-url';
import { ChatImage } from './ChatImage';
import { ChatImageDialog } from './ChatImageDialog';
import logo from '@/assets/Logo.png';
import { getUserChatRefByUid } from '@/lib/DAO/userChatDAO';

export function ChatBody() {
  const theme = useTheme();

  const scrollDiv = useRef<HTMLDivElement | null>(null);
  const { state } = useContext(ChatContext);

  const [chatData, setChatData] = useState<Chat | undefined>(undefined);
  const [isReadByReceiver, setIsReadByReceiver] = useState(false);

  useEffect(() => {
    if (state.combileId == '') return;
    const unsub = onSnapshot(getChatRefById(state.combileId), (doc) => {
      const data = doc.data();
      setChatData(data);
    });

    const unsub2 = onSnapshot(getUserChatRefByUid(state.uidReceiver), (doc) => {
      const chatWith = doc
        .data()
        ?.chatWith.find((item) => item.id == state.combileId);
      chatWith
        ? setIsReadByReceiver(chatWith.isRead)
        : setIsReadByReceiver(false);
    });

    return () => {
      unsub();
      unsub2();
    };
  }, [state.combileId]);

  const [displayMessage, setDisplayMessage] = useState<Message[]>(
    chatData?.messages || []
  );
  useEffect(() => {
    if (!chatData) {
      return;
    }
    const message = chatData.messages.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const final: Message[] = [];
    for (let i = 0; i < message.length; i++) {
      if (
        i - 1 >= 0 &&
        message[i].sender.uid === final[final.length - 1].sender.uid
      ) {
        final[final.length - 1].text = [
          ...final[final.length - 1].text,
          ...message[i].text,
        ];
        final[final.length - 1].date = message[i].date;
      } else {
        final.push(message[i]);
      }
    }
    setDisplayMessage(final);
  }, [chatData]);

  useEffect(() => {
    scrollDiv.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessage]);

  // Dialog Image
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dialogSrc, setDialogSrc] = useState('');
  const handleDialogImage = (src: string) => {
    setDialogSrc(src);
    handleOpen();
  };

  return (
    <Box
      component={'div'}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: 1,
      }}
    >
      {displayMessage.length > 0 && (
        <Stack
          direction="column"
          spacing={1}
          sx={{ pb: 1, height: 'fit-content', minHeight: '100%' }}
          justifyContent={'flex-end'}
        >
          {displayMessage.map((item, index) => (
            <Box
              key={index}
              component={'div'}
              sx={{
                display: 'flex',
                flexDirection:
                  item.sender.uid === state.uidSender ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
              }}
            >
              <Avatar
                sx={{
                  width: theme.spacing(4),
                  height: theme.spacing(4),
                  fontSize: 'body2.fontSize',
                  backgroundColor:
                    item.sender.uid === state.uidSender
                      ? 'secondary.main'
                      : 'primary.dark',
                  textTransform: 'capitalize',
                }}
                alt={item.sender.name}
                src="/broken-image.jpg"
              />
              <Stack
                direction="column"
                spacing={0.6}
                alignItems={
                  item.sender.uid === state.uidSender
                    ? 'flex-end'
                    : 'flex-start'
                }
                sx={{ flexGrow: 1 }}
              >
                <Typography
                  variant="caption"
                  fontWeight={'regular'}
                  sx={{
                    px: 1.4,
                    display:
                      item.sender.uid === state.uidSender ? 'none' : 'block',
                    lineHeight: 1,
                  }}
                >
                  {item.sender.name}
                </Typography>

                {item.text.map((text, i) =>
                  !isWebUri(text) ? (
                    <Typography
                      key={i}
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        width: 'fit-content',
                        maxWidth: '100%',
                        px: 1.4,
                        py: 1,
                        backgroundColor:
                          item.sender.uid === state.uidSender
                            ? 'secondary.main'
                            : 'primary.dark',
                        color: 'white',
                        borderRadius:
                          item.text.length == 1
                            ? '16px'
                            : item.sender.uid === state.uidSender
                            ? i == 0
                              ? '16px 16px 0px 16px'
                              : i == item.text.length - 1
                              ? '16px 0px 16px 16px'
                              : '16px 0px 0px 16px'
                            : i == 0
                            ? '16px 16px 16px 0px'
                            : i == item.text.length - 1
                            ? '0px 16px 16px 16px'
                            : '0px 16px 16px 0px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {text}
                    </Typography>
                  ) : (
                    <ChatImage
                      key={i}
                      src={text}
                      handleDialogImage={handleDialogImage}
                    />
                  )
                )}
                <Typography
                  variant="caption"
                  fontWeight={'regular'}
                  sx={{
                    display:
                      item.sender.uid === state.uidSender ? 'block' : 'none',
                    lineHeight: 1,
                  }}
                >
                  {isReadByReceiver ? 'Đã xem' : 'Đã nhận'}
                </Typography>
              </Stack>
              <Box
                component={'div'}
                sx={{
                  width: theme.spacing(4),
                  minWidth: theme.spacing(4),
                }}
              />
            </Box>
          ))}

          <Box component={'div'} ref={scrollDiv} />
        </Stack>
      )}

      {displayMessage.length == 0 && state.senderType == 'client' && (
        <Stack
          direction={'column'}
          spacing={1}
          sx={{ width: '100%', height: '100%' }}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box
            component={'img'}
            loading="lazy"
            src={logo.src}
            sx={{ width: '100%', height: '100px', objectFit: 'contain' }}
          />
          <Typography
            variant="caption"
            color="secondary"
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Liên lạc với H&H ngay!
            <br />
            Chúng tôi sẽ phản hồi trong
            <br />
            thời gian sớm nhất!
          </Typography>
        </Stack>
      )}

      {state.senderType == 'staff' && state.uidReceiver == '' && (
        <Stack
          direction={'column'}
          spacing={1}
          sx={{ width: '100%', height: '100%' }}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography
            variant="caption"
            color="secondary"
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Vui lòng chọn khách hàng!
          </Typography>
        </Stack>
      )}

      {/* Image dialog */}
      <ChatImageDialog open={open} handleClose={handleClose} src={dialogSrc} />
    </Box>
  );
}
