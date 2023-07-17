import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React from 'react';

interface DeleteDialog {
  title: string;
  confirmString: string;
  deleteTarget: any | null;
  handleCancelDelete: () => void;
  handleConfirmDelete: (deleteObjet: any) => Promise<void>;
}

const DeleteDialog: React.FC<DeleteDialog> = ({
  title,
  confirmString,
  deleteTarget,
  handleCancelDelete,
  handleConfirmDelete,
}) => {
  return (
    <Dialog open={deleteTarget !== null} onClose={handleCancelDelete}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{confirmString}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleConfirmDelete} color="error">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
