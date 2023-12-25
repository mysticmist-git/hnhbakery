import AccountTable from '@/components/authorize/AccountTable.tsx';
import NewUserGroupDialog from '@/components/authorize/NewUserGroupDialog';
import PermissionTable from '@/components/authorize/PermissionTable';
import UserGroupAccordions from '@/components/authorize/UserGroupAccordions';
import { db } from '@/firebase/config';
import { createGroup, getGroupTableRows, getGroups } from '@/lib/DAO/groupDAO';
import { getPermissions } from '@/lib/DAO/permissionDAO';
import { getUsers } from '@/lib/DAO/userDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import useLoadingService from '@/lib/hooks/useLoadingService';
import { AuthorizeContext } from '@/lib/pageSpecific/authorize';
import Group, { GroupTableRow } from '@/models/group';
import Permission from '@/models/permission';
import User from '@/models/user';
import { Button, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// interface AuthorizeProps {
//   userGroups: UserGroup[];
//   permissions: PermissionObject[];
// }

const Authorize = () => {
  const [groups, setGroups] = useState<GroupTableRow[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const handleSnackbarAlert = useSnackbarService();
  const [load, stop] = useLoadingService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        const pers = await getPermissions();
        setPermissions(pers);
        setGroups(await getGroupTableRows());
        stop();
      } catch (error) {
        console.log(error);
        stop();
      }
    };
    fetchData();
  }, []);

  const [newGroup, setNewGroup] = useState<Group | null>(null);

  const handleNewGroupOpen = () => {
    setNewGroup({
      id: '',
      name: '',
      permissions: [],
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  };

  // const [viewGroup, setViewGroup] = useState<GroupTableRow | null>(null);
  // const handleViewGroup = (group: GroupTableRow) => {
  //   setViewGroup(group);
  // };
  // const handleCloseViewGroup = () => setViewGroup(null);

  const carriedHandleGroupChange = (
    group: GroupTableRow | null,
    setGroup: React.Dispatch<React.SetStateAction<GroupTableRow | null>>
  ) => {
    const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = event.target;

      if (group) {
        if (name === 'permission') {
          if (checked) {
            setGroup({
              ...group,
              permissions: [...group.permissions, value],
            });
          } else {
            setGroup({
              ...group,
              permissions: [...group.permissions.filter((p) => p !== value)],
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
      try {
        await createGroup(newGroup);
      } catch (error) {
        console.log(error);
      }
      setGroups([...groups, newGroup]);
      handleSnackbarAlert('success', 'Thêm mới thành công');
      setNewGroup(null);
    }
  };

  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

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
        {/* <Tab label="Người dùng" color="secondary" /> */}
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

          {groups && groups.length > 0 ? (
            <UserGroupAccordions groups={groups ?? []} />
          ) : (
            <Box
              component={'div'}
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
