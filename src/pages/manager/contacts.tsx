import { useSnackbarService } from '@/lib/contexts';
import MailDialog from '@/lib/manage/contact/MailDialog/MailDialog';
import { Mail } from '@/lib/types/manage-contact';
import { Mail as MailIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { title } from 'process';
import { useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Contacts = ({}: {}) => {
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleSnackbarAlert = useSnackbarService();

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleNewMail = () => {
    setDialogOpen(true);
  };

  const handleSendMail = async (mail: Mail) => {
    try {
      const sendMailResponse = await fetch('/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: mail.to,
          subject: mail.content,
          text: mail.content,
        }),
      });

      if (sendMailResponse.ok) {
        handleSnackbarAlert('success', 'Mail gửi thành công');
      } else {
        const errorMessage = await sendMailResponse.json();
        console.log(errorMessage);
        handleSnackbarAlert('error', 'Lỗi xảy ra khi gửi mail');
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Quản lý liên hệ
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              *Tìm kiếm theo mã, họ tên, email, số điện thoại, ngày sinh, trạng
              thái...
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MailIcon />}
              onClick={handleNewMail}
            >
              Gửi mail
            </Button>
          </Grid>
        </Grid>
      </Box>

      <MailDialog
        open={dialogOpen}
        handleClose={handleClose}
        handleSubmit={handleSendMail}
      />
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    return {
      props: {},
    };
  } catch (error) {
    console.log(error);

    return {
      props: {},
    };
  }
};
export default Contacts;
