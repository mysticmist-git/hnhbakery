import { MyMultiValuePickerInput } from '@/components/Inputs';
import RowModal from '@/components/Manage/modals/rowModals/RowModal';
import { CustomDataTable } from '@/components/Manage/tables';
import { TableActionButton } from '@/components/Manage/tables/TableActionButton';
import { db } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import { ManageContext } from '@/lib/contexts/manageContext';
import { getCollection } from '@/lib/firestore/firestoreLib';
import {
  ManageAction,
  ManageActionType,
  ManageState,
  PATH,
  crudTargets,
  generateDefaultRow,
  initManageState,
  manageReducer,
  validateCollectionNameParams,
} from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import { CollectionName, Nameable } from '@/lib/models/utilities';
import { Add } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Card,
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
import { deleteDoc, doc } from 'firebase/firestore';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useReducer, useState } from 'react';

export default function Manage({
  mainDocs: paramMainDocs,
  collectionName: paramCollectionName,
}: {
  mainDocs: string;
  collectionName: string;
}) {
  //#region States

  const [state, dispatch] = useReducer<
    React.Reducer<ManageState, ManageAction>
  >(manageReducer, initManageState);

  const [justLoaded, setJustLoaded] = useState(true);

  //#endregion

  //#region Hooks

  const theme = useTheme();
  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region useEffects

  // useEffect(() => {
  //   if (!state.crudModalOpen) return;

  //   resetDisplayingData();
  // }, [state.selectedTarget]);

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
    if (!justLoaded) return;

    if (!paramCollectionName) return;

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: crudTargets.find(
        (t) => t.collectionName === paramCollectionName
      ),
    });

    setJustLoaded(false);
  }, [paramCollectionName]);

  //#endregion

  //#region Functions

  const resetDisplayingData = () => {
    if (!state.selectedTarget) return;

    const collectionName = state.selectedTarget.collectionName;
    if (collectionName === CollectionName.None) return;

    dispatch({
      type: ManageActionType.SET_DISPLAYING_DATA,
      payload: generateDefaultRow(collectionName),
    });
  };

  //#endregion

  // #region useMemos

  const rowText = useMemo(() => {
    switch (state.selectedTarget?.collectionName) {
      case CollectionName.ProductTypes:
        return 'Thêm loại sản phẩm';
      case CollectionName.Products:
        return 'Thêm sản phẩm';
      case CollectionName.Batches:
        return 'Thêm lô hàng';
      default:
        return 'Lỗi khi load text';
    }
  }, [state.selectedTarget]);

  const isTableEmpty = useMemo(() => {
    return state.mainDocs?.length === 0;
  }, [state.mainDocs]);

  const namesForSearchBar = useMemo(() => {
    return state.mainDocs?.map((d) => {
      return (d as Nameable).name;
    });
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
  const handleCrudTargetChanged = (e: any, newValue: any) => {
    if (!newValue) return;

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: newValue,
    });
  };

  const handleClickOpen = () => {
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: true,
    });
  };

  const handleClose = () => {
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: false,
    });
  };

  const handleNewRow = () => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_MODE,
      payload: 'create',
    });

    resetDisplayingData();

    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: true,
    });
  };

  const handleCloseModal = () => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  const handleViewRow = (doc: BaseObject) => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_MODE,
      payload: 'view',
    });
    dispatch({
      type: ManageActionType.SET_DISPLAYING_DATA,
      payload: doc,
    });
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: true,
    });
  };

  const handleDeleteRowOnFirestore = (id: string) => {
    // Display modal
    dispatch({
      type: ManageActionType.SET_DELETING_ID,
      payload: id,
    });
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: true,
    });
  };

  const handleDeleteDocumentOnFirestore = async () => {
    dispatch({
      type: ManageActionType.SET_LOADING,
      payload: true,
    });

    const id = state.deletingId;

    try {
      if (!id) return;
      if (!state.selectedTarget) return;

      await deleteDoc(doc(db, state.selectedTarget.collectionName, id));
      console.log('Document deleted successfully!');
      handleSnackbarAlert('success', 'Xóa thành công');
    } catch (error) {
      console.log('Error deleting document:', error);
    }

    dispatch({
      type: ManageActionType.SET_LOADING,
      payload: false,
    });

    if (!state.mainDocs) return;

    // Remove row from table
    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: state.mainDocs.filter((doc: BaseObject) => doc.id !== id),
    });
    dispatch({
      type: ManageActionType.SET_DELETING_ID,
      payload: '',
    });
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: false,
    });
  };

  const handleSearch = (e: any, searchText: string) => {
    dispatch({
      type: ManageActionType.SET_SEARCH_TEXT,
      payload: searchText,
    });
  };

  const handleSearchFilter = <T extends BaseObject & Nameable>(
    docs: T[] | null
  ): T[] | null => {
    if (!docs) return null;

    if (
      !state.searchText ||
      state.searchText.length === 0 ||
      state.searchText === ''
    )
      return docs;

    return docs.filter((doc) => doc.name === state.searchText);
  };

  //#endregion

  // #region Logs

  // #endregion

  return (
    <ManageContext.Provider
      value={{
        state,
        dispatch,
        handleDeleteRowOnFirestore,
        handleViewRow,
        resetDisplayingData,
        handleSearchFilter,
      }}
    >
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
          onChange={(value) =>
            dispatch({
              type: ManageActionType.SET_SELECTED_TARGET,
              payload: crudTargets.find((target) => target.label === value),
            })
          }
        />

        <Divider
          sx={{
            marginY: '1rem',
          }}
        />

        {/* Manage Buttons */}
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

        <CustomDataTable />

        {isTableEmpty && (
          <Card
            sx={{
              width: '100%',
              padding: '1rem',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              Không dữ liệu
            </Typography>
          </Card>
        )}

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
              onClick={handleDeleteDocumentOnFirestore}
              autoFocus
              color="secondary"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modals */}
        {state.crudModalOpen && <RowModal />}
      </Container>
    </ManageContext.Provider>
  );
}

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
  const mainDocs = await getCollection<BaseObject>(collectionName);
  const stringifyMainDocs = JSON.stringify(mainDocs);

  console.group(mainDocs);

  // Return the main documents as props.
  return {
    props: {
      mainDocs: stringifyMainDocs,
      collectionName,
    },
  };
};
