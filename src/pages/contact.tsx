import { TextField, Button, Grid, Divider } from '@mui/material';
import React, { useState } from 'react';
import { useSnackbarService } from '@/lib/contexts';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter } from 'next/router';
import { ContactWrapper } from '@/components/Contact';

const content =
  'Cảm ơn bạn đã ghé thăm trang web của tiệm bánh và sử dụng form đóng góp / liên hệ của chúng tôi. Chúng tôi rất trân trọng ý kiến đóng góp của bạn và sẽ liên hệ lại với bạn trong thời gian sớm nhất có thể. Xin cảm ơn!';

export default function Contact() {
  // #region States

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // #endregion

  // #region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();

  // #endregion

  // #region Handlers

  async function handleSubmit() {
    console.log(name, phone, email, title, content);
    const data: ContactForm = {
      name,
      phone,
      email,
      title,
      content,
    };
    const isValid = validate({ name, phone, email, title, content });

    // If valid then submit
    if (isValid) {
      // Save form data to 'contacts' collection on firestore
      await addDoc(collection(db, 'contacts'), data);

      handleSnackbarAlert('success', 'Đã gửi thành công!');
      router.push('/thank-you-for-contact');
    }

    // If not valid then show error
    else {
      handleSnackbarAlert('error', 'Vui lòng nhập đầy đủ thông tin!');
    }
  }

  // #endregion

  // #region Functions

  interface ContactForm {
    name: string;
    phone: string;
    email: string;
    title: string;
    content: string;
  }

  function validate({ name, phone, email, title, content }: ContactForm) {
    // Check if all of them is null or empty string
    if (
      name === '' ||
      phone === '' ||
      email === '' ||
      title === '' ||
      content === ''
    ) {
      return false;
    }

    return true;
  }

  // #endregion

  return (
    <ContactWrapper content={content}>
      <Grid container spacing={1}>
        <Grid item xs={5.9} gap={1} display={'flex'} direction={'column'}>
          <TextField
            fullWidth
            title="Họ và tên"
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            title="Số điện thoại"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            type="tel"
          />
          <TextField
            fullWidth
            title="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            fullWidth
            title="Tựa đề"
            placeholder="Tựa đề của bạn..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            fullWidth
            title="Nội dung"
            placeholder="Nội dung liên hệ"
            multiline
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button color="secondary" variant="contained" onClick={handleSubmit}>
            Gửi
          </Button>
        </Grid>
      </Grid>
    </ContactWrapper>
  );
}
