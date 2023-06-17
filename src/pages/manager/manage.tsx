import { MyMultiValuePickerInput } from '@/components/Inputs';
import { RowModal } from '@/components/Manage/modals/rowModals';
import { CustomDataTable } from '@/components/Manage/tables';
import { TableActionButton } from '@/components/Manage/tables/TableActionButton';
import {
  ProductSearchBarNamesFactory,
  ProductTypeSearchBarNamesFactory,
  SearchBarNamesFactory,
} from '@/components/pageSpecifics/storage/SearchBarNamesFactory';
import {
  BatchStorageDocsFetcher,
  ProductStorageDocsFetcher,
  ProductTypeStorageDocsFetcher,
  StorageDocsFetcher,
} from '@/components/pageSpecifics/storage/StorageDocsFactory';
import { storage } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import {
  deleteImageFromFirebaseStorage,
  getDownloadUrlFromFirebaseStorage,
  updateDocToFirestore,
  uploadImageToFirebaseStorage,
} from '@/lib/firestore/firestoreLib';
import { isDataChanged } from '@/lib/localLib';
import {
  FormRef,
  ManageAction,
  ManageActionType,
  ManageState,
  ModalProductTypeObject,
  PATH,
  ProductTypeFormRef,
  crudTargets,
  initManageState,
  manageReducer,
  validateCollectionNameParams,
} from '@/lib/localLib/manage';
import { ProductTypeObject } from '@/lib/models';
import BaseObject from '@/lib/models/BaseObject';
import { createProductTypeObject } from '@/lib/models/ProductType';
import {
  DataManagerStrategy,
  ProductTypeDataManagerStrategy,
  ProductTypeUpdateData,
  UpdateData,
} from '@/lib/strategies/DataManagerStrategy';
import { Add } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { deleteObject, ref } from 'firebase/storage';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';

export default function Manage({
  success,
  mainDocs: paramMainDocs,
  collectionName: paramCollectionName,
}: {
  success: boolean;
  mainDocs: string;
  collectionName: string;
}) {
  if (!success) return <Typography variant="h4">Lỗi khi load data</Typography>;

  //#region States

  const [state, dispatch] = useReducer<
    React.Reducer<ManageState, ManageAction>
  >(manageReducer, initManageState);

  const [justLoaded, setJustLoaded] = useState(true);

  const [dataManager, setDataManager] = useState<DataManagerStrategy | null>(
    null
  );

  //#endregion

  //#region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region Methods

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
      case COLLECTION_NAME.BATCHES:
      default:
        setDataManager(() => null);
    }
  }

  //#endregion

  //#region Refs

  const rowModalRef = useRef<FormRef>(null);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    const mainDocs = JSON.parse(paramMainDocs) as BaseObject[];

    if (!mainDocs) return;

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

  const rowText = useMemo(() => {
    switch (state.selectedTarget?.collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        return 'Thêm loại sản phẩm';
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

  /**
   * Updates the targets state when the value of the CRUD target selection has changed.
   *
   * @param {any} e - The event object passed from the target selection component.
   * @param {any} newValue - The new value selected in the target selection component.
   * @return {void} - This function does not return anything.
   */
  function handleCrudTargetChanged(newValue: string) {
    const nextCrudTarget = crudTargets.find(
      (target) => target.label === newValue
    );

    if (!nextCrudTarget) {
      console.log('Null Crud target');
      return;
    }

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: nextCrudTarget,
    });
  }

  // TODO: Implement
  function handleSearch() {
    alert('Not implemented yet');
  }

  // TODO: Implement
  function handleNewRow() {
    alert('Not implemented yet');
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

  function handleAddRow() {}

  async function handleUpdateRow() {
    if (!state.modalData || !state.originalModalData) return;

    const changed = isDataChanged(state.modalData, state.originalModalData);

    if (changed) {
      const updateData: ProductTypeUpdateData = {
        newData: state.modalData,
        originalData: state.originalModalData,
        imageFile: rowModalRef.current
          ?.getProductTypeFormRef()
          ?.getImageFile() as File,
      };

      try {
        const data = await dataManager?.updateDoc(updateData as UpdateData);

        if (!data) {
          console.error('Null data');
          return;
        }

        if (!state.mainDocs) {
          console.error('Null main docs');
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
  }

  function handleResetForm() {}

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

  function handleClose() {
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: false,
    });
  }

  //#endregion

  return (
    <Container
      sx={{
        my: 2,
      }}
    >
      {/* Title */}
      <Typography sx={{ color: theme.palette.common.black }} variant="h4">
        Quản lý kho
      </Typography>
      <Divider
        sx={{
          mt: 2,
        }}
      />

      <MyMultiValuePickerInput
        label="Kho"
        options={crudTargets.map((target) => target.label)}
        value={state.selectedTarget?.label}
        onChange={handleCrudTargetChanged}
      />

      <Divider
        sx={{
          marginY: '1rem',
        }}
      />

      {/* Manage Buttons */}
      {
        <Box
          sx={{
            display: 'flex',
            justifyContent:
              state.selectedTarget?.collectionName !== 'batches'
                ? 'space-between'
                : 'end',
            alignItems: 'center',
            my: '1rem',
          }}
        >
          {state.selectedTarget?.collectionName !== 'batches' && (
            <Autocomplete
              freeSolo
              sx={{
                width: 400,
              }}
              id="search-bar"
              disableClearable
              options={namesForSearchBar ?? []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tìm kiếm"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
              onInputChange={handleSearch}
            />
          )}

          <FormControlLabel
            labelPlacement="start"
            control={
              <Switch
                color="secondary"
                checked={state.isDisplayActiveOnly}
                onChange={(e) => {
                  dispatch({
                    type: ManageActionType.SET_DISPLAY_ACTIVE_ONLY,
                    payload: e.target.checked,
                  });
                }}
              />
            }
            label={
              <Typography variant="body2">Chỉ hiện còn cung cấp</Typography>
            }
          />

          <Divider
            orientation="vertical"
            sx={{
              mx: 1,
            }}
          />

          <TableActionButton
            startIcon={<Add />}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.common.darkGray,
            }}
            onClick={handleNewRow}
          >
            <Typography variant="body2">{rowText}</Typography>
          </TableActionButton>
        </Box>
      }

      <CustomDataTable
        mainDocs={state.mainDocs}
        collectionName={paramCollectionName}
        handleViewRow={handleViewRow}
      />

      <Divider
        sx={{
          mt: 4,
        }}
      />
      {/* Dialogs */}
      <Dialog
        open={state.dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        color="secondary"
      >
        <DialogTitle id="alert-dialog-title">{'Xóa đối tượng'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn xóa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Thoát
          </Button>
          <Button
            // onClick={handleDeleteDocumentOnFirestore}
            autoFocus
            color="secondary"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modals */}
      {state.crudModalOpen && (
        <RowModal
          open={state.crudModalOpen}
          mode={state.crudModalMode}
          handleDeleteRow={() => {}}
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
        />
      )}
    </Container>
  );
}

const defaultPageRedirect = {
  redirect: {
    destination: `${PATH}?collectionName=productTypes`,
    permanent: false,
  },
};

const errorProps = {
  props: {
    success: false,
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
  let fetcher: StorageDocsFetcher | null = null;

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
    mainDocs = await fetcher.fetch();
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
