import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { UserGroup, UserObject } from '@/lib/models';
import { formatDateString } from '@/lib/utils';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import React, { Key, useMemo, useState } from 'react';
import DeleteDialog from '../DeleteDialog';
import UserSearchDialog from '../UserSearchDialog';

function UserGroupItem({
  key,
  group,
  users,
  allUsers,
}: {
  key: Key;
  group: UserGroup;
  users: UserObject[];
  allUsers: UserObject[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [deleteUser, setDeleteUser] = useState<UserObject | null>(null);

  const handleSnackbarAlert = useSnackbarService();

  function viewUser(user: UserObject) {
    // Place your 'View User' action logic here
  }

  async function handleRemoveUser() {
    if (!deleteUser) {
      return;
    }

    // Place your 'Quick Remove' action logic here
    const ref = doc(collection(db, COLLECTION_NAME.USER_GROUPS), group.id);

    try {
      await updateDoc(ref, { users: arrayRemove(deleteUser.id) });
    } catch (error) {
      console.log(error);
    }

    handleSnackbarAlert('success', 'Loại người dùng thành công');
    setDeleteUser(null);
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,

      sortable: false,
      disableColumnMenu: true,
      hideable: false,
    },
    {
      field: 'name',
      headerName: 'Tên',
      width: 130,
      flex: 1,
      disableColumnMenu: true,
      hideable: false,
    },
    {
      field: 'birthday',
      headerName: 'Ngày sinh',
      width: 130,
      type: 'date',
      valueFormatter: (params) => formatDateString(params.value, 'DD/MM/YYYY'),
      flex: 1,
      disableColumnMenu: true,
      hideable: false,
    },
    {
      field: 'tel',
      headerName: 'Số điện thoại',
      width: 130,
      flex: 1,
      disableColumnMenu: true,
      hideable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      hideable: false,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                viewUser(params.row);
              }}
            >
              Chi tiết
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={params.row.state === 1 || params.row.state === -1}
              onClick={() => {
                setDeleteUser(params.row);
              }}
            >
              Xóa
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleOpenDialog = (group: UserGroup) => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAddUsers = async () => {
    // Firestore reference to the user group
    const userGroupRef = doc(
      collection(db, COLLECTION_NAME.USER_GROUPS),
      group.id
    );

    try {
      await updateDoc(userGroupRef, {
        users: arrayUnion(...selectedUsers),
      });
    } catch (error) {
      console.log(error);
      handleSnackbarAlert('error', 'Lỗi khi thêm nhóm người dùng');
    }
  };

  const handleCheckUser = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleCancelDelete = () => {
    setDeleteUser(null);
  };

  const availableToAddUsers = useMemo(() => {
    console.log(group.users);

    return allUsers.filter((user) => !group.users.includes(user.id!));
  }, [group.users]);

  return (
    <>
      <Accordion key={key}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{group.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleOpenDialog(group)}
          >
            Thêm người dùng
          </Button>

          <Box p={2} m={1}>
            <DataGrid
              rows={users ?? []}
              columns={columns}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <UserSearchDialog
        userOptions={availableToAddUsers}
        open={open}
        onCloseDialog={handleCloseDialog}
        handleAddUsers={handleAddUsers}
        handleCheckUser={handleCheckUser}
        selectedUsers={selectedUsers}
      />

      <DeleteDialog
        deleteTarget={deleteUser}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleRemoveUser}
      />
    </>
  );
}

export default UserGroupItem;
