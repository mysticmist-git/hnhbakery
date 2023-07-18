import { db } from '@/firebase/config';
import { collection, doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { COLLECTION_NAME } from '../constants';
import { UserObject, userConverter } from '../models';

function useUserData(userId: string) {
  const [userData, userDataLoading, userDataError] =
    useDocumentData<UserObject>(
      doc(collection(db, COLLECTION_NAME.USERS), userId).withConverter(
        userConverter
      ),
      {
        initialValue: {
          id: '',
          accountType: 'none',
          addresses: [],
          name: '',
          mail: '',
          tel: '',
          birthday: new Date(),
          isActive: false,
          role_id: '',
          image: '',
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
