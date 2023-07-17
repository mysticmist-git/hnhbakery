import { UserGroup, UserObject } from '@/lib/models';
import React from 'react';
import UserGroupItem from '../UserGroupItem';

interface UserGroupAccordionProps {
  userGroups: UserGroup[];
  users: UserObject[];
}

const UserGroupAccordions = ({
  userGroups,
  users,
}: UserGroupAccordionProps) => {
  return (
    <>
      {userGroups?.map((group, index) => (
        <UserGroupItem
          key={index}
          group={group}
          users={users.filter((user) => group.users.includes(user.id!))}
          allUsers={users}
        />
      ))}
    </>
  );
};

export default UserGroupAccordions;
