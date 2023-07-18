import { PermissionObject, UserGroup } from '@/lib/models';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface NewUserGroupDialogProps {
  newGroup: UserGroup | null;
  handleDialogClose: () => void;
  handleNewGroupChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewGroupSubmit: () => void;
  permissionOptions: PermissionObject[];
}

const NewUserGroupDialog: React.FC<NewUserGroupDialogProps> = ({
  newGroup,
  handleDialogClose,
  handleNewGroupChange,
  handleNewGroupSubmit,
  permissionOptions,
}) => {
  return (
    <Dialog
      open={!!newGroup}
      onClose={handleDialogClose}
      aria-labelledby="new-group-dialog-title"
    >
      <DialogTitle id="new-group-dialog-title">Nhóm người dùng mới</DialogTitle>
      <DialogContent>
        <TextField
          size="small"
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

        <Divider />

        <List>
          {permissionOptions.map((p) => (
            <ListItem key={p.id} divider>
              <Stack
                direction="row"
                sx={{
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">{p.name}</Typography>
                <Checkbox
                  checked={newGroup?.permission.includes(p.id!)}
                  color="secondary"
                  onChange={handleNewGroupChange}
                  name="permission"
                  value={p.id}
                />
              </Stack>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
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
