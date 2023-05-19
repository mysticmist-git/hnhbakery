import { auth, db, provider } from '@/firebase/config';
import {
  UserCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { Timestamp, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import router from 'next/router';

export interface User {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  tel?: string | null;
  birth?: Timestamp | null;
  address?: string | null;
  email?: string | null;
  photoURL?: string | null;
  lastLogin?: Timestamp | null;
}

export async function addUser(userCredential: UserCredential) {
  const user = userCredential.user;

  // Add/update user info to Firestore
  const userRef = doc(db, 'users', user.uid);
  const data: User = {
    name: user.displayName,
    tel: user.phoneNumber,
    email: user.email,
    photoURL: user.photoURL,
    lastLogin: Timestamp.now(),
  };

  setDoc(userRef, data, { merge: true });
}

export async function updateUserLogin(userCredential: UserCredential) {
  try {
    const user = userCredential.user;

    // Add/update user info to Firestore
    const userRef = doc(db, 'users', user.uid);
    const data: User = {
      lastLogin: Timestamp.now(),
    };

    setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.log(error);
  }
}

export const handleLoginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);

    addUser(userCredential);
    updateUserLogin(userCredential);

    // Redirect to home page after successful login
    router.push('/');
  } catch (error) {
    console.log(error);
  }
};
export const signUserInWithEmailAndPassword = async (props: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      props.email,
      props.password,
    );
    const user = userCredential;
    return { result: 'successful', userCredential: user };
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const returnedError: AuthResult = {
      result: 'fail',
      errorCode,
      errorMessage,
    };
    console.log(returnedError);
    return returnedError;
  }
};

export enum NotifierType {
  SUCCESSFUL,
  FAIL,
  EMPTY_FIELD,
  EMAIL_EXISTED,
  ERROR,
  NETWORK_ERROR,
}

export enum NotifierMessage {
  SUCCESSFUL = 'Thành công',
  FAIL = 'Thất bại',
  EMPTY_FIELD = 'Thiếu thông tin',
  EMAIL_EXISTED = 'Email đã được sử dụng',
  ERROR = 'Lỗi',
  NETWORK_ERROR = 'Lỗi mạng',
}

export interface AuthResult {
  result: 'successful' | 'fail';
  userCredential?: UserCredential;
  errorCode?: string;
  errorMessage?: string;
}
export function SignInPropsFromObject(props: any): SignInProps {
  const signInData: SignInProps = {
    email: props.email as string,
    password: props.password as string,
  };
  return signInData;
}
export function SignUpPropsFromObject(props: any): SignUpProps {
  const signUpData: SignUpProps = {
    firstName: props.firstName as string,
    lastName: props.lastName as string,
    email: props.email as string,
    password: props.password as string,
  };
  return signUpData;
}

export interface SignUpProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInProps {
  email: string;
  password: string;
}

export enum AuthErrorCode {
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  NETWORK_REQUEST_FAILED = 'auth/network-request-failed',
}
