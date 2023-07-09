import { DialogResult } from '@/lib/types/manage';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

interface SimpleDialogProps {
  open: boolean;
  onClose?: (result: DialogResult) => void;
  title?: string;
  content?: string;
  actions?: React.ReactNode;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  function handleClose() {
    if (props.onClose) props.onClose('close');
  }

  return (
    <Dialog
      open={props.open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      color="secondary"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography>{props.title ?? 'Không'}</Typography>

          <IconButton onClick={() => handleClose()}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>{props.content ?? 'Không'}</Typography>
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>{props.actions}</DialogActions>
    </Dialog>
  );
}
