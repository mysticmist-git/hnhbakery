import { useSnackbarService } from '@/lib/contexts';
import { Mail } from '@/lib/types/manage-contact';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

interface MailDialogProps {
  open: boolean;
  handleClose?: () => void;
  handleSubmit?: (mail: Mail) => Promise<void>;
}

const MailDialog: React.FC<MailDialogProps> = ({
  open,
  handleClose,
  handleSubmit,
}) => {
  const [mail, setMail] = useState<Mail>({ title: '', to: '', content: '' });

  const handleSnackbarAlert = useSnackbarService();

  const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail({ ...mail, [e.target.name]: e.target.value });
  };

  const handleDialogClose = () => {
    handleClose && handleClose();
  };

  const handleSendMail = async () => {
    if (!mail.title || !mail.to || !mail.content) {
      handleSnackbarAlert('info', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    handleSubmit && (await handleSubmit(mail));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Gửi Mail tới khách</DialogTitle>
      <DialogContent>
        <TextField
          label="Tiêu đề"
          name="title"
          value={mail.title}
          onChange={handleMailChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Gửi tới"
          name="to"
          value={mail.to}
          onChange={handleMailChange}
          fullWidth
          margin="normal"
        />

        <TextField
          multiline
          rows={4}
          label="Nội dung"
          name="content"
          value={mail.content}
          onChange={handleMailChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
          Đóng
        </Button>
        <Button onClick={handleSendMail} color="secondary">
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MailDialog;
