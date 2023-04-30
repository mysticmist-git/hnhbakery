import { CollectionObj } from '@/lib/models/utilities';
import { CollectionName } from '@/lib/models/utilities';
import { Button } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

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
