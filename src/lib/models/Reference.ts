import { DocumentData } from 'firebase/firestore';

export interface Reference extends DocumentData {
  id: string;
  name: string;
  values: any[];
}
