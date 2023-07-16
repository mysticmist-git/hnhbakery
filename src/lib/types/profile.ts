import { UserObject } from '../models';

export interface LeftProfileColumnProps {
  image: string;
  userId: string;
  onUpdateUserData?: (
    field: keyof UserObject,
    value: UserObject[keyof UserObject]
  ) => void;
}

type field = keyof UserObject;
