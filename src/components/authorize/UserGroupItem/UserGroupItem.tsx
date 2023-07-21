import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { UserGroup, UserObject } from '@/lib/models';
import {
  AuthorizeContext,
  AuthorizeContextType,
} from '@/lib/pageSpecific/authorize';
import { formatDateString } from '@/lib/utils';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
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
import React, { Key, useContext, useMemo, useState } from 'react';
import DeleteDialog from '../DeleteDialog';
import UserSearchDialog from '../UserSearchDialog';
import ViewUserGroupDialog from '../ViewUserGroupDialog.tsx/ViewUserGroupDialog';

function UserGroupItem({
  key,
  group,
  users,
  allUsers,
  handleDeleteGroup,
  fallbackTitle = '',
  noGroup = false,
}: {
  key: Key;
  users: UserObject[];
  allUsers: UserObject[];
  handleDeleteGroup: (group: UserGroup) => void;
  group?: UserGroup;
  fallbackTitle?: string;
  noGroup?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [deleteUser, setDeleteUser] = useState<UserObject | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);

  const handleSnackbarAlert = useSnackbarService();

  function viewUser(user: UserObject) {
    // Place your 'View User' action logic here
  }

  async function handleRemoveUser() {
    if (!deleteUser || !group) {
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
            {/* <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                viewUser(params.row);
              }}
            >
              Chi tiết
            </Button> */}
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

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const handleAddUsers = async () => {
    if (!group) return;

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
    if (!group) return [];

    return allUsers.filter((user) => !group.users.includes(user.id!));
  }, [group?.users]);

  const handleViewUserGroup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setViewDialogOpen(true);
  };

  const { permissions } = useContext<AuthorizeContextType>(AuthorizeContext);

  return (
    <>
      <Accordion key={key}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography width={'20%'}>{group?.name || fallbackTitle}</Typography>
          {!noGroup && (
            <Stack
              direction="row"
              justifyContent={'end'}
              width={'80%'}
              gap={1}
              pr={1}
            >
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleViewUserGroup}
              >
                Chi tiết
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();

                  if (!group) return;

                  handleDeleteGroup(group);
                }}
              >
                Xóa
              </Button>
            </Stack>
          )}
        </AccordionSummary>
        <AccordionDetails>
          {!noGroup && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                if (!group) return;
                handleOpenDialog(group);
              }}
            >
              Thêm người dùng
            </Button>
          )}

          <Divider sx={{ my: 1 }} />

          <Box p={2} m={1}>
            {users && users.length > 0 ? (
              <DataGrid
                rows={users ?? []}
                columns={columns}
                pageSizeOptions={[5, 10]}
                columnVisibilityModel={{
                  actions: !noGroup,
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography>Chưa có người dùng</Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Dialog Thêm người dùng */}
      <UserSearchDialog
        userOptions={availableToAddUsers}
        open={open}
        onCloseDialog={handleCloseDialog}
        handleAddUsers={handleAddUsers}
        handleCheckUser={handleCheckUser}
        selectedUsers={selectedUsers}
      />

      {/* Xóa người dùng khỏi nhóm Dialog */}
      <DeleteDialog
        title={'Xóa người dùng'}
        confirmString={'Bạn có chắc muốn xóa người dùng khỏi nhóm?'}
        deleteTarget={deleteUser}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleRemoveUser}
      />

      {/* View user group info */}
      {viewDialogOpen && group && (
        <ViewUserGroupDialog
          open={viewDialogOpen}
          group={group}
          handleDialogClose={handleViewDialogClose}
          permissionOptions={permissions}
        />
      )}
    </>
  );
}

export default UserGroupItem;
