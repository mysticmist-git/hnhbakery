import { ContactTable, MyModal } from '@/components/contacts';
import { getContacts } from '@/lib/DAO/contactDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import MailDialog from '@/lib/manage/contact/MailDialog/MailDialog';

import { Mail } from '@/lib/types/manage-contact';
import Contact from '@/models/contact';
import { Mail as MailIcon, NotificationsRounded } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { ChatManagement } from '../../components/contacts/ChatManagement';
import { ChatContext } from '@/lib/contexts/chatContext';
import { onSnapshot } from 'firebase/firestore';
import { getUserChatRefByUid } from '@/lib/DAO/userChatDAO';
import useLoadingService from '@/lib/hooks/useLoadingService';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Contacts: React.FC = () => {
  const [load, stop] = useLoadingService();

  //#region Tab
  const [tabValue, setTabValue] = useState('1');

  const handleTabValueChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTabValue(newValue);
  };
  //#endregion

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
      try {
        load();
        const contacts = await getContacts();
        setContacts(contacts);
        stop();
      } catch (error) {
        console.log(error);
        stop();
      }
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

  //#region Live Chat badge content
  const { state } = useContext(ChatContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (state.uidSender == '') {
      return;
    }

    const unsub = onSnapshot(getUserChatRefByUid(state.uidSender), (doc) => {
      let data = doc.data();
      if (!data) {
        setUnreadCount(0);
      } else {
        const countUnRead = data.chatWith.filter(
          (item) => item.isRead == false
        ).length;
        setUnreadCount(countUnRead);
      }
    });

    return () => {
      unsub();
    };
  }, [state.uidSender]);

  //#endregion

  return (
    <>
      <Box
        component={'div'}
        width={'100%'}
        sx={{ p: 2, pr: 3, overflow: 'hidden' }}
      >
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
            <Tabs
              value={tabValue}
              onChange={handleTabValueChange}
              textColor="secondary"
              indicatorColor="secondary"
              centered
            >
              <Tab
                value="1"
                label={
                  <Badge color="secondary" badgeContent={unreadCount}>
                    Live Chat
                  </Badge>
                }
              />
              <Tab value="2" label="Mail" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {tabValue === '2' && (
            <>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'end' }}
              >
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
                <ContactTable
                  contactData={contacts}
                  handleViewContact={handleViewContactModalChiTiet}
                />

                {/* Modal chi tiết */}
                <MyModal
                  open={openModalChiTiet}
                  handleClose={handleCloseModalChiTiet}
                  contact={currentViewContact}
                  handleContactDataChange={handleContactDataChange}
                />
              </Grid>
            </>
          )}

          {tabValue === '1' && <ChatManagement />}
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
