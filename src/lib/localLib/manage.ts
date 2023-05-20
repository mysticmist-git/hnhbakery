import { CollectionName } from '@/lib/models/utilities';
import { DocumentData, Timestamp } from 'firebase/firestore';
import { Dispatch } from 'react';

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

export enum ManageActionType {
  SET_MAIN_DOCS = 'SET_MAIN_DOCS',
  SET_SELECTED_TARGET = 'SET_SELECTED_TARGET',
  SET_DISPLAYING_DATA = 'SET_DISPLAYING_DATA',
  SET_LOADING = 'SET_LOADING',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_CRUD_MODAL_OPEN = 'SET_CRUD_MODAL_OPEN',
  SET_CRUD_MODAL_MODE = 'SET_CRUD_MODAL_MODE',
  SET_DELETING_ID = 'SET_DELETING_ID',
  UPDATE_SPECIFIC_DOC = 'UPDATE_SPECIFIC_DOC',
}

export type ModalMode = 'create' | 'update' | 'view' | 'none';

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
  handleDeleteRowOnFirestore: any;
  resetDisplayingData: any;
}

export const manageReducer = (state: ManageState, action: any) => {
  switch (action.type) {
    case ManageActionType.SET_MAIN_DOCS:
      return {
        ...state,
        mainDocs: action.payload,
      };

    case ManageActionType.UPDATE_SPECIFIC_DOC:
      const { id, data } = action.payload;

      if (!id || !data) return state;

      const copyMainDocs = [...state.mainDocs];

      const doc = copyMainDocs.findIndex((doc) => doc.id === id);

      if (doc === -1) return state;

      copyMainDocs[doc] = data;

      return {
        ...state,
        mainDocs: copyMainDocs,
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

export interface CrudTarget {
  collectionName: CollectionName;
  label: string;
}

export const DEFAULT_ROW = {
  PRODUCT_TYPE: {
    id: '',
    name: '',
    description: '',
    image: '',
    isActive: true,
  },
  PRODUCT: {
    id: '',
    productType_id: '',
    name: '',
    description: '',
    ingredients: [],
    materials: [],
    colors: [],
    sizes: [],
    howToUse: '',
    preservation: '',
    images: [],
    isActive: true,
  },
  BATCH: {
    id: '',
    totalQuantity: 0,
    soldQuantity: 0,
    MFG: Timestamp.now().toDate(),
    EXP: Timestamp.now()
      .toDate()
      .setDate(Timestamp.now().toDate().getDate() + 1),
    material: 0,
    size: 0,
    color: 0,
    price: 0,
    discount: [],
    product_id: '',
  },
};
