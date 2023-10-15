import { db } from '@/firebase/config';
import { getGroupById, updateGroup } from '@/lib/DAO/groupDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import Group, { GroupTableRow } from '@/models/group';
import Permission from '@/models/permission';
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
  group: GroupTableRow | null;
  permissionOptions: Permission[];
  handleDialogClose: () => void;
  handleChangePermissions: (group: GroupTableRow) => void;
}

const ViewUserGroupDialog: React.FC<ViewUserGroupDialogProps> = ({
  open,
  group,
  permissionOptions,
  handleDialogClose,
  handleChangePermissions,
}) => {
  const handleSnackbarAlert = useSnackbarService();

  const [value, setValue] = useState<GroupTableRow | null>(
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
        permissions: [...value.permissions, event.target.value],
      });
    } else {
      setValue({
        ...value,
        permissions: [
          ...value.permissions.filter((p) => p !== event.target.value),
        ],
      });
    }
  };

  const handleGroupUpdate = async () => {
    if (!group || !value) {
      return;
    }

    const { users, ...item } = value;

    try {
      await updateGroup(value.id, item as Group);
      handleChangePermissions(value);
      handleSnackbarAlert('success', 'Cập nhật nhóm người dùng thành công');
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
                  name="permissions"
                  checked={value ? value.permissions.includes(p.id!) : false}
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
