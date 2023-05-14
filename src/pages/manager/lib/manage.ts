import { CollectionObj } from '@/lib/models/utilities';
import { CollectionName } from '@/lib/models/utilities';
import { Button } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { DocumentData } from 'firebase/firestore';
import { CrudTarget } from '../manage';
import { Dispatch } from 'react';
import { ModalMode } from '../components/modals/lib';

export const crudTargets: CrudTarget[] = [
  {
    collectionName: CollectionName.ProductTypes,
    label: 'Loại sản phẩm',
  },
  {
    collectionName: CollectionName.Products,
    label: 'Sản phẩm',
  },
  {
    collectionName: CollectionName.Batches,
    label: 'Lô hàng',
  },
];

export const initManageState: ManageState = {
  mainDocs: [],
  mainCollectionName: CollectionName.None,
  selectedTarget: crudTargets[0],
  displayingData: null,
  loading: false,
  dialogOpen: false,
  crudModalOpen: false,
  crudModalMode: 'none',
  deletingId: '',
};

export enum ManageActionType {
  SET_MAIN_DOCS = 'SET_MAIN_DOCS',
  SET_SELECTED_TARGET = 'SET_SELECTED_TARGET',
  SET_DISPLAYING_DATA = 'SET_DISPLAYING_DATA',
  SET_LOADING = 'SET_LOADING',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_CRUD_MODAL_OPEN = 'SET_CRUD_MODAL_OPEN',
  SET_CRUD_MODAL_MODE = 'SET_CRUD_MODAL_MODE',
  SET_DELETING_ID = 'SET_DELETING_ID',
}

export interface ManageState {
  mainDocs: DocumentData[];
  mainCollectionName: CollectionName;
  selectedTarget: CrudTarget | null;
  displayingData: DocumentData | null;
  loading: boolean;
  dialogOpen: boolean;
  crudModalOpen: boolean;
  crudModalMode: ModalMode;
  deletingId: string;
}

export interface ManageContextType {
  state: ManageState;
  dispatch: Dispatch<any>;
  handleViewRow: any;
  handleDeleteRow: any;
  resetDisplayingData: any;
}

export const manageReducer = (state: ManageState, action: any) => {
  switch (action.type) {
    case ManageActionType.SET_MAIN_DOCS:
      return {
        ...state,
        mainDocs: action.payload,
      };

    case ManageActionType.SET_SELECTED_TARGET:
      return {
        ...state,
        selectedTarget: action.payload,
      };

    case ManageActionType.SET_DISPLAYING_DATA:
      return {
        ...state,
        displayingData: action.payload,
      };

    case ManageActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ManageActionType.SET_DIALOG_OPEN:
      return {
        ...state,
        dialogOpen: action.payload,
      };

    case ManageActionType.SET_CRUD_MODAL_OPEN:
      return {
        ...state,
        crudModalOpen: action.payload,
      };

    case ManageActionType.SET_DELETING_ID:
      return {
        ...state,
        deletingId: action.payload,
      };

    case ManageActionType.SET_CRUD_MODAL_MODE:
      return {
        ...state,
        crudModalMode: action.payload,
      };

    default:
      return state;
  }
};
