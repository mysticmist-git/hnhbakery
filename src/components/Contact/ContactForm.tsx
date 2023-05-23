import { db } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import { sendContact } from '@/lib/firestore/firestoreLib';
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { Router, useRouter } from 'next/router';
import { title } from 'process';
import React, { createRef, memo, useRef } from 'react';
import CustomTextField from '../Inputs/CustomTextField';
import theme from '@/styles/themes/lightTheme';
import { CustomTextarea } from '../Inputs/CustomTextarea';
import CustomButton from '../Inputs/Buttons/customButton';

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
    <Grid
      container
      justifyContent={'center'}
      alignItems={'start'}
      direction={'row'}
      spacing={2}
      component={'form'}
      onSubmit={handleSubmit}
    >
      <Grid item xs={12}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'start'}
          direction={'row'}
          spacing={1}
        >
          <Grid item xs={12}>
            <Typography variant="button" color={theme.palette.common.white}>
              Thông tin liên hệ
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              inputRef={nameRef}
              error={nameRef?.current?.value === ''}
              fullWidth
              placeholder="Họ và tên"
              required
              autoComplete="name"
              name="name"
              type="text"
            />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              inputRef={phoneRef}
              error={phoneRef?.current?.value === ''}
              name="phone"
              fullWidth
              placeholder="Số điện thoại"
              type="tel"
              autoComplete="tel"
            />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              inputRef={emailRef}
              error={emailRef?.current?.value === ''}
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              autoComplete="email"
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'start'}
          direction={'row'}
          spacing={1}
        >
          <Grid item xs={12}>
            <Typography variant="button" color={theme.palette.common.white}>
              Nội dung iên hệ
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              inputRef={titleRef}
              error={titleRef?.current?.value === ''}
              fullWidth
              placeholder="Chủ đề"
              name="title"
              type="text"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                border: 3,
                borderColor: theme.palette.secondary.main,
                borderRadius: '8px',
                overflow: 'hidden',
                bgcolor: theme.palette.common.white,
              }}
            >
              <CustomTextarea
                // inputRef={contentRef}
                // error={contentRef?.current?.value === ''}
                placeholder="Mô tả"
                name="content"
                style={{
                  minHeight: '132px',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={'auto'}>
        <CustomButton type="submit" sx={{ px: 8 }}>
          <Typography variant="button" color={theme.palette.common.white}>
            Gửi
          </Typography>
        </CustomButton>
      </Grid>
    </Grid>
  );
};

export default memo(ContactForm);
