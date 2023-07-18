import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { PermissionObject } from '@/lib/models';
import { SystemUpdateAltRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import React, { useMemo, useState } from 'react';
import DeleteDialog from '../DeleteDialog';

interface PermissionTableProps {
  permissions: PermissionObject[];
}

const newPermissionDefault = {
  name: '',
  code: '',
  description: '',
  isActive: true,
};

const PermissionTable: React.FC<PermissionTableProps> = ({ permissions }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePermission, setDeletePermission] =
    useState<PermissionObject | null>(null);
  const [newPermission, setNewPermission] =
    useState<PermissionObject>(newPermissionDefault);

  const [update, setUpdate] = useState<boolean>(false);
  const [cache, setCache] = useState<PermissionObject | null>(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setNewPermission(newPermissionDefault);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseCacheDialog = () => {
    setOpenDialog(false);
    setUpdate(false);
  };

  const hanleCachePermissionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!cache) return;

    setCache({
      ...cache,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewPermissionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPermission({
      ...newPermission,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddPermission = async () => {
    // Implement the logic to add the new permission

    const permissionRef = collection(db, COLLECTION_NAME.PERMISSIONS);

    try {
      await addDoc(permissionRef, newPermission);
    } catch (error) {
      console.log(error);
    }

    setNewPermission(newPermissionDefault);
    handleCloseDialog();
  };

  const handleUpdatePermission = async () => {
    // Implement the logic to add the new permission

    if (!cache) return;

    const permissionRef = doc(
      collection(db, COLLECTION_NAME.PERMISSIONS),
      cache?.id
    );

    const { id: string, ...data } = cache;

    console.log(data);
    console.log(cache);

    try {
      await updateDoc(permissionRef, { ...data });
    } catch (error) {
      console.log(error);
    }

    setCache(null);
    handleCloseDialog();
  };

  const handleViewDetail = (permission: PermissionObject) => {
    setCache(permission);
    handleOpenDialog();
  };

  const handleRemovePermission = (permission: PermissionObject) => {
    setDeletePermission(permission);
  };

  const handleConfirmDelete = async () => {
    if (deletePermission) {
      const collectionRef = collection(db, COLLECTION_NAME.PERMISSIONS);

      try {
        await deleteDoc(doc(collectionRef, deletePermission.id));
        console.log('Permission deleted successfully');
      } catch (error) {
        console.log(error);
      }

      setDeletePermission(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletePermission(null);
  };

  console.log(cache);

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code', width: 150, flex: 1 },
    { field: 'name', headerName: 'Name', width: 200, flex: 1 },
    { field: 'description', headerName: 'Description', width: 300, flex: 1 },
    {
      field: 'actions',
      flex: 1,
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                handleViewDetail(params.row);
                setUpdate(true);
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
                handleRemovePermission(params.row);
              }}
            >
              Xóa
            </Button>
          </Box>
        );
      },
    },
  ];

  const rows = permissions.map((permission) => ({
    id: permission.id,
    name: permission.name,
    code: permission.code,
    description: permission.description,
  }));

  const { title, value, handleChange, handleAction, handleClose, actionText } =
    useMemo(() => {
      return update && cache
        ? {
            title: 'Thông tin quyền',
            value: cache,
            handleChange: hanleCachePermissionChange,
            handleAction: handleUpdatePermission,
            handleClose: handleCloseCacheDialog,
            actionText: 'Cập nhật',
          }
        : {
            title: 'Thêm quyền mới',
            value: newPermission,
            handleChange: handleNewPermissionChange,
            handleAction: handleAddPermission,
            handleClose: handleCloseDialog,
            actionText: 'Thêm',
          };
    }, [update, cache, newPermission]);

  return (
    <Stack gap={1} my={2} pr={3}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleOpenDialog}
        sx={{
          alignSelf: 'flex-end',
        }}
      >
        Thêm quyền mới
      </Button>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5]} />
      </div>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            name="code"
            value={value.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên quyền"
            name="name"
            value={value.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Miêu tả"
            name="description"
            value={value.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleAction} color="secondary">
            {actionText}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteDialog
        title="Xóa quyền"
        confirmString="Bạn có chắc muốn xóa quyền?"
        deleteTarget={deletePermission}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </Stack>
  );
};

export default PermissionTable;
