import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
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
import React, { Key, useContext, useEffect, useMemo, useState } from 'react';
import DeleteDialog from '../DeleteDialog';
import UserSearchDialog from '../UserSearchDialog';
import ViewUserGroupDialog from '../ViewUserGroupDialog.tsx/ViewUserGroupDialog';
import User from '@/models/user';
import { GroupTableRow } from '@/models/group';
import { deleteUser, getUser } from '@/lib/DAO/userDAO';
import { getBranches, updateBranch } from '@/lib/DAO/branchDAO';
import {
  DEFAULT_GROUP_ID,
  DEV_GROUP_ID,
  MANAGER_GROUP_ID,
} from '@/lib/DAO/groupDAO';

function UserGroupItem({
  key,
  group,
  handleDeleteGroup,
  handleChangeUserGroupItem,
}: {
  key: Key;
  group?: GroupTableRow;
  handleDeleteGroup: (group: GroupTableRow) => void;
  handleChangeUserGroupItem: (
    action: 'add' | 'update' | 'delete',
    group: GroupTableRow
  ) => void;
}) {
  const handleSnackbarAlert = useSnackbarService();

  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    if (group?.users) {
      setUserData(group.users);
    }
  }, [group]);

  //#region Xóa người dùng
  const [deleteUserObject, setDeleteUser] = useState<User | null>(null);
  async function handleRemoveUser() {
    if (!deleteUserObject || !group) {
      return;
    }

    // Place your 'Quick Remove' action logic here
    try {
      await deleteUser(group.id, deleteUserObject.id);
      const branch = (await getBranches()).find(
        (b) => b.manager_id === deleteUserObject.id && b.group_id === group.id
      );
      if (branch) {
        branch.manager_id = '';
        branch.group_id = '';
        await updateBranch(branch.id, branch);
      }
    } catch (error) {
      console.log(error);
    }

    handleChangeUserGroupItem('update', {
      ...group,
      users: group.users?.filter((u) => u.id !== deleteUserObject.id) ?? [],
    });

    handleSnackbarAlert('success', 'Xóa người dùng thành công');
    setDeleteUser(null);
  }
  const handleCancelDelete = () => {
    setDeleteUser(null);
  };
  //#endregion

  //#region Bảng người dùng
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
      field: 'birth',
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
          <Box component={'div'} sx={{ display: 'flex', gap: 1 }}>
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
  //#endregion

  //#region Dialog thêm người dùng

  const [open, setOpen] = useState<boolean>(false);

  const handleOpenDialog = (group: GroupTableRow) => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAddUser = (user: User) => {
    setUserData([...userData, user]);
    if (group && group.users) {
      handleChangeUserGroupItem('update', {
        ...group,
        users: [...group.users, user],
      });
    }
  };

  //#endregion

  //#region Dialog xem nhóm người dùng
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);

  const handleViewUserGroup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setViewDialogOpen(true);
  };
  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const handleChangePermissions = (group: GroupTableRow) => {
    if (!group) return;
    handleChangeUserGroupItem('update', group);
  };
  //#endregion

  const { permissions } = useContext<AuthorizeContextType>(AuthorizeContext);

  return (
    <>
      <Accordion key={key}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography width={'20%'}>{group?.name}</Typography>
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
              sx={{
                display: () => {
                  return group?.id == DEFAULT_GROUP_ID ||
                    group?.id == MANAGER_GROUP_ID ||
                    group?.id == DEV_GROUP_ID
                    ? 'none'
                    : 'block';
                },
              }}
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
        </AccordionSummary>
        <AccordionDetails>
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

          <Divider sx={{ my: 1 }} />

          <Box component={'div'} p={2} m={1}>
            {userData && userData.length > 0 ? (
              <DataGrid
                rows={userData ?? []}
                columns={columns}
                pageSizeOptions={[5, 10]}
                columnVisibilityModel={{
                  actions: true,
                }}
              />
            ) : (
              <Box
                component={'div'}
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
        open={open}
        onCloseDialog={handleCloseDialog}
        group={group}
        handleAddUser={handleAddUser}
      />

      {/* Xóa người dùng khỏi nhóm Dialog */}
      <DeleteDialog
        title={'Xóa người dùng'}
        confirmString={'Bạn có chắc muốn xóa người dùng khỏi nhóm?'}
        deleteTarget={deleteUserObject}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleRemoveUser}
      />

      {/* View user group info */}
      {viewDialogOpen && group && (
        <ViewUserGroupDialog
          open={viewDialogOpen}
          group={group}
          permissionOptions={permissions}
          handleDialogClose={handleViewDialogClose}
          handleChangePermissions={handleChangePermissions}
        />
      )}
    </>
  );
}

export default UserGroupItem;
