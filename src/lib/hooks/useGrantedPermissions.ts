import { auth } from '@/firebase/config';
import { documentId, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getGroupById } from '../DAO/groupDAO';
import { getPermissionsWithQuery } from '../DAO/permissionDAO';
import { getUserByUid } from '../DAO/userDAO';

export default function useGrantedPermissions() {
  const [user, userLoading, errorLoading] = useAuthState(auth);

  const [grantedPermissions, setGrantedPermissions] = useState<string[]>([]);

  useEffect(() => {
    async function getPermissionIds(uid: string) {
      console.log(uid);

      const signInUser = await getUserByUid(uid);

      if (!signInUser) setGrantedPermissions([]);
      else {
        console.log(signInUser);

        const group = await getGroupById(signInUser.group_id);

        if (!group) {
          setGrantedPermissions([]);
          return;
        }

        const permissions = await getPermissionsWithQuery(
          where(documentId(), 'in', group.permissions)
        );

        setGrantedPermissions(permissions.map((permission) => permission.code));
      }
    }

    if (userLoading) return;
    if (errorLoading) return;
    if (!user) return;

    const uid = user.uid;

    getPermissionIds(uid);
  }, [errorLoading, user, userLoading]);

  return grantedPermissions;
}
