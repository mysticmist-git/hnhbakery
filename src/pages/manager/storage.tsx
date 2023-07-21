import { RowModal } from '@/components/Manage/modals/rowModals';
import CustomDataTable from '@/components/Manage/tables/CustomDataTable';
import { TableActionButton } from '@/components/buttons';
import SimpleDialog from '@/components/dialogs/SimpleDialog/SimpleDialog';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import {
  ProductSearchBarNamesFactory,
  ProductTypeSearchBarNamesFactory,
  SearchBarNamesFactory,
} from '@/lib/factories/SearchBarNamesFactory';
import {
  BatchStorageDocsFetcher,
  ProductStorageDocsFetcher,
  ProductTypeStorageDocsFetcher,
  StorageDocsFactory,
} from '@/lib/factories/StorageDocsFactory';
import { isDataChanged } from '@/lib/manage';
import {
  PATH,
  crudTargets,
  generateDefaultRow,
  initManageState,
  manageReducer,
  validateCollectionNameParams,
} from '@/lib/manage/manage';
import { BaseObject } from '@/lib/models';
import {
  AddData,
  BatchDataManagerStrategy,
  BatchUpdateData,
  DataManagerErrorCode,
  DataManagerStrategy,
  ProductAddData,
  ProductDataManagerStrategy,
  ProductTypeAddData,
  ProductTypeDataManagerStrategy,
  ProductTypeUpdateData,
  ProductUpdateData,
  UpdateData,
} from '@/lib/strategies/DataManagerStrategy';
import {
  CrudTarget,
  DialogResult,
  FormRef,
  ManageAction,
  ManageActionType,
  ManageState,
  ModalProductTypeObject,
} from '@/lib/types/manage';
import { Add, RestartAlt } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';

//#region Styled Components

const DialogButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

//#endregion

export default function Manage({
  success,
  mainDocs: paramMainDocs,
  collectionName: paramCollectionName,
}: {
  success: boolean;
  mainDocs: string;
  collectionName: string;
}) {
  if (!success) return <Typography variant="h4">Lỗi khi trang</Typography>;

  //#region States

  const [state, dispatch] = useReducer<
    React.Reducer<ManageState, ManageAction>
  >(manageReducer, initManageState);

  const [justLoaded, setJustLoaded] = useState(true);

  const [dataManager, setDataManager] = useState<DataManagerStrategy | null>(
    null
  );

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  //#endregion

  //#region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region Methods

  /**
   * Sets the loading state of the component.
   *
   * @param {boolean} value - The value to set the loading state to. Defaults to false.
   */
  function setLoading(value: boolean = false) {
    dispatch({
      type: ManageActionType.SET_LOADING,
      payload: value,
    });
  }
  function updateSelectedCRUDTargetToMatch() {
    if (!justLoaded) return;

    if (!paramCollectionName) return;

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: crudTargets.find(
        (t) => t.collectionName === paramCollectionName
      ),
    });

    setJustLoaded(false);
  }

  function updateDataManagerStrategy() {
    switch (paramCollectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        setDataManager(() => new ProductTypeDataManagerStrategy(dispatch));
        break;
      case COLLECTION_NAME.PRODUCTS:
        setDataManager(() => new ProductDataManagerStrategy(dispatch));
        break;
      case COLLECTION_NAME.BATCHES:
        setDataManager(() => new BatchDataManagerStrategy(dispatch));
        break;
      default:
        setDataManager(() => null);
        break;
    }
  }

  function createAddData(): AddData | null {
    let addData: AddData | null = null;

    switch (paramCollectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        const imageFile = rowModalRef.current
          ?.getProductTypeFormRef()
          ?.getImageFile();

        const productTypeData = state.modalData as ModalProductTypeObject;

        if (!productTypeData) return null;

        if (!productTypeData.name) {
          handleSnackbarAlert('error', 'Vui lòng nhập tên sản phẩm');
          return null;
        }

        addData = {
          data: productTypeData,
          imageFile: imageFile ?? undefined,
        } as ProductTypeAddData;

        break;
      case COLLECTION_NAME.PRODUCTS:
        const imageFiles = rowModalRef.current
          ?.getProductFormRef()
          ?.getImageFiles();

        const productTypeName =
          rowModalRef.current?.getProductFormRef()?.getProductTypeName() ??
          'Lỗi';

        addData = {
          data: state.modalData!,
          productTypeName: productTypeName,
          imageFiles: imageFiles?.map((f) => f.file) ?? [],
        } as ProductAddData;
        break;
      case COLLECTION_NAME.BATCHES:
        addData = {
          data: state.modalData!,
        };
        break;
    }

    return addData;
  }

  function createUpdateData(): UpdateData | null {
    let updateData: UpdateData | null = null;

    switch (paramCollectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        updateData = {
          newData: state.modalData,
          originalData: state.originalModalData,
          imageFile: rowModalRef.current
            ?.getProductTypeFormRef()
            ?.getImageFile() as File,
        } as ProductTypeUpdateData;
        break;
      case COLLECTION_NAME.PRODUCTS:
        updateData = {
          newData: state.modalData,
          originalData: state.originalModalData,
          imageFiles:
            rowModalRef.current?.getProductFormRef()?.getImageFiles() ?? [],
        } as ProductUpdateData;
        break;
      case COLLECTION_NAME.BATCHES:
        updateData = {
          newData: state.modalData,
          originalData: state.originalModalData,
        } as BatchUpdateData;
        break;
      default:
        break;
    }

    return updateData;
  }

  //#endregion

  //#region Refs

  const rowModalRef = useRef<FormRef>(null);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    const mainDocs = JSON.parse(paramMainDocs) as BaseObject[];

    if (!mainDocs) return;

    console.log(mainDocs);

    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: mainDocs,
    });
  }, [paramMainDocs]);

  useEffect(() => {
    if (!state.selectedTarget) return;

    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: null,
    });

    const collectionName = state.selectedTarget.collectionName;
    router.push(`${PATH}?collectionName=${collectionName}`);
  }, [state.selectedTarget]);

  useEffect(() => {
    updateSelectedCRUDTargetToMatch();
    updateDataManagerStrategy();
  }, [paramCollectionName]);

  //#endregion

  //#region useMemos

  const addRowText = useMemo(() => {
    switch (state.selectedTarget?.collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        return 'Thêm loại sản phẩm';
      case COLLECTION_NAME.PRODUCTS:
        return 'Thêm sản phẩm';
      case COLLECTION_NAME.BATCHES:
        return 'Thêm lô hàng';
      default:
        return 'Lỗi khi load text';
    }
  }, [state.selectedTarget]);

  const isTableEmpty = useMemo(() => {
    return state.mainDocs?.length === 0;
  }, [state.mainDocs]);

  const namesForSearchBar = useMemo(() => {
    if (!state.mainDocs) return [];

    let namesFactory: SearchBarNamesFactory | null = null;

    switch (paramCollectionName) {
      case 'productTypes':
        namesFactory = new ProductTypeSearchBarNamesFactory();
        break;
      case 'products':
        namesFactory = new ProductSearchBarNamesFactory();
        break;
      case 'batches':
      default:
        break;
    }

    if (!namesFactory) return [];

    const names = namesFactory.generate(state.mainDocs);

    return names;
  }, [state.mainDocs]);

  // #endregion

  //#region Handlers

  function handleCrudTargetChanged(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newTarget: CrudTarget
  ) {
    if (!newTarget) {
      console.log('Null Crud target');
      return;
    }

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: newTarget,
    });
  }

  function handleNewRow() {
    dispatch({
      type: ManageActionType.NEW_ROW,
      payload: paramCollectionName,
    });
  }

  function handleViewRow(rowId: string) {
    const rowData = state.mainDocs?.find((row) => row.id === rowId);

    if (rowData) {
      dispatch({
        type: ManageActionType.VIEW_ROW,
        payload: rowData,
      });
    }
  }

  async function handleAddRow() {
    if (!state.modalData) {
      handleSnackbarAlert('error', 'Lỗi khi thêm');

      return;
    }

    setLoading(true);

    const addData = createAddData();

    if (!addData) {
      setLoading(false);

      handleSnackbarAlert('error', 'Lỗi khi thêm');

      return;
    }

    try {
      const addedData = await dataManager?.addDoc(addData);

      if (!addedData) {
        console.log('Null added data');
        handleSnackbarAlert('error', 'Thêm thất bại');
        return;
      }

      dispatch({
        type: ManageActionType.SET_MODAL_DATA,
        payload: addedData,
      });

      dispatch({
        type: ManageActionType.VIEW_ROW,
        payload: addedData,
      });

      if (!state.mainDocs) {
        console.log('Null main docs');
        return;
      }

      const updatedDocs = [...state.mainDocs];
      updatedDocs.splice(0, 0, addedData);

      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: updatedDocs,
      });

      handleSnackbarAlert('success', 'Thêm thành công');
    } catch (error: any) {
      switch (error.message) {
        case DataManagerErrorCode.NULL_FIELD:
          handleSnackbarAlert('error', 'Vui lòng điền đầy đủ các trường');
          break;
        default:
          console.log(error);
          break;
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateRow() {
    setLoading(true);

    if (!state.modalData || !state.originalModalData) {
      setLoading(false);
      return;
    }

    const changed = isDataChanged(state.modalData, state.originalModalData);

    if (changed) {
      try {
        const updateData = createUpdateData();

        if (!updateData) {
          console.log('Null update data');
          setLoading(false);
          return;
        }

        const data = await dataManager?.updateDoc(updateData);

        if (!data) {
          console.error('Null data');
          setLoading(false);
          return;
        }

        if (!state.mainDocs) {
          console.error('Null main docs');
          setLoading(false);
          return;
        }

        const index = state.mainDocs.findIndex((doc) => doc.id === data.id);

        const updatedMainDocs = [...state.mainDocs];

        updatedMainDocs[index] = {
          ...state.modalData,
          ...data,
        };

        dispatch({
          type: ManageActionType.SET_MAIN_DOCS,
          payload: updatedMainDocs,
        });
      } catch (error: any) {
        console.log(error);
      }
    }

    handleToggleModalEditMode();

    setLoading(false);
  }

  function handleResetForm() {
    dispatch({
      type: ManageActionType.SET_MODAL_DATA,
      payload: generateDefaultRow(paramCollectionName),
    });
  }

  const handleModalClose = () => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  function handleToggleModalEditMode() {
    if (state.crudModalMode === 'update') {
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_MODE,
        payload: 'view',
      });
    } else if (state.crudModalMode === 'view') {
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_MODE,
        payload: 'update',
      });
    } else {
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_MODE,
        payload: 'view',
      });
    }
  }

  function handleCancelUpdateData() {
    dispatch({
      type: ManageActionType.SET_MODAL_DATA,
      payload: state.originalModalData,
    });
    handleToggleModalEditMode();
  }

  function handleOnDataChange(newData: BaseObject) {
    dispatch({
      type: ManageActionType.SET_MODAL_DATA,
      payload: newData,
    });
  }

  function handleDeleteRow(doc: BaseObject) {
    if (!doc) {
      handleSnackbarAlert('error', 'Đã có lỗi khi xóa: Null doc');
      return;
    }

    dispatch({
      type: ManageActionType.SET_DELETE_DOC,
      payload: doc,
    });

    setDialogOpen(() => true);
  }

  function handleDialogCloseWithConfirm(result: DialogResult) {
    setLoading(true);

    try {
      if (result === 'confirm') {
        if (!state.deleteDoc) {
          handleSnackbarAlert('error', 'Đã có lỗi khi xóa: Null doc');
          return;
        }

        dataManager?.deleteDoc(state.deleteDoc);

        if (!state.mainDocs) {
          console.log('Null main docs');
          handleSnackbarAlert('error', 'Đã có lỗi khi xóa: Null main docs');
          return;
        }

        const deletedIndex = state.mainDocs.indexOf(state.deleteDoc);
        const updatedMainDocs = [...state.mainDocs];
        updatedMainDocs.splice(deletedIndex, 1);

        console.log(deletedIndex);

        dispatch({
          type: ManageActionType.SET_MAIN_DOCS,
          payload: updatedMainDocs,
        });

        dispatch({
          type: ManageActionType.SET_CRUD_MODAL_OPEN,
          payload: false,
        });

        handleSnackbarAlert('success', 'Xóa thành công');
      }
    } catch (error: any) {
      console.log(error.message);
      handleSnackbarAlert('error', `Đã có lỗi khi xóa: ${error.message}`);
    } finally {
      dispatch({
        type: ManageActionType.SET_DELETE_DOC,
        payload: '',
      });
      setDialogOpen(() => false);
      setLoading(false);
    }
  }

  async function handleReloadTable() {
    setLoading(true);

    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: null,
    });

    let factory: StorageDocsFactory | null = null;

    switch (paramCollectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        factory = new ProductTypeStorageDocsFetcher();
        break;
      case COLLECTION_NAME.PRODUCTS:
        factory = new ProductStorageDocsFetcher();
        break;
      case COLLECTION_NAME.BATCHES:
        factory = new BatchStorageDocsFetcher();
        break;
      default:
        break;
    }

    if (!factory) {
      handleSnackbarAlert('error', 'Lỗi khi tải lại');
      setLoading(false);
      return;
    }

    try {
      const docs = await factory.createDocs();

      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: docs,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //#endregion

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Quản lý kho
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <ToggleButtonGroup
              value={state.selectedTarget}
              onChange={handleCrudTargetChanged}
              exclusive
            >
              {crudTargets.map((target) => (
                <ToggleButton key={target.collectionName} value={target}>
                  {target.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Manage Buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 1,
                py: 2,
              }}
            >
              <TableActionButton
                startIcon={<RestartAlt />}
                onClick={handleReloadTable}
                sx={{
                  px: 2,
                }}
              >
                Tải lại
              </TableActionButton>

              <TableActionButton
                startIcon={<Add />}
                variant="contained"
                onClick={handleNewRow}
              >
                {addRowText}
              </TableActionButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <CustomDataTable
              mainDocs={state.mainDocs}
              collectionName={paramCollectionName}
              handleViewRow={handleViewRow}
              handleDeleteRow={handleDeleteRow}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </Box>

      {/* Dialogs */}
      <SimpleDialog
        open={dialogOpen}
        onClose={handleDialogCloseWithConfirm}
        title={'Xóa?'}
        content={'Bạn có chắc muốn xóa hàng này?'}
        actions={
          <>
            <DialogButton
              sx={{
                backgroundColor: (theme) => theme.palette.common.gray,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.common.darkGray,
                },
              }}
              onClick={() => handleDialogCloseWithConfirm('close')}
            >
              Đóng
            </DialogButton>
            <DialogButton
              onClick={() => handleDialogCloseWithConfirm('confirm')}
            >
              Xóa
            </DialogButton>
          </>
        }
      />

      {/* Modals */}
      {state.crudModalOpen && (
        <RowModal
          open={state.crudModalOpen}
          mode={state.crudModalMode}
          handleDeleteRow={handleDeleteRow}
          handleModalClose={handleModalClose}
          handleToggleModalEditMode={handleToggleModalEditMode}
          handleCancelUpdateData={handleCancelUpdateData}
          onDataChange={handleOnDataChange}
          data={state.modalData}
          collectionName={paramCollectionName}
          handleAddRow={handleAddRow}
          handleUpdateRow={handleUpdateRow}
          handleResetForm={handleResetForm}
          ref={rowModalRef}
          disabled={state.loading}
          loading={state.loading}
        />
      )}
    </>
  );
}

const errorProps = {
  props: {
    success: false,
  },
};

const defaultPageRedirect = {
  redirect: {
    destination: `${PATH}?collectionName=productTypes`,
    permanent: false,
  },
};

/**
 * Returns server-side props for the page.
 *
 * @param {Object} context - The context object received from Next.js.
 * @returns {Object} The server-side props object.
 */
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  // Extract the collection name from the query parameter of the URL.
  const collectionName: string | undefined = context.query.collectionName as
    | string
    | undefined;

  if (!collectionName) return defaultPageRedirect;

  const isCollectionNameValid: boolean =
    validateCollectionNameParams(collectionName);

  if (!isCollectionNameValid) return defaultPageRedirect;

  // Get the documents from the specified collection.
  // const mainDocs = await getCollection<BaseObject>(collectionName);
  let fetcher: StorageDocsFactory | null = null;

  switch (collectionName) {
    case 'productTypes':
      fetcher = new ProductTypeStorageDocsFetcher();
      break;
    case 'products':
      fetcher = new ProductStorageDocsFetcher();
      break;
    case 'batches':
      fetcher = new BatchStorageDocsFetcher();
      break;
    default:
      break;
  }

  if (!fetcher) return errorProps;

  let mainDocs: BaseObject[] = [];

  try {
    mainDocs = await fetcher.createDocs();
  } catch (error) {
    console.error('Lỗi fetch main docs: ', error);
  }

  const stringifyMainDocs = JSON.stringify(mainDocs);

  // Return the main documents as props.
  return {
    props: {
      success: true,
      mainDocs: stringifyMainDocs,
      collectionName,
    },
  };
};
