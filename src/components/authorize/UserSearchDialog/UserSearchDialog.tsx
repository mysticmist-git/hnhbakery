import { db } from '@/firebase/config';
import { Permission, UserGroup, UserObject } from '@/lib/models';
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
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { set } from 'nprogress';
import { availableParallelism } from 'os';
import React, { useEffect, useMemo, useState } from 'react';

interface UserSearchDialogProps {
  open: boolean;
  onCloseDialog: () => void;
  userOptions: UserObject[];
  selectedUsers: string[];
  handleCheckUser: (userId: string) => void;
  handleAddUsers: () => void;
}

const UserSearchDialog: React.FC<UserSearchDialogProps> = ({
  open,
  onCloseDialog,
  userOptions,
  selectedUsers,
  handleCheckUser,
  handleAddUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // const [permissions, setPermissions] = useState<Permission[]>([]);
  // const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

  // useEffect(() => {
  //   const fetchPermissions = async () => {
  //     const permissionsCollectionRef = collection(db, 'permissions');
  //     const permissionsSnapshot = await getDocs(permissionsCollectionRef);
  //     const permissionsData = permissionsSnapshot.docs.map(
  //       (doc) => doc.data() as Permission
  //     );
  //     setPermissions(permissionsData);
  //   };

  //   if (open) {
  //     fetchPermissions();
  //   }
  // }, [open]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const filteredUsers = useMemo(() => {
    const normalizedValue = searchTerm
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const filtered = userOptions.filter(
      (user) =>
        user.id?.toLowerCase().includes(normalizedValue) ||
        user.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(normalizedValue)
    );

    return filtered;
  }, [userOptions, searchTerm]);

  // const handleCheckboxChange = (permissionId: string) => {
  //   if (checkedPermissions.includes(permissionId)) {
  //     setCheckedPermissions(
  //       checkedPermissions.filter((id) => id !== permissionId)
  //     );
  //   } else {
  //     setCheckedPermissions([...checkedPermissions, permissionId]);
  //   }
  // };

  const handleAddButtonClick = () => {
    handleAddUsers();
  };

  return (
    <Dialog open={open} onClose={onCloseDialog}>
      <DialogTitle>Thêm người dùng</DialogTitle>

      <Divider />

      <DialogContent>
        <TextField
          label="Tìm kiếm"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          fullWidth
        />

        <List>
          {!filteredUsers ||
            (filteredUsers.length === 0 && (
              <ListItem
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2">Không có người dùng</Typography>
              </ListItem>
            ))}
          {filteredUsers.map((user) => (
            <ListItem key={user.id} sx={{ alignItems: 'center' }}>
              <ListItemText primary={`ID: ${user.id}`} secondary={user.name} />
              <Checkbox
                color="secondary"
                checked={selectedUsers.includes(user.id!)}
                onChange={() => handleCheckUser(user.id!)}
              />
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* <List>
          {permissions.map((permission) => (
            <ListItem key={permission.id} sx={{ alignItems: 'center' }}>
              <ListItemText primary={permission.name} />
              <Checkbox
                color="secondary"
                checked={checkedPermissions.includes(permission.id!)} // Use the checkedPermissions state
                onChange={() => handleCheckboxChange(permission.id!)} // Handle the checkbox change event
              />
            </ListItem>
          ))}
        </List> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleAddButtonClick} color="secondary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSearchDialog;
