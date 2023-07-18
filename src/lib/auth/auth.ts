import { auth, db, provider } from '@/firebase/config';
import { UserCredential, signInWithPopup } from 'firebase/auth';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import router from 'next/router';
import { COLLECTION_NAME } from '../constants';
import { getDocFromFirestore } from '../firestore';
import { UserObject } from '../models';
import { SignInInfo, SignupUser } from '../types/auth';

export const addUserWithEmailAndPassword = async (
  id: string,
  userData: SignupUser
) => {
  try {
    delete userData.id;
    await setDoc(doc(collection(db, COLLECTION_NAME.USERS), id), userData);
  } catch (error) {
    console.log(error);
  }
};

export const addUserWithGoogleLogin = (userCredential: UserCredential) => {
  try {
    const user = userCredential.user;

    const userData: UserObject = {
      id: user.uid,
      name: user.displayName ?? '',
      tel: user.phoneNumber ?? '',
      mail: user.email ?? '',
      accountType: 'google',
      role_id: 'customer',
      addresses: [],
      birthday: new Date(1990, 1, 1),
      image: '',
      isActive: true,
    };

    setDoc(doc(db, 'users', user.uid), userData);
  } catch (error) {
    console.log(error);
  }
};

export const handleLoginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);

    try {
      const user = await getDocFromFirestore<UserObject>(
        'users',
        userCredential.user.uid
      );

      if (!user) throw new Error('No user');
    } catch (error) {
      addUserWithGoogleLogin(userCredential);
    }
  } catch (error) {
    console.log(error);
  } finally {
    router.push('/');
  }
};
export const validateSigninInfo = ({
  mail,
  password,
}: SignInInfo): { valid: boolean; msg: string } => {
  if (!mail || mail.length <= 0) {
    return {
      valid: false,
      msg: 'Vui lòng nhập email',
    };
  }

  if (!password || password.length <= 0) {
    return {
      valid: false,
      msg: 'Vui lòng nhập mật khẩu',
    };
  }

  return {
    valid: true,
    msg: 'Hợp lệ',
  };
};
