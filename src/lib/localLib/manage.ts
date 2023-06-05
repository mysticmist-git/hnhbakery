import { CollectionName, Nameable } from '@/lib/models/utilities';
import { Dispatch } from 'react';
import BaseObject from '../models/BaseObject';

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
  SET_SEARCH_TEXT = 'SET_SEARCH_TEXT',
  SET_DISPLAY_ACTIVE_ONLY = 'SET_DISPLAY_ACTIVE_ONLY',
}

export type ModalMode = 'create' | 'update' | 'view' | 'none';

export interface ManageState {
  mainDocs: BaseObject[] | null;
  searchText: string;
  mainCollectionName: CollectionName;
  selectedTarget: CrudTarget | null;
  displayingData: BaseObject | null;
  loading: boolean;
  dialogOpen: boolean;
  crudModalOpen: boolean;
  crudModalMode: ModalMode;
  deletingId: string;
  isDisplayActiveOnly: boolean;
}

export interface ManageContextType {
  state: ManageState;
  dispatch: Dispatch<any>;
  handleViewRow: any;
  handleDeleteRowOnFirestore: any;
  resetDisplayingData: any;
  handleSearchFilter: <T extends BaseObject & Nameable>(
    docs: T[] | null
  ) => T[] | null;
}

export interface ManageAction {
  type: ManageActionType;
  payload: any;
}

export const manageReducer = (
  state: ManageState,
  action: ManageAction
): ManageState => {
  switch (action.type) {
    case ManageActionType.SET_MAIN_DOCS:
      return {
        ...state,
        mainDocs: action.payload,
      };
    case ManageActionType.SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };

    case ManageActionType.UPDATE_SPECIFIC_DOC:
      if (!state.mainDocs) return { ...state, mainDocs: null };

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

    case ManageActionType.SET_DISPLAY_ACTIVE_ONLY:
      return {
        ...state,
        isDisplayActiveOnly: action.payload,
      };

    default:
      return { ...state };
  }
};

export interface CrudTarget {
  collectionName: CollectionName;
  label: string;
}

export const generateDefaultRow = (collectionName: CollectionName) => {
  switch (collectionName) {
    case CollectionName.ProductTypes:
      return {
        id: '',
        name: '',
        description: '',
        image: '',
        isActive: true,
      };
    case CollectionName.Products:
      return {
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
      };
    case CollectionName.Batches:
      const MFG = new Date();

      const EXP = new Date();
      EXP.setDate(MFG.getDate() + 1);

      const discountDate = new Date(EXP);
      discountDate.setHours(discountDate.getHours() - 6);

      const discountPercent = 30;

      return {
        id: '',
        totalQuantity: 0,
        soldQuantity: 0,
        MFG: MFG,
        EXP: EXP,
        material: '',
        size: '',
        price: 0,
        discountDate: discountDate,
        discountPercent: discountPercent,
        product_id: '',
      };
    default:
      return {};
  }
};
