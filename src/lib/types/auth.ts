import { Timestamp } from 'firebase/firestore';

export type SignupData = {
  name?: string;
  birthday?: Date;
  tel?: string;
  mail?: string;
  password?: string;
  confirmPassword?: string;
};

export type SignupUser = {
  id?: string;
  name?: string;
  mail?: string;
  birthday?: Date;
  tel?: string;
  image?: string;
  isActive?: boolean;
  role_id?: string;
  addresses?: string[];
  accountType?: 'google' | 'email_n_password';
};

export type SignInInfo = {
  mail: string;
  password: string;
};
