import { db } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import { sendContact } from '@/lib/firestore/firestoreLib';
import { Button, Divider, Grid, TextField } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { Router, useRouter } from 'next/router';
import { title } from 'process';
import React, { createRef, memo, useRef } from 'react';

const ContactForm = () => {
  // #region Refs

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  // #endregion

  // #region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();

  // #endregion

  // #region Functions

  // #endregion

  // #region Methods

  const validateForm = (): boolean => {
    if (!nameRef?.current?.value && phoneRef?.current?.value === '')
      return false;
    if (!phoneRef?.current?.value && phoneRef?.current?.value === '')
      return false;
    if (!emailRef?.current?.value && emailRef?.current?.value === '')
      return false;
    if (!titleRef?.current?.value && titleRef?.current?.value === '')
      return false;
    if (!contentRef?.current?.value && contentRef?.current?.value === '')
      return false;

    return true;
  };

  // #endregion

  // #region Handlers

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    console.log('Running...');
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      handleSnackbarAlert('error', 'Vui lòng điền đủ thông tin');
      return;
    }

    sendContact({
      name: nameRef.current!.value,
      email: emailRef.current!.value,
      phone: phoneRef.current!.value,
      title: titleRef.current!.value,
      content: contentRef.current!.value,
    });

    handleSnackbarAlert('success', 'Gửi thành công');
    router.push('/thank-you-for-your-contact');
  };

  // #endregion

  return (
    <Grid container spacing={1} component={'form'} onSubmit={handleSubmit}>
      <Grid item xs={5.9} gap={1} display={'flex'} direction={'column'}>
        <TextField
          inputRef={nameRef}
          error={nameRef?.current?.value === ''}
          fullWidth
          title="Họ và tên"
          placeholder="Họ và tên"
          name="name"
          type="text"
        />
        <TextField
          inputRef={phoneRef}
          error={phoneRef?.current?.value === ''}
          name="phone"
          fullWidth
          title="Số điện thoại"
          placeholder="Số điện thoại"
          type="tel"
        />
        <TextField
          inputRef={emailRef}
          error={emailRef?.current?.value === ''}
          fullWidth
          title="Email"
          placeholder="Email"
          name="email"
          type="email"
        />
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
        <TextField
          inputRef={titleRef}
          error={titleRef?.current?.value === ''}
          fullWidth
          title="Tựa đề"
          placeholder="Tựa đề của bạn..."
          name="title"
          type="text"
        />
        <TextField
          inputRef={contentRef}
          error={contentRef?.current?.value === ''}
          fullWidth
          title="Nội dung"
          placeholder="Nội dung liên hệ"
          multiline
          rows={5}
          name="content"
          type="text"
        />
        <Button color="secondary" variant="contained" type="submit">
          Gửi
        </Button>
      </Grid>
    </Grid>
  );
};

export default memo(ContactForm);
