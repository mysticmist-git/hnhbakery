import { ContactTable, MyModal } from '@/components/contacts';
import { getContacts } from '@/lib/DAO/contactDAO';
import { useSnackbarService } from '@/lib/contexts';
import MailDialog from '@/lib/manage/contact/MailDialog/MailDialog';

import { Mail } from '@/lib/types/manage-contact';
import Contact from '@/models/contact';
import { Mail as MailIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Contacts: React.FC = () => {
  //#region Gửi mail
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

  //#endregion

  const [contacts, setContacts] = useState<Contact[]>([]);
  const theme = useTheme();

  useEffect(() => {
    async function fetchData() {
      const contacts = await getContacts();
      setContacts(contacts);
    }

    fetchData();
  }, []);

  const handleContactDataChange = (value: Contact) => {
    setContacts((prev) => {
      return prev.map((contact) => {
        if (contact.id === value.id) {
          return value;
        } else {
          return contact;
        }
      });
    });
  };

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = useState(false);
  const [currentViewContact, setCurrentViewContact] = useState<Contact | null>(
    null
  );

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewContactModalChiTiet = (value: Contact) => {
    handleOpenModalChiTiet();
    setCurrentViewContact(() => value);
  };
  //#endregion

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

          {/* <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              *Tìm kiếm theo mã, họ tên, email, số điện thoại, ngày sinh, trạng
              thái...
            </Typography>
          </Grid> */}

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

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <ContactTable
              contactData={contacts}
              handleViewContact={handleViewContactModalChiTiet}
              // handleViewDeliveryModalState={handleViewDeliveryModalState}
            />

            {/* Modal chi tiết */}
            <MyModal
              open={openModalChiTiet}
              handleClose={handleCloseModalChiTiet}
              contact={currentViewContact}
              handleContactDataChange={handleContactDataChange}
            />
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

export default Contacts;
