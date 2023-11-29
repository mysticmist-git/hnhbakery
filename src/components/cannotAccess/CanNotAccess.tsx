import { LockPersonRounded } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';

export function CanNotAccess() {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LockPersonRounded
            sx={{
              fontSize: 200,
              color: 'text.secondary',
            }}
          />
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Bạn không có quyền truy cập, vui lòng sử dụng tài khoản khác!
          </Typography>
        </Stack>
      </Box>
    </>
  );
}
