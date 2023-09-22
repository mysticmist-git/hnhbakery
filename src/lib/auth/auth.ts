import { auth, provider } from '@/firebase/config';
import { createUser, getUserByUid } from '@/lib/DAO/userDAO';
import User from '@/models/user';
import { UserCredential, signInWithPopup } from 'firebase/auth';
import router from 'next/router';
import { DEFAULT_GROUP_ID } from '../DAO/groupDAO';
import { SignInInfo } from '../types/auth';

export const addUserWithGoogleLogin = async (
  userCredential: UserCredential
) => {
  try {
    const user = userCredential.user;

    const data: Omit<User, 'id'> = {
      uid: user.uid,
      name: user.displayName ?? '',
      tel: user.phoneNumber ?? '',
      mail: user.email ?? '',
      birth: new Date(1990, 1, 1),
      avatar: '',
      active: true,
      group_id: DEFAULT_GROUP_ID,
      type: 'google',
      created_at: new Date(),
      updated_at: new Date(),
    };

    await createUser(DEFAULT_GROUP_ID, data);
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

export const validateMailAndPassword = ({
  mail,
  password,
}: SignInInfo): { valid: boolean; msg: string } => {
  if (!mail) {
    return {
      valid: false,
      msg: 'Vui lòng nhập email',
    };
  }

  if (!password) {
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
