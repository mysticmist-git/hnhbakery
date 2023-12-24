import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { ChatTextField } from './ChatTextField';
import { Suspense, useContext } from 'react';
import { ChatContext } from '@/lib/contexts/chatContext';
import router from 'next/router';

export function ChatFrame() {
  const { state, dispatch } = useContext(ChatContext);

  return (
    <>
      <Box
        component={'div'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Tiêu đề */}
        <ChatHeader />

        {state.uidSender === '' ? (
          <Box
            component={'div'}
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              p: 2,
            }}
          >
            <Typography
              variant="body1"
              color="secondary.main"
              sx={{
                textAlign: 'center',
              }}
            >
              Vui lòng đăng nhập để liên hệ với cửa hàng!
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                router.push('/auth/login');
                dispatch({
                  type: 'setOpen',
                  payload: { ...state, open: false },
                });
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        ) : (
          <>
            {/* Nội dung chat */}
            <Suspense
              fallback={
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress color="secondary" />
                </Box>
              }
            >
              <ChatBody />
            </Suspense>

            {/* Text field */}
            <ChatTextField />
          </>
        )}
      </Box>
    </>
  );
}
