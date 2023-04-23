import { CollectionObj } from '@/lib/models/utilities';

/**
 * Define interface for row data
 */
export interface Row {
  id: string;
  [key: string]: any;
}

/**
 * Define state of the manage page
 */
export interface ManageState {
  currentSelectedCrudTarget: string;
}

/**
 * Define manage page's props
 */
export interface ManageProps {
  state: ManageState;
  mainCollection: CollectionObj;
  referenceCollections: CollectionObj[];
}
