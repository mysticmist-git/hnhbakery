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
      try {
        const signInUser = await getUserByUid(uid);

        if (!signInUser) {
          setGrantedPermissions([]);
        } else {
          const group = await getGroupById(signInUser.group_id);

          if (!group) {
            setGrantedPermissions([]);
            return;
          }

          const permissions = await getPermissionsWithQuery(
            where(documentId(), 'in', group.permissions)
          );

          setGrantedPermissions(
            permissions.map((permission) => permission.code)
          );
        }
      } catch (error) {
        console.log('[useGrantedPermissions] getPermissionIds', error);
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
