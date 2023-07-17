import { default as NewUserGroupDialog } from '@/components/authorize/NewUserGroupDialog';
import PermissionTable from '@/components/authorize/PermissionTable';
import UserGroupAccordions from '@/components/authorize/UserGroupAccordions';
import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  Permission,
  UserGroup,
  UserObject,
  permissionConverter,
  userConverter,
  userGroupConverter,
} from '@/lib/models';
import { Button, Tab, Tabs } from '@mui/material';
import { Stack } from '@mui/system';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

interface AuthorizeProps {
  userGroups: UserGroup[];
  permissions: Permission[];
}

const Authorize: React.FC<AuthorizeProps> = () => {
  const userGroupsRef = collection(db, COLLECTION_NAME.USER_GROUPS);
  const [userGroups] = useCollectionData<UserGroup>(
    userGroupsRef.withConverter(userGroupConverter),
    {
      initialValue: [],
    }
  );

  const usersRef = collection(db, COLLECTION_NAME.USERS);
  const [users] = useCollectionData<UserObject>(
    usersRef.withConverter<UserObject>(userConverter),
    {
      initialValue: [],
    }
  );

  const [group, setGroup] = useState<UserGroup | null>(null);
  const [newGroup, setNewGroup] = useState<UserGroup | null>(null);

  const handleNewGroupOpen = () => {
    setNewGroup({
      id: '',
      name: '',
      users: [],
      permission: [],
      isActive: true,
    });
  };

  const handleNewGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (newGroup) {
      setNewGroup({
        ...newGroup,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleNewGroupSubmit = async () => {
    if (newGroup) {
      const userGroupRef = collection(
        db,
        COLLECTION_NAME.USER_GROUPS
      ).withConverter(userGroupConverter);

      await addDoc(userGroupRef, newGroup);
      setNewGroup(null);
    }
  };

  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const permissionCollectionRef = collection(db, COLLECTION_NAME.PERMISSIONS);

  const [permissions] = useCollectionData<Permission>(
    permissionCollectionRef.withConverter(permissionConverter),
    {
      initialValue: [],
    }
  );

  return (
    <Stack gap={1} my={2} pr={3}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        centered
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="User Groups" color="secondary" />
        <Tab label="Permissions" color="secondary" />
      </Tabs>

      {currentTab === 0 && (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleNewGroupOpen}
            sx={{
              alignSelf: 'flex-end',
            }}
          >
            Thêm nhóm người dùng
          </Button>

          <UserGroupAccordions
            userGroups={userGroups ?? []}
            users={users ?? []}
          />

          <NewUserGroupDialog
            newGroup={newGroup}
            setNewGroup={setNewGroup}
            handleNewGroupChange={handleNewGroupChange}
            handleNewGroupSubmit={handleNewGroupSubmit}
          />
        </>
      )}

      {currentTab === 1 && <PermissionTable permissions={permissions ?? []} />}
    </Stack>
  );
};

export default Authorize;
