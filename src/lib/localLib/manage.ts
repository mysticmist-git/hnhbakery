import { COLLECTION_NAME } from '@/lib/constants';
import {
  StorageBatchObject,
  StorageProductObject,
  StorageProductTypeObject,
} from '../firestore/firestoreLib';
import BaseObject from '../models/BaseObject';

export const statusTextResolver = (isActive: boolean) => {
  return isActive ? 'Còn cung cấp' : 'Ngưng cung cấp';
};

export const PATH = '/manager/manage';

export const crudTargets: CrudTarget[] = [
  {
    collectionName: COLLECTION_NAME.PRODUCT_TYPES,
    label: 'Loại sản phẩm',
  },
  {
    collectionName: COLLECTION_NAME.PRODUCTS,
    label: 'Sản phẩm',
  },
  {
    collectionName: COLLECTION_NAME.BATCHES,
    label: 'Lô hàng',
  },
];

export enum ManageActionType {
  SET_MAIN_DOCS = 'SET_MAIN_DOCS',
  SET_SELECTED_TARGET = 'SET_SELECTED_TARGET',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_CRUD_MODAL_OPEN = 'SET_CRUD_MODAL_OPEN',
  SET_CRUD_MODAL_MODE = 'SET_CRUD_MODAL_MODE',
  UPDATE_SPECIFIC_DOC = 'UPDATE_SPECIFIC_DOC',
  SET_SEARCH_TEXT = 'SET_SEARCH_TEXT',
  SET_DISPLAY_ACTIVE_ONLY = 'SET_DISPLAY_ACTIVE_ONLY',
  NEW_ROW = 'NEW_ROW',
  VIEW_ROW = 'VIEW_ROW',
  SET_MODAL_DATA = 'SET_MODAL_DATA',
  SET_ORIGINAL_MODAL_DATA = 'SET_ORIGINAL_MODAL_DATA',
}

export type ModalMode = 'create' | 'update' | 'view' | 'none';

export interface ManageState {
  modalData: BaseObject | null;
  originalModalData: BaseObject | null;
  mainDocs: BaseObject[] | null;
  searchText: string;
  selectedTarget: CrudTarget | null;
  dialogOpen: boolean;
  crudModalOpen: boolean;
  crudModalMode: ModalMode;
  isDisplayActiveOnly: boolean;
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
    case ManageActionType.SET_MODAL_DATA:
      return {
        ...state,
        modalData: action.payload,
      };
    case ManageActionType.SET_ORIGINAL_MODAL_DATA:
      return {
        ...state,
        originalModalData: action.payload,
      };
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

    case ManageActionType.NEW_ROW:
      return {
        ...state,
        crudModalMode: 'create',
        crudModalOpen: true,
      };

    case ManageActionType.VIEW_ROW:
      return {
        ...state,
        modalData: action.payload,
        originalModalData: action.payload,
        crudModalMode: 'view',
        crudModalOpen: true,
      };

    default:
      return { ...state };
  }
};

export interface CrudTarget {
  label: string;
  collectionName: string;
}

export const generateDefaultRow = (collectionName: string) => {
  switch (collectionName) {
    case COLLECTION_NAME.PRODUCT_TYPES:
      return {
        id: '',
        name: '',
        description: '',
        image: '',
        isActive: true,
      };
    case COLLECTION_NAME.PRODUCTS:
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
    case COLLECTION_NAME.BATCHES:
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

export const initManageState: ManageState = {
  modalData: null,
  originalModalData: null,
  mainDocs: null,
  searchText: '',
  selectedTarget: null,
  dialogOpen: false,
  crudModalOpen: false,
  crudModalMode: 'none',
  isDisplayActiveOnly: true,
};

const manageCollections: string[] = [
  COLLECTION_NAME.PRODUCT_TYPES,
  COLLECTION_NAME.PRODUCTS,
  COLLECTION_NAME.BATCHES,
];

export const validateCollectionNameParams = (
  collectionName: string
): boolean => {
  return manageCollections.includes(collectionName);
};

export type VoidHandler = () => void;

export type ViewRowHandler = (rowId: string) => void;
export type DeleteRowHandler = (rowId: string) => void;
export type ModalDeleteHandler = VoidHandler;

export interface GeneratedTableBodyProps {
  handleViewRow: ViewRowHandler;
  handleDeleteRow: DeleteRowHandler;
}

export type AddRowHandler = () => void;
export type UpdateRowHandler = () => void;
export type ResetFormHandler = () => void;
export type ModalCloseHandler = () => void;
export type CancelUpdateDataHandler = () => void;

export interface CommonRowModalProps {
  open: boolean;
  handleResetForm: ResetFormHandler;
  handleModalClose: ModalCloseHandler;
  handleToggleModalEditMode: ModalModeToggleHandler;
  handleCancelUpdateData: CancelUpdateDataHandler;
  mode: ModalMode;
  collectionName: string;
}

export interface ModalProductTypeObject extends StorageProductTypeObject {}
export interface ModalProductObject extends StorageProductObject {}
export interface ModalBatchObject extends StorageBatchObject {}

export type ModalFormDataChangeHandler = (newData: BaseObject) => void;

export interface ModalFormProps {
  mode: ModalMode;
  readOnly: boolean;
  onDataChange: ModalFormDataChangeHandler;
}

export type ModalModeToggleHandler = VoidHandler;

export interface FormRef {
  getProductTypeFormRef(): ProductTypeFormRef | null;
}

export interface ProductTypeFormRef {
  getImageFile(): File | null;
}
