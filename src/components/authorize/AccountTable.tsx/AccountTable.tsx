import { auth, createUser, db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { PermissionObject, UserObject } from '@/lib/models';
import { formatDateString } from '@/lib/utils';
import { SystemUpdateAltRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { setUncaughtExceptionCaptureCallback } from 'process';
import React, { useMemo, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import DeleteDialog from '../DeleteDialog';

interface AccountTableProps {
  users: UserObject[];
}

const defaultNewAccount: UserObject = {
  id: '',
  accountType: 'email_n_password',
  birthday: new Date(1990, 1, 1),
  image: '',
  isActive: true,
  name: '',
  mail: '',
  tel: '',
  role_id: 'manager',
  addresses: [],
};

const AccountTable: React.FC<AccountTableProps> = ({ users }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [toDisableAccount, setToDisableAccount] = useState<UserObject | null>(
    null
  );
  const [newAccount, setNewAccount] = useState<UserObject>(defaultNewAccount);

  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [cache, setCache] = useState<UserObject | null>(null);

  const [password, setPassword] = useState('');

  const handleSnackbarAlert = useSnackbarService();

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setNewAccount(defaultNewAccount);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPassword('');
  };

  const handleCloseUpdateDialog = () => {
    setOpenDialog(false);
    setPassword('');

    setTimeout(() => {
      setCache(null);
      setUpdateMode(false);
    }, 100);
  };

  const handleCacheAccountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!cache) return;

    setCache({
      ...cache,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewAccountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewAccount({
      ...newAccount,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddAccount = async () => {
    // Implement tbhe logic to add the new permission

    try {
      const userCredential = await createUser(newAccount.mail, password);

      if (!userCredential) {
        handleSnackbarAlert('error', 'Tạo tài khoản mới thất bại');
        handleCloseDialog();
        return;
      }

      const usersRef = doc(
        collection(db, COLLECTION_NAME.USERS),
        userCredential.user.uid
      );

      await setDoc(usersRef, newAccount);
    } catch (error) {
      console.log(error);
    }

    setNewAccount(defaultNewAccount);
    handleCloseDialog();
  };

  const handleUpdateAccount = async () => {
    // Implement the logic to add the new permission

    if (!cache) return;

    const userRef = doc(collection(db, COLLECTION_NAME.USERS), cache?.id);

    const { id: string, ...data } = cache;

    try {
      await updateDoc(userRef, { ...data });
    } catch (error) {
      console.log(error);
    }

    setCache(null);
    handleCloseDialog();
  };

  const handleViewDetail = (user: UserObject) => {
    setCache(user);
    handleOpenDialog();
  };

  const handleDisableAccount = (user: UserObject) => {
    setToDisableAccount(user);
  };

  const handleConfirmDisable = async () => {
    if (toDisableAccount) {
      const userRef = doc(
        collection(db, COLLECTION_NAME.USERS),
        toDisableAccount.id
      );

      try {
        await updateDoc(userRef, { isActive: false });
        console.log('user disabled successfully');
      } catch (error) {
        console.log(error);
      }

      setToDisableAccount(null);
    }
  };

  const handleEnableAccount = async (user: UserObject) => {
    const userRef = doc(collection(db, COLLECTION_NAME.USERS), user.id);

    try {
      await updateDoc(userRef, { isActive: true });
      console.log('user enable successfully');
    } catch (error) {
      console.log(error);
    }

    setToDisableAccount(null);
  };

  const handleCancelDisable = () => {
    setToDisableAccount(null);
  };

  console.log(cache);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Tên', width: 150, flex: 1 },
    {
      field: 'birthday',
      headerName: 'Ngày sinh',
      width: 300,
      flex: 1,
      valueFormatter: (params) => formatDateString(params.value, 'DD/MM/YYYY'),
    },
    { field: 'tel', headerName: 'Số điện thoại', width: 300, flex: 1 },
    { field: 'mail', headerName: 'Email', width: 300, flex: 1 },
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
                setUpdateMode(true);
              }}
            >
              Chi tiết
            </Button>
            <Button
              variant="contained"
              color={params.row.isActive ? 'error' : 'success'}
              size="small"
              disabled={params.row.state === 1 || params.row.state === -1}
              onClick={() => {
                if (params.row.isActive) handleDisableAccount(params.row);
                else handleEnableAccount(params.row);
              }}
            >
              {params.row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
            </Button>
          </Box>
        );
      },
    },
  ];

  const { title, value, handleChange, handleAction, handleClose, actionText } =
    useMemo(() => {
      return updateMode && cache
        ? {
            title: 'Thông tin tài khoản',
            value: cache,
            handleChange: handleCacheAccountChange,
            handleAction: handleUpdateAccount,
            handleClose: handleCloseUpdateDialog,
            actionText: 'Cập nhật',
          }
        : {
            title: 'Thêm tài khoản mới',
            value: newAccount,
            handleChange: handleNewAccountChange,
            handleAction: handleAddAccount,
            handleClose: handleCloseDialog,
            actionText: 'Thêm',
          };
    }, [updateMode, cache, newAccount]);

  const handleBirthdayChange = (value: Date) => {
    if (updateMode) {
      if (!cache) return;
      setCache({
        ...cache,
        birthday: value,
      });
    } else {
      if (!newAccount) return;
      setNewAccount({
        ...newAccount,
        birthday: value,
      });
    }
  };

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
        Thêm tài khoản mới
      </Button>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={users} columns={columns} pageSizeOptions={[5]} />
      </div>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {!updateMode && (
            <TextField
              label="Email"
              name="mail"
              value={value.mail}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )}
          {!updateMode && (
            <TextField
              label="Mật khẩu"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              type="password"
            />
          )}

          <Divider sx={{ my: 1 }} />

          <TextField
            label="Họ và Tên"
            name="name"
            value={value.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <DatePicker
            value={dayjs(value.birthday)}
            onChange={(value) => value && handleBirthdayChange(value?.toDate())}
            format="DD/MM/YYYY"
          />
          <TextField
            label="Số điện thoại"
            name="tel"
            value={value.tel}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="tel"
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
        title="Vô hiệu tài khoản"
        confirmString="Bạn có chắc muốn vô hiệu hóa tài khoản"
        deleteTarget={toDisableAccount}
        handleCancelDelete={handleCancelDisable}
        handleConfirmDelete={handleConfirmDisable}
        deleteText={'Vô hiệu hóa'}
      />
    </Stack>
  );
};

export default AccountTable;
