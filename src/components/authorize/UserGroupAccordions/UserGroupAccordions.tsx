import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { UserGroup, UserObject } from '@/lib/models';
import { group } from 'console';
import { deleteUser } from 'firebase/auth';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { setgroups } from 'process';
import React, { useState } from 'react';
import DeleteDialog from '../DeleteDialog';
import UserGroupItem from '../UserGroupItem';

interface UserGroupAccordionProps {
  userGroups: UserGroup[];
  users: UserObject[];
}

const UserGroupAccordions = ({
  userGroups,
  users,
}: UserGroupAccordionProps) => {
  const [deleteGroup, setDeleteGroup] = useState<UserGroup | null>(null);

  const handleSnackbarAlert = useSnackbarService();

  const handleCancelDelete = () => {
    setDeleteGroup(null);
  };

  const handleConfirmDelete = (group: UserGroup) => {
    setDeleteGroup(group);
  };

  async function handleRemoveUser() {
    if (!deleteGroup) {
      return;
    }

    const ref = doc(
      collection(db, COLLECTION_NAME.USER_GROUPS),
      deleteGroup.id
    );

    try {
      await deleteDoc(ref);
      handleSnackbarAlert('success', 'Xóa nhóm người dùng thành công');
    } catch (error) {
      console.log(error);
    }

    setDeleteGroup(null);
  }
  return (
    <>
      {userGroups?.map((group, index) => (
        <UserGroupItem
          key={index}
          group={group}
          users={users.filter((user) => group.users.includes(user.id!))}
          allUsers={users}
          handleDeleteGroup={handleConfirmDelete}
        />
      ))}

      <UserGroupItem
        key={'no-group'}
        users={users.filter(
          (user) =>
            !userGroups
              .map((group) => group.users)
              .flat()
              .includes(user.id!)
        )}
        allUsers={users}
        handleDeleteGroup={handleConfirmDelete}
        fallbackTitle="Không nhóm"
        noGroup
      />

      {/* Xóa nhóm người dùng */}
      <DeleteDialog
        title={'Xóa nhóm người dùng'}
        confirmString={'Bạn có chắc muốn xóa nhóm người dùng này?'}
        deleteTarget={deleteGroup}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleRemoveUser}
      />
    </>
  );
};

export default UserGroupAccordions;
