import { COLLECTION_NAME } from '@/lib/constants';
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
        colors: [],
        variants: [],
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
      discountDate.setHours(discountDate.getHours() - 3);

      const batch: BatchObject = {
        id: '',
        totalQuantity: 0,
        soldQuantity: 0,
        MFG: MFG,
        EXP: EXP,
        discount: {
          percent: 0,
          date: discountDate,
        },
        product_id: '',
        variant_id: '',
      };

      return batch;
    default:
      return {};
  }
}

export const validateCollectionNameParams = (
  collectionName: string
): boolean => {
  return manageCollections.includes(collectionName);
};

export function billStatusParse(state: number | undefined) {
  switch (state) {
    case -1:
      return 'Đã hủy';
    case 0:
      return 'Chưa thanh toán';
    case 1:
      return 'Đã thanh toán';
    default:
      return 'Lỗi';
  }
}

export function deliveryStatusParse(state: string | undefined) {
  switch (state) {
    case 'cancel':
      return 'Đã hủy';
    case 'fail':
      return 'Giao hàng thất bại';
    case 'success':
      return 'Giao hàng thành công';
    case 'inProcress':
      return 'Đang xử lý';
    case 'inTransit':
      return 'Trên đường giao';
    default:
      return 'Lỗi';
  }
}

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
