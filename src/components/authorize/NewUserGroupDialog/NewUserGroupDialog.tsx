import { UserGroup } from '@/lib/models';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface NewUserGroupDialogProps {
  newGroup: UserGroup | null;
  setNewGroup: (newGroup: UserGroup | null) => void;
  handleNewGroupChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewGroupSubmit: () => void;
}

const NewUserGroupDialog: React.FC<NewUserGroupDialogProps> = ({
  newGroup,
  setNewGroup,
  handleNewGroupChange,
  handleNewGroupSubmit,
}) => {
  return (
    <Dialog
      open={!!newGroup}
      onClose={() => setNewGroup(null)}
      aria-labelledby="new-group-dialog-title"
    >
      <DialogTitle id="new-group-dialog-title">Nhóm người dùng mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Tên nhóm"
          type="text"
          fullWidth
          value={newGroup ? newGroup.name : ''}
          onChange={handleNewGroupChange}
        />
        {/* Add fields for users and permissions as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setNewGroup(null)} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleNewGroupSubmit} color="secondary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewUserGroupDialog;
