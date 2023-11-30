import bg10 from '@/assets/Decorate/bg10.png';
import { CustomButton } from '@/components/buttons';
import { CustomTextField } from '@/components/inputs/textFields';
import { createContact } from '@/lib/DAO/contactDAO';
import { useSnackbarService } from '@/lib/contexts';
import { validateEmail } from '@/lib/utils';
import Contact from '@/models/contact';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

//#region Khuyến mãi
export function DangKyKhuyenMai(props: any) {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const handleSnackbarAlert = useSnackbarService();

  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '80vh',
        minHeight: '300px',
        backgroundImage: `url(${bg10.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        spacing={2}
        pb={4}
      >
        <Grid item xs={11}>
          <Typography
            align="center"
            color={theme.palette.secondary.main}
            variant="h2"
          >
            Khuyến mãi mỗi ngày
          </Typography>
          <Typography
            variant="body2"
            color={theme.palette.common.black}
            align="center"
          >
            Đăng ký email để nhận ưu đãi và thông tin các chương trình khuyến
            mãi
          </Typography>
        </Grid>
        <Grid item xs={11} sm={8} md={6}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={1}
            width={'100%'}
          >
            <Grid item xs={true}>
              <CustomTextField
                sx={{
                  width: '100%',
                }}
                placeholder="Email của bạn"
                type="email"
                borderColor={theme.palette.secondary.main}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton
                sx={{
                  height: '100%',
                  borderRadius: '8px',
                  py: '12px',
                  px: 3,
                }}
                onClick={async () => {
                  if (email == '') {
                    handleSnackbarAlert('warning', ' Vui lòng điền email!');
                    return;
                  }
                  if (validateEmail(email) == false) {
                    handleSnackbarAlert('error', ' Email không hợp lệ!');
                    return;
                  }

                  try {
                    const contact: Omit<Contact, 'id'> = {
                      mail: email,
                      name: 'Khách vãng lai',
                      tel: '',
                      title: 'Đăng ký nhận khuyến mãi',
                      content: 'Trống',
                      isRead: false,
                      created_at: new Date(),
                      updated_at: new Date(),
                    };

                    await createContact(contact);

                    handleSnackbarAlert(
                      'success',
                      ' Đăng ký Email thành công!'
                    );
                  } catch (error: any) {
                    console.log(error);
                  }
                }}
              >
                <Typography variant="button" color={theme.palette.common.white}>
                  Đăng ký
                </Typography>
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
