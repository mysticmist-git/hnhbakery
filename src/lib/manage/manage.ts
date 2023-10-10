import { COLLECTION_NAME } from '@/lib/constants';
import Batch from '@/models/batch';
import Product from '@/models/product';
import ProductType from '@/models/productType';
import { BatchObject } from '../models';
import {
  CrudTarget,
  ManageAction,
  ManageActionType,
  ManageState,
} from '../types/manage';

//#region Constants

export const PATH = '/manager/storage';
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
      const productType: ProductType = {
        id: '',
        name: '',
        description: '',
        image: '',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      return productType;
    case COLLECTION_NAME.PRODUCTS:
      const product: Product = {
        id: '',
        product_type_id: '',
        name: '',
        description: '',
        ingredients: [],
        colors: [],
        how_to_use: '',
        preservation: '',
        images: [],
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      return product;
    case COLLECTION_NAME.BATCHES:
      const MFG = new Date();

      const EXP = new Date();
      EXP.setDate(MFG.getDate() + 1);

      const discountDate = new Date(EXP);
      discountDate.setHours(discountDate.getHours() - 3);

      const batch: Batch = {
        id: '',
        quantity: 0,
        sold: 0,
        mfg: MFG,
        exp: EXP,
        discount: {
          percent: 0,
          start_at: discountDate,
        },
        product_type_id: '',
        product_id: '',
        variant_id: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      return batch;
    default:
      return { id: '' };
  }
}
export const validateCollectionNameParams = (
  collectionName: string
): boolean => {
  return manageCollections.includes(collectionName);
};

export function userAccountTypeParse(type: string) {
  switch (type) {
    case 'google':
      return 'Google';
    case 'email_n_password':
      return 'Đăng ký';
    default:
      return 'Lỗi';
  }
}

//#endregion
