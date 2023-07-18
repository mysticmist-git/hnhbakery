import { useSnackbarService } from '@/lib/contexts';
import { Contact } from '@/lib/models';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomIconButton } from '../buttons';
import { Close } from '@mui/icons-material';
import { ThongTin_Content } from './ThongTin_Content';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import { COLLECTION_NAME } from '@/lib/constants';

export function MyModal({
  open,
  handleClose,
  contact,
  handleContactDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  contact: Contact | null;
  handleContactDataChange: (value: Contact) => void;
}) {
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  const StyleCuaCaiBox = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: 1,
    borderColor: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    opacity: 0.8,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      opacity: 1,
      boxShadow: 10,
    },
  };
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };

  const [modalContact, setModalContact] = useState<Contact | null>(contact);

  useEffect(() => {
    setModalContact(() => contact);
  }, [contact]);

  //#region hàm
  const clearData = () => {
    setModalContact(() => null);
  };
  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };
  //#endregion

  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
          },
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <DialogTitle sx={{ boxShadow: 3 }}>
          <Typography
            align="center"
            variant="body1"
            sx={{
              fontWeight: 'bold',
            }}
            color={theme.palette.common.black}
          >
            Chi tiết liên hệ
          </Typography>

          <Box>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <Close />
            </CustomIconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '40px',
                      p: 2,
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Thông tin liên hệ
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <ThongTin_Content
                      textStyle={textStyle}
                      modalContact={modalContact}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ width: '100%', pb: 2 }} textAlign={'center'}>
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                const data = (
                  await getCollection<Contact>(COLLECTION_NAME.CONTACTS)
                ).find((contact) => contact.id === modalContact?.id);
                if (data) {
                  data.isRead = true;
                  await updateDocToFirestore(data, COLLECTION_NAME.CONTACTS);

                  handleSnackbarAlert('success', 'Đọc email thành công!');
                  handleContactDataChange({ ...data, isRead: true });

                  handleClose();
                } else {
                  handleSnackbarAlert('error', 'Lỗi.');
                  handleClose();
                }
              }}
              disabled={modalContact?.isRead}
            >
              Đã đọc
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
