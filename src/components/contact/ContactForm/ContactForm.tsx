import CustomButton from '@/components/buttons/CustomButton/';
import CustomTextarea from '@/components/inputs/TextArea/CustomTextArea';
import CustomTextField from '@/components/inputs/textFields/CustomTextField';
import { useSnackbarService } from '@/lib/contexts';
import { sendContact } from '@/lib/firestore';
import Contact from '@/models/contact';
import { Grid, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { memo, useRef } from 'react';

const ContactForm = () => {
  // #region Refs

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // #endregion

  // #region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();
  const theme = useTheme();

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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      handleSnackbarAlert('error', 'Vui lòng điền đủ thông tin');
      return;
    }

    const contactForm: Omit<Contact, 'id'> = {
      name: nameRef.current!.value,
      mail: emailRef.current!.value,
      tel: phoneRef.current!.value,
      title: titleRef.current!.value,
      content: contentRef.current!.value,
      isRead: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await sendContact(contactForm);

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
            <Typography variant="button" color={theme.palette.common.black}>
              Thông tin liên hệ
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              ref={nameRef}
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
              ref={phoneRef}
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
              ref={emailRef}
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
            <Typography variant="button" color={theme.palette.common.black}>
              Nội dung liên hệ
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              ref={titleRef}
              error={titleRef?.current?.value === ''}
              fullWidth
              placeholder="Chủ đề"
              name="title"
              type="text"
            />
          </Grid>
          <Grid item xs={12}>
            <Stack
              sx={{
                border: 3,
                borderColor: theme.palette.secondary.main,
                borderRadius: '8px',
                overflow: 'hidden',
                bgColor: theme.palette.common.white,
              }}
            >
              <CustomTextarea
                // inputRef={contentRef}
                // error={contentRef?.current?.value === ''}
                ref={contentRef}
                placeholder="Mô tả"
                name="content"
                style={{
                  minHeight: '132px',
                }}
              />
            </Stack>
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
