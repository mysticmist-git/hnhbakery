import { auth, db, provider } from '@/firebase/config';
import { createUser, getUserById, getUserByUid } from '@/lib/DAO/userDAO';
import User from '@/models/user';
import { UserCredential, signInWithPopup } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import router from 'next/router';
import { COLLECTION_NAME } from '../constants';
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

export const addUserWithGoogleLogin = async (
  userCredential: UserCredential
) => {
  try {
    const user = userCredential.user;

    // OLD CODE
    // const userData: UserObject = {
    //   id: user.uid,
    //   name: user.displayName ?? '',
    //   tel: user.phoneNumber ?? '',
    //   mail: user.email ?? '',
    //   accountType: 'google',
    //   role_id: 'customer',
    //   addresses: [],
    //   birthday: new Date(1990, 1, 1),
    //   image: '',
    //   isActive: true,
    // };

    const data: Omit<User, 'id'> = {
      uid: user.uid,
      name: user.displayName ?? '',
      tel: user.phoneNumber ?? '',
      mail: user.email ?? '',
      birth: new Date(1990, 1, 1),
      avatar: '',
      active: true,
      group_id: COLLECTION_NAME.DEFAULT_USERS,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await createUser(data);
  } catch (error) {
    console.log('[Auth service] Fail to add user with google login', error);
  }
};

export const handleLoginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);

    const user = await getUserByUid(userCredential.user.uid);

    if (!user) {
      console.log('[Auth service] No user data found. Proceed to create one.');
      await addUserWithGoogleLogin(userCredential);
    }

    router.push('/');
  } catch (error) {
    console.log('[Auth service] Fail to login with google', error);
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
