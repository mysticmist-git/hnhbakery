import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React from 'react';

interface DeleteDialog {
  deleteTarget: any | null;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => Promise<void>;
}

const DeleteDialog: React.FC<DeleteDialog> = ({
  deleteTarget,
  handleCancelDelete,
  handleConfirmDelete,
}) => {
  return (
    <Dialog open={deleteTarget !== null} onClose={handleCancelDelete}>
      <DialogTitle>Xóa quyền</DialogTitle>
      <DialogContent>
        <p>Bạn có chắc chắn muốn xóa quyền này?</p>
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
