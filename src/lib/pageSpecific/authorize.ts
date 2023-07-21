import { auth, db } from '@/firebase/config';
import { User } from 'firebase/auth';
import { collection } from 'firebase/firestore';
import { createContext, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { COLLECTION_NAME } from '../constants';
import {
  PermissionObject,
  UserGroup,
  permissionConverter,
  userGroupConverter,
} from '../models';

export interface AuthorizeContextType {
  permissions: PermissionObject[];
}

export const AuthorizeContext = createContext<AuthorizeContextType>({
  permissions: [],
});

export const permissionRouteMap = new Map([
  ['KHO', '/manager/storage'],
  ['PQ', '/manager/authorize'],
  ['ĐH', '/manager/orders'],
  ['KH', '/manager/customers'],
  ['BC', '/manager/reports'],
  ['GH', '/manager/deliveries'],
  ['LH', '/manager/contacts'],
  ['KM', '/manager/sales'],
  ['FB', '/manager/feedbacks'],
]);

export function useAvailablePermissions(): {
  user: User | null | undefined;
  available: string[];
  loading: boolean;
} {
  const [user, uLoading, uError] = useAuthState(auth);

  const [groups, gLoading, gError] = useCollectionData<UserGroup>(
    collection(db, COLLECTION_NAME.USER_GROUPS).withConverter(
      userGroupConverter
    ),
    { initialValue: [] }
  );

  const [permissions, pLoading, pError] = useCollectionData<PermissionObject>(
    collection(db, COLLECTION_NAME.PERMISSIONS).withConverter(
      permissionConverter
    ),
    { initialValue: [] }
  );

  const available: string[] = useMemo(() => {
    if (!user || !groups || !permissions || uLoading || gLoading || pLoading) {
      return [];
    }

    const group = groups.filter((g) => g.users.includes(user.uid));

    const availabePermissions = permissions.filter((p) =>
      group
        ?.map((g) => g.permission)
        .flat()
        .includes(p.id!)
    );

    return availabePermissions.map((p) => p.code);
  }, [user, groups, permissions, uLoading, gLoading, pLoading]);

  return { user, available, loading: uLoading || gLoading || pLoading };
}
