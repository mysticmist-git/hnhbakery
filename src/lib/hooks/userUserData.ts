import { db } from '@/firebase/config';
import { collection, doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { COLLECTION_NAME } from '../constants';
import User from '@/models/user';
import { getUserRefByUid } from '../DAO/userDAO';

async function useUserData(userId: string) {
  const [userData, userDataLoading, userDataError] = useDocumentData<User>(
    await getUserRefByUid(userId),
    {
      initialValue: {
        id: '',
        uid: '',
        name: '',
        tel: '',
        birth: new Date(),
        mail: '',
        avatar: '',
        group_id: '',
        type: 'mail',
        active: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    }
  );

  return {
    userData,
    userDataLoading,
    userDataError,
  };
}

export default useUserData;
