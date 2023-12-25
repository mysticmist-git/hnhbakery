import CustomTextFieldPassWord from '@/components/inputs/textFields/CustomTextFieldPassword';
import { auth2, db } from '@/firebase/config';
import {
  DEFAULT_GROUP_ID,
  getGroupTableRows,
  getGroups,
} from '@/lib/DAO/groupDAO';
import { createUser } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import { isVNPhoneNumber } from '@/lib/utils';
import { GroupTableRow } from '@/models/group';
import User from '@/models/user';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { set } from 'nprogress';
import { availableParallelism } from 'os';
import React, { useEffect, useMemo, useState } from 'react';

interface UserSearchDialogProps {
  open: boolean;
  onCloseDialog: () => void;
  group: GroupTableRow | undefined;
  handleAddUser: (user: User) => void;
}

type UserWithPassword = User & {
  password: string;
};

const data: UserWithPassword = {
  id: '',
  uid: '',
  name: '',
  mail: '',
  password: '',
  tel: '',
  birth: new Date(),
  avatar: '',
  type: 'mail',
  active: true,
  group_id: DEFAULT_GROUP_ID,
  created_at: new Date(),
  updated_at: new Date(),
};

const UserSearchDialog: React.FC<UserSearchDialogProps> = ({
  open,
  onCloseDialog,
  group,
  handleAddUser,
}) => {
  const handleSnackbarAlert = useSnackbarService();

  const handleAddButtonClick = async () => {
    const groups = await getGroupTableRows();

    const mails = groups.flatMap((item) =>
      item.users?.map((user) => user.mail)
    );

    if (newUser) {
      if (mails.includes(newUser.mail)) {
        handleSnackbarAlert('error', 'Email đã tồn tại trong hệ thống!');
        return;
      }

      if (newUser.name.length < 1) {
        handleSnackbarAlert('error', 'Vui lòng nhập họ và tên!');
        return;
      }

      if (newUser.mail.length < 1) {
        handleSnackbarAlert('error', 'Vui lòng nhập email!');
        return;
      }

      if (!isVNPhoneNumber(newUser.tel)) {
        handleSnackbarAlert('error', 'Số điện thoại không hợp lệ!');
        return;
      }

      if (newUser.password.length < 6) {
        handleSnackbarAlert('error', 'Mật khẩu phải lớn hơn 6 ký tự!');
        return;
      }

      const credential = await createUserWithEmailAndPassword(
        auth2,
        newUser.mail,
        newUser.password
      );
      const userUid = credential.user?.uid;

      newUser.uid = userUid;

      const { password, ...user } = newUser;
      if (user.group_id === DEFAULT_GROUP_ID) {
        user.rankId = '1';
        user.paidMoney = 0;
      }
      await createUser(user.group_id, user as User);
      handleSnackbarAlert('success', 'Thêm người dùng thành công!');
      handleAddUser(user);
    }

    onCloseDialog();
  };

  function resetNewUser() {
    setNewUser({
      ...newUser!,
      ...data,
    });
  }

  const [newUser, setNewUser] = useState<UserWithPassword | null>({ ...data });

  useEffect(() => {
    if (group) {
      setNewUser({
        ...newUser!,
        group_id: group.id,
      });
    }
  }, [group]);

  return (
    <Dialog open={open} onClose={onCloseDialog} fullWidth>
      <DialogTitle>Thêm người dùng</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} direction={'column'}>
          <TextField
            color="secondary"
            fullWidth
            label="Tên người dùng"
            onChange={(e) => {
              setNewUser({
                ...newUser!,
                name: e.target.value,
              });
            }}
          />

          <TextField
            color="secondary"
            fullWidth
            type="tel"
            label="Số điện thoại"
            onChange={(e) => {
              setNewUser({
                ...newUser!,
                tel: e.target.value,
              });
            }}
          />
          <DatePicker
            label="Ngày sinh"
            onChange={(e: any) => {
              setNewUser({
                ...newUser!,
                birth: new Date(e.$d),
              });
            }}
          />
          <Divider />
          <TextField
            color="secondary"
            type="email"
            fullWidth
            label="Email"
            helperText="Email cũng là tên đăng nhập"
            onChange={(e) => {
              setNewUser({
                ...newUser!,
                mail: e.target.value,
              });
            }}
          />
          <TextField
            color="secondary"
            type="password"
            fullWidth
            label="Password"
            onChange={(e) => {
              setNewUser({
                ...newUser!,
                password: e.target.value,
              });
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            resetNewUser();
            onCloseDialog();
          }}
          color="secondary"
        >
          Đóng
        </Button>
        <Button onClick={handleAddButtonClick} color="secondary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSearchDialog;
