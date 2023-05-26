import { auth, db, provider } from '@/firebase/config';
import { UserCredential, signInWithPopup } from 'firebase/auth';
import { Timestamp, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import router from 'next/router';
import { UserObject } from '../models/User';

export interface SignupData {
  name?: string;
  birthday?: Date;
  tel?: string;
  mail?: string;
  password?: string;
  confirmPassword?: string;
}

export interface SignupUser {
  id?: string;
  name?: string;
  mail?: string;
  password?: string;
  birthday?: Timestamp;
  tel?: string;
  image?: string;
  isActive?: boolean;
  role_id?: string;
  addresses?: string[];
  accountType?: 'google' | 'email_n_password';
}

export const addUserWithEmailAndPassword = (
  id: string,
  userData: SignupUser,
) => {
  try {
    setDoc(doc(db, 'users', id), userData);
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
      email: user.email,
      accountType: 'google',
      role_id: 'customer',
    };

    setDoc(doc(db, 'users', user.uid), userData);
  } catch (error) {
    console.log(error);
  }
};

export const handleLoginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);

    addUserWithGoogleLogin(userCredential);

    // Redirect to home page after successful login
    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

export interface SignInInfo {
  email: string;
  password: string;
}

export enum AuthErrorCode {}
