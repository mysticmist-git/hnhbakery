import { DocumentData } from 'firebase/firestore';

export interface Role extends DocumentData {
    id: string;
    name: string;
    isActive: true;
    right_Ids: string[];
}
