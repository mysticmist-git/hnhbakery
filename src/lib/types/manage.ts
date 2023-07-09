import {
  BaseObject,
  StorageBatchObject,
  StorageProductObject,
  StorageProductTypeObject,
} from '../models';

export type ModalMode = 'create' | 'update' | 'view' | 'none';

export type ManageState = {
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
};

export type ManageAction = {
  type: ManageActionType;
  payload: any;
};

export type VoidHandler = () => void;

export type ViewRowHandler = (rowId: string) => void;

export type DeleteRowHandler = (doc: BaseObject) => void;

export type ModalDeleteHandler = VoidHandler;

export type GeneratedTableBodyProps = {
  handleViewRow: ViewRowHandler;
  handleDeleteRow: DeleteRowHandler;
};

export type AddRowHandler = () => void;
export type UpdateRowHandler = () => void;
export type ResetFormHandler = () => void;
export type ModalCloseHandler = () => void;
export type CancelUpdateDataHandler = () => void;

export type CommonRowModalProps = {
  open: boolean;
  handleResetForm: ResetFormHandler;
  handleModalClose: ModalCloseHandler;
  handleToggleModalEditMode: ModalModeToggleHandler;
  handleCancelUpdateData: CancelUpdateDataHandler;
  mode: ModalMode;
  collectionName: string;
  disabled: boolean;
  loading: boolean;
};

export type ModalProductTypeObject = StorageProductTypeObject & {};
export type ModalProductObject = StorageProductObject & {};
export type ModalBatchObject = StorageBatchObject & {};

export type ModalFormDataChangeHandler = (newData: BaseObject) => void;

export type ModalFormProps = {
  mode: ModalMode;
  readOnly: boolean;
  onDataChange: ModalFormDataChangeHandler;
  disabled: boolean;
};

export type ModalModeToggleHandler = VoidHandler;

export type FormRef = {
  getProductTypeFormRef(): ProductTypeFormRef | null;
  getProductFormRef(): ProductFormRef | null;
};

export type ProductTypeFormRef = {
  getImageFile(): File | null;
};

export type ProductFormRef = {
  getProductTypeName(): string;
  getImageFiles(): FileWithUrl[] | null;
};

export type DialogResult = 'close' | 'confirm';

export type FileWithUrl = {
  file: File;
  url: string;
};

export type CrudTarget = {
  label: string;
  collectionName: string;
};

declare enum DataManagerErrorCode {
  NULL_FIELD = 'null-field',
  NULL_ADD_DATA = 'null-data-data',
  NULL_DATA = 'null-data',
}

//#region Add

export type AddData = {
  data: BaseObject;
};

export type ProductTypeAddData = AddData & {
  imageFile?: File;
};

export type ProductAddData = AddData & {
  productTypeName: string;
  imageFiles: File[];
};

export type BatchAddData = AddData & {};

//#endregion

//#region Update

export type UpdateData = {
  newData: BaseObject;
  originalData: BaseObject;
};

export type ProductTypeUpdateData = UpdateData & {
  imageFile: File;
};

export type ProductUpdateData = UpdateData & {
  imageFiles: FileWithUrl[];
};

export type BatchUpdateData = UpdateData & {};

//#endregion

export type DataManagerStrategy = {
  dispatch: React.Dispatch<ManageAction>;
  addDoc(addData: AddData): Promise<BaseObject>;
  updateDoc(updateData: UpdateData): Promise<BaseObject>;
  deleteDoc(doc: BaseObject): void;
};

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
