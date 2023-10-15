import { useSnackbarService } from '@/lib/contexts';
import React, { useEffect, useState } from 'react';
import DeleteDialog from '../DeleteDialog';
import UserGroupItem from '../UserGroupItem';
import { GroupTableRow } from '@/models/group';
import {
  getGroupById,
  deleteGroup,
  getGroupTableRows,
} from '@/lib/DAO/groupDAO';

interface UserGroupAccordionProps {
  groups: GroupTableRow[];
}

const UserGroupAccordions = ({ groups }: UserGroupAccordionProps) => {
  const [deleteGroupObject, setDeleteGroup] = useState<GroupTableRow | null>(
    null
  );

  const [groupData, setGroupData] = useState<GroupTableRow[]>([]);

  useEffect(() => {
    setGroupData(groups);
  }, [groups]);

  const handleSnackbarAlert = useSnackbarService();

  const handleCancelDelete = () => {
    setDeleteGroup(null);
  };

  const handleConfirmDelete = (group: GroupTableRow) => {
    setDeleteGroup(group);
  };

  const handleChangeUserGroupItem = async (
    action: 'add' | 'update' | 'delete',
    group: GroupTableRow
  ) => {
    if (action === 'add') {
      setGroupData(await getGroupTableRows());
    } else if (action === 'update') {
      setGroupData(await getGroupTableRows());
    } else if (action === 'delete') {
      setGroupData(groupData.filter((g) => g.id !== group.id));
    }
  };

  async function handleRemoveUser() {
    if (!deleteGroupObject) {
      return;
    }

    try {
      const group = await getGroupById(deleteGroupObject.id);
      await deleteGroup(group!.id);
      handleSnackbarAlert('success', 'Xóa nhóm người dùng thành công');
    } catch (error) {
      console.log(error);
    }

    setDeleteGroup(null);
  }
  return (
    <>
      {groupData?.map((group, index) => (
        <UserGroupItem
          key={index}
          group={group}
          handleDeleteGroup={handleConfirmDelete}
          handleChangeUserGroupItem={handleChangeUserGroupItem}
        />
      ))}

      {/* Xóa nhóm người dùng */}
      <DeleteDialog
        title={'Xóa nhóm người dùng'}
        confirmString={'Bạn có chắc muốn xóa nhóm người dùng này?'}
        deleteTarget={deleteGroupObject}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleRemoveUser}
      />
    </>
  );
};

export default UserGroupAccordions;
