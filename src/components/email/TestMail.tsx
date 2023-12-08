import { Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { Resend } from 'resend';

function TestMail() {
  const sendMail = useCallback(async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <Button
      variant="contained"
      sx={{ color: 'white' }}
      onClick={async () => {
        await sendMail();
        console.log('test mail');
      }}
    >
      Gửi mail
    </Button>
  );
}

export default TestMail;
