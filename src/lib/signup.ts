import { User } from 'firebase/auth';

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
  userCredential?: User;
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
