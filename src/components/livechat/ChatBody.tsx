import { Avatar, Box, Typography } from '@mui/material';
import { Stack, useTheme } from '@mui/system';
import { useEffect, useRef, useState } from 'react';

export function ChatBody() {
  const theme = useTheme();
  const uid = '1';

  const scrollDiv = useRef<HTMLDivElement | null>(null);

  const [displayData, setDisplayData] = useState(ChatData);
  useEffect(() => {
    scrollDiv.current?.scrollIntoView({ behavior: 'smooth' });

    const final = [];
    for (let i = 0; i < ChatData.length; i++) {
      if (
        i - 1 >= 0 &&
        ChatData[i].sender.uid === final[final.length - 1].sender.uid
      ) {
        final[final.length - 1].text = [
          ...final[final.length - 1].text,
          ...ChatData[i].text,
        ];
        final[final.length - 1].date = ChatData[i].date;
      } else {
        final.push(ChatData[i]);
      }
    }
    setDisplayData(final);
  }, [ChatData]);

  return (
    <Box
      component={'div'}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: 1,
      }}
    >
      <Stack direction="column" spacing={1} sx={{ pb: 1 }}>
        {displayData.map((item, index) => (
          <Box
            key={index}
            component={'div'}
            sx={{
              display: 'flex',
              flexDirection: item.sender.uid === uid ? 'row-reverse' : 'row',
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
                  item.sender.uid === uid ? 'secondary.main' : 'primary.dark',
                textTransform: 'capitalize',
              }}
              alt={item.sender.name}
              src="/broken-image.jpg"
            />
            <Stack direction="column" spacing={0.5}>
              <Typography
                variant="caption"
                fontWeight={'regular'}
                sx={{
                  px: 1.4,
                  display: item.sender.uid === uid ? 'none' : 'block',
                  lineHeight: 1,
                }}
              >
                {item.sender.name}
              </Typography>
              {item.text.map((text, i) => (
                <Box component={'div'} key={i}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      maxWidth: '100%',
                      px: 1.4,
                      py: 1,
                      backgroundColor:
                        item.sender.uid === uid
                          ? 'secondary.main'
                          : 'primary.dark',
                      color: 'white',
                      borderRadius:
                        item.text.length == 1
                          ? '16px'
                          : item.sender.uid === uid
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
                </Box>
              ))}
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
    </Box>
  );
}

const ChatData = [
  {
    id: '2',
    date: new Date(),
    sender: {
      uid: '2',
      name: 'Khanh',
    },
    text: ['hi'],
  },
  {
    id: '1',
    date: new Date(),
    sender: {
      uid: '1',
      name: 'Huy',
    },
    text: ['hello'],
  },
  {
    id: '2',
    date: new Date(),
    sender: {
      uid: '2',
      name: 'Khanh',
    },
    text: ['hi'],
  },
  {
    id: '2',
    date: new Date(),
    sender: {
      uid: '2',
      name: 'Khanh',
    },
    text: ['hi'],
  },
  {
    id: '2',
    date: new Date(),
    sender: {
      uid: '2',
      name: 'Khanh',
    },
    text: ['hi'],
  },
  {
    id: '3',
    date: new Date(),
    sender: {
      uid: '1',
      name: 'Huy',
    },
    text: ['bao lâu không gặp?'],
  },
  {
    id: '4',
    date: new Date(),
    sender: {
      uid: '1',
      name: 'Huy',
    },
    text: ['bao lâu không gặp?'],
  },
  {
    id: '5',
    date: new Date(),
    sender: {
      uid: '1',
      name: 'Huy',
    },
    text: ['bao lâu không gặp?'],
  },
  {
    id: '5',
    date: new Date(),
    sender: {
      uid: '1',
      name: 'Huy',
    },
    text: ['bao lâu không gặp?'],
  },
];
