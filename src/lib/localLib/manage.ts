import { COLLECTION_NAME } from '@/lib/constants';
import {
  StorageBatchObject,
  StorageProductObject,
  StorageProductTypeObject,
} from '../firestore/firestoreLib';
import BaseObject from '../models/BaseObject';

//#region Constants

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

export const initManageState: ManageState = {
  modalData: null,
  originalModalData: null,
  mainDocs: null,
  searchText: '',
  selectedTarget: null,
  crudModalOpen: false,
  crudModalMode: 'none',
  isDisplayActiveOnly: true,
  deleteDoc: null,
  loading: false,
};

const manageCollections: string[] = [
  COLLECTION_NAME.PRODUCT_TYPES,
  COLLECTION_NAME.PRODUCTS,
  COLLECTION_NAME.BATCHES,
];

//#endregion

//#region Types

export interface CrudTarget {
  label: string;
  collectionName: string;
}

export enum ManageActionType {
  SET_MAIN_DOCS = 'SET_MAIN_DOCS',
  SET_SELECTED_TARGET = 'SET_SELECTED_TARGET',
  SET_CRUD_MODAL_OPEN = 'SET_CRUD_MODAL_OPEN',
  SET_CRUD_MODAL_MODE = 'SET_CRUD_MODAL_MODE',
  UPDATE_SPECIFIC_DOC = 'UPDATE_SPECIFIC_DOC',
  SET_SEARCH_TEXT = 'SET_SEARCH_TEXT',
  SET_DISPLAY_ACTIVE_ONLY = 'SET_DISPLAY_ACTIVE_ONLY',
  NEW_ROW = 'NEW_ROW',
  VIEW_ROW = 'VIEW_ROW',
  SET_MODAL_DATA = 'SET_MODAL_DATA',
  SET_ORIGINAL_MODAL_DATA = 'SET_ORIGINAL_MODAL_DATA',
  SET_DELETE_DOC = 'SET_DELETE_DOC',
  SET_LOADING = 'SET_LOADING',
}

export type ModalMode = 'create' | 'update' | 'view' | 'none';

export interface ManageState {
  modalData: BaseObject | null;
  originalModalData: BaseObject | null;
  mainDocs: BaseObject[] | null;
  searchText: string;
  selectedTarget: CrudTarget | null;
  crudModalOpen: boolean;
  crudModalMode: ModalMode;
  isDisplayActiveOnly: boolean;
  deleteDoc: BaseObject | null;
  loading: boolean;
}

export interface ManageAction {
  type: ManageActionType;
  payload: any;
}

export type VoidHandler = () => void;

export type ViewRowHandler = (rowId: string) => void;
export type DeleteRowHandler = (doc: BaseObject) => void;
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
  disabled: boolean;
  loading: boolean;
}

export interface ModalProductTypeObject extends StorageProductTypeObject {}
export interface ModalProductObject extends StorageProductObject {}
export interface ModalBatchObject extends StorageBatchObject {}

export type ModalFormDataChangeHandler = (newData: BaseObject) => void;

export interface ModalFormProps {
  mode: ModalMode;
  readOnly: boolean;
  onDataChange: ModalFormDataChangeHandler;
  disabled: boolean;
}

export type ModalModeToggleHandler = VoidHandler;

export interface FormRef {
  getProductTypeFormRef(): ProductTypeFormRef | null;
  getProductFormRef(): ProductFormRef | null;
}

export interface ProductTypeFormRef {
  getImageFile(): File | null;
}

export interface ProductFormRef {
  getImageFiles(): FileWithUrl[] | null;
}

export type DialogResult = 'close' | 'confirm';

export type FileWithUrl = {
  file: File;
  url: string;
};

//#endregion

//#region Functions

export function statusTextResolver(isActive: boolean) {
  return isActive ? 'Hoạt động' : 'Đã ngưng';
}

export function manageReducer(
  state: ManageState,
  action: ManageAction
): ManageState {
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
        modalData: generateDefaultRow(action.payload),
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
    case ManageActionType.SET_DELETE_DOC:
      return {
        ...state,
        deleteDoc: action.payload,
      };
    case ManageActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return { ...state };
  }
}

export function generateDefaultRow(collectionName: string) {
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
}

export const validateCollectionNameParams = (
  collectionName: string
): boolean => {
  return manageCollections.includes(collectionName);
};

//#endregion
