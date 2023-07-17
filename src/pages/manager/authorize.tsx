import NewUserGroupDialog from '@/components/authorize/NewUserGroupDialog';
import PermissionTable from '@/components/authorize/PermissionTable';
import UserGroupAccordions from '@/components/authorize/UserGroupAccordions';
import { db } from '@/firebase/config';
import { AuthorizeContext } from '@/lib/authorize';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  PermissionObject,
  UserGroup,
  UserObject,
  permissionConverter,
  userConverter,
  userGroupConverter,
} from '@/lib/models';
import { Button, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

interface AuthorizeProps {
  userGroups: UserGroup[];
  permissions: PermissionObject[];
}

const Authorize: React.FC<AuthorizeProps> = () => {
  const userGroupsRef = collection(db, COLLECTION_NAME.USER_GROUPS);
  const [userGroups] = useCollectionData<UserGroup>(
    userGroupsRef.withConverter(userGroupConverter),
    {
      initialValue: [],
    }
  );

  const usersRef = query(
    collection(db, COLLECTION_NAME.USERS),
    where('role_id', '==', 'manager')
  );
  const [users] = useCollectionData<UserObject>(
    usersRef.withConverter<UserObject>(userConverter),
    {
      initialValue: [],
    }
  );

  const [newGroup, setNewGroup] = useState<UserGroup | null>(null);
  const [viewGroup, setViewGroup] = useState<UserGroup | null>(null);

  const handleNewGroupOpen = () => {
    setNewGroup({
      id: '',
      name: '',
      users: [],
      permission: [],
      isActive: true,
    });
  };

  const handleViewGroup = (group: UserGroup) => {
    setViewGroup(group);
  };

  const handleCloseViewGroup = () => setViewGroup(null);

  const carriedHandleGroupChange = (
    group: UserGroup | null,
    setGroup: React.Dispatch<React.SetStateAction<UserGroup | null>>
  ) => {
    const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = event.target;

      if (group) {
        if (name === 'permissions') {
          if (checked) {
            setGroup({
              ...group,
              permission: [...group.permission, value],
            });
          } else {
            setGroup({
              ...group,
              permission: [...group.permission.filter((p) => p !== value)],
            });
          }
        } else {
          setGroup({
            ...group,
            [name]: value,
          });
        }
      }
    };

    return handleGroupChange;
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

  const [permissions] = useCollectionData<PermissionObject>(
    permissionCollectionRef.withConverter(permissionConverter),
    {
      initialValue: [],
    }
  );

  return (
    <AuthorizeContext.Provider value={{ permissions: permissions ?? [] }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        centered
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          my: 1,
        }}
      >
        <Tab label="Nhóm người dùng" color="secondary" />
        <Tab label="Quyền người dùng" color="secondary" />
      </Tabs>

      {currentTab === 0 && (
        <Stack gap={1} pr={3}>
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

          <Divider
            sx={{
              my: 1,
            }}
          />

          {userGroups && userGroups.length > 0 ? (
            <UserGroupAccordions
              userGroups={userGroups ?? []}
              users={users ?? []}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography>Chưa có nhóm người dùng</Typography>
            </Box>
          )}

          <NewUserGroupDialog
            newGroup={newGroup}
            handleDialogClose={() => setNewGroup(null)}
            handleNewGroupChange={carriedHandleGroupChange(
              newGroup,
              setNewGroup
            )}
            handleNewGroupSubmit={handleNewGroupSubmit}
            permissionOptions={permissions ?? []}
          />
        </Stack>
      )}

      {currentTab === 1 && <PermissionTable permissions={permissions ?? []} />}
    </AuthorizeContext.Provider>
  );
};

export default Authorize;
