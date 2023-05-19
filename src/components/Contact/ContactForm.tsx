import { Button, Divider, Grid, TextField } from '@mui/material';
import React, { memo } from 'react';

const ContactForm = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={5.9} gap={1} display={'flex'} direction={'column'}>
        <TextField fullWidth title="Họ và tên" placeholder="Họ và tên" />
        <TextField
          fullWidth
          title="Số điện thoại"
          placeholder="Số điện thoại"
        />
        <TextField fullWidth title="Email" placeholder="Email" />
      </Grid>
      <Grid item xs={0.2} justifyContent={'center'} display={'flex'}>
        <Divider
          orientation="vertical"
          sx={{
            color: (theme) => theme.palette.common.black,
          }}
        />
      </Grid>
      <Grid item xs={5.9} gap={1} display={'flex'} direction={'column'}>
        <TextField fullWidth title="Tựa đề" placeholder="Tựa đề của bạn..." />
        <TextField
          fullWidth
          title="Nội dung"
          placeholder="Nội dung liên hệ"
          multiline
          rows={5}
        />
        <Button color="secondary" variant="contained">
          Gửi
        </Button>
      </Grid>
    </Grid>
  );
};

export default memo(ContactForm);
