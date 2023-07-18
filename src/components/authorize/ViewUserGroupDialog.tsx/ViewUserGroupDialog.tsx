import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { PermissionObject, UserGroup } from '@/lib/models';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

interface ViewUserGroupDialogProps {
  open: boolean;
  group: UserGroup | null;
  permissionOptions: PermissionObject[];
  handleDialogClose: () => void;
}

const ViewUserGroupDialog: React.FC<ViewUserGroupDialogProps> = ({
  open,
  group,
  permissionOptions,
  handleDialogClose,
}) => {
  const [value, setValue] = useState<UserGroup | null>(
    group ? { ...group } : null
  );

  const changed = useMemo(() => {
    // Deep compare gropu and cache
    if (JSON.stringify(group) !== JSON.stringify(value)) {
      return true;
    }

    return false;
  }, [group, value]);

  const handleGroupChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (!value) return;

    setValue({ ...value, [event.target.name]: event.target.value });
  };

  const handlePermissionChange: SwitchBaseProps['onChange'] = (
    event,
    checked
  ) => {
    if (!value) return;

    if (checked) {
      setValue({
        ...value,
        permission: [...value.permission, event.target.value],
      });
    } else {
      setValue({
        ...value,
        permission: [
          ...value.permission.filter((p) => p !== event.target.value),
        ],
      });
    }
  };

  const handleGroupUpdate = async () => {
    if (!group || !value) {
      return;
    }

    const ref = doc(collection(db, COLLECTION_NAME.USER_GROUPS), group.id);

    delete value.id;

    try {
      await updateDoc(ref, {
        ...value,
      });
    } catch (error) {
      console.log(error);
    }

    handleDialogClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="view-group-dialog-title"
    >
      <DialogTitle id="view-group-dialog-title">
        Thông tin nhóm người dùng
      </DialogTitle>
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
          value={value ? value.name : ''}
          onChange={handleGroupChange}
        />

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
                  color="secondary"
                  name="permission"
                  checked={value ? value.permission.includes(p.id!) : false}
                  value={p.id}
                  onChange={handlePermissionChange}
                />
              </Stack>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
          Đóng
        </Button>
        <Button
          onClick={handleGroupUpdate}
          color="secondary"
          sx={{ display: changed ? 'block' : 'none' }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserGroupDialog;
