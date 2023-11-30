import { TableActionButton } from '@/components/buttons';
import DialogButton from '@/components/buttons/DialogButton';
import { CanNotAccess } from '@/components/cannotAccess/CanNotAccess';
import { SimpleDialog } from '@/components/dialogs';
import { RowModal } from '@/components/manage/modals/rowModals';
import CustomDataTable from '@/components/manage/tables/CustomDataTable';
import { auth } from '@/firebase/config';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getUser, getUserByUid } from '@/lib/DAO/userDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import {
  BatchStorageDocsFetcher,
  StorageDocsFactory,
} from '@/lib/factories/StorageDocsFactory';
import { isDataChanged, manageReducer } from '@/lib/manage';
import { generateDefaultRow, initManageState } from '@/lib/manage/manage';
import { BaseObject } from '@/lib/models';
import {
  BatchDataManagerStrategy,
  DataManagerErrorCode,
  UpdateData,
} from '@/lib/strategies/DataManagerStrategy';
import {
  AddData,
  DataManagerStrategy,
  DialogResult,
  FormRef,
  ManageAction,
  ManageActionType,
  ManageState,
} from '@/lib/types/manage';
import { BaseModel } from '@/models/storageModels';
import User from '@/models/user';
import { Add, RestartAlt } from '@mui/icons-material';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import {
  FunctionComponent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { reduceEachTrailingCommentRange } from 'typescript';

interface BranchStorageProps {}

const BranchStorage: FunctionComponent<BranchStorageProps> = () => {
  //#region States

  const [state, dispatch] = useReducer<
    React.Reducer<ManageState, ManageAction>
  >(manageReducer, initManageState);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const dataManager: DataManagerStrategy = useMemo(() => {
    return new BatchDataManagerStrategy(dispatch);
  }, []);

  const [userData, setUserData] = useState<User | null>(null);
  const [canBeAccessed, setCanBeAccessed] = useState<boolean | undefined>();

  //#endregion
  //#region Hooks

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

  function createAddData(): AddData | null {
    const addData: AddData = {
      data: state.modalData!,
    };

    return addData;
  }

  function createUpdateData(): UpdateData | null {
    if (!state.modalData || !state.originalModalData) {
      return null;
    }

    const updateData: UpdateData = {
      newData: state.modalData,
      originalData: state.originalModalData,
    };

    return updateData;
  }

  //#endregion
  //#region Refs

  const rowModalRef = useRef<FormRef>(null);

  //#endregion
  //#region UseEffects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserData(null);
        return;
      }

      getUserByUid(user.uid)
        .then((user) => setUserData(user ?? null))
        .catch(() => setUserData(null));
    });

    return () => {
      unsubscribe();
    };
  }, [handleSnackbarAlert]);

  useEffect(() => {
    const fetchData = async (userData: User) => {
      const fetcher = new BatchStorageDocsFetcher(userData);

      let mainDocs: BaseModel[] = [];

      try {
        mainDocs = await fetcher.createDocs();
      } catch (error) {
        console.error('Lỗi fetch main docs: ', error);
      }

      if (!mainDocs) return;

      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: mainDocs,
      });
    };

    const checkUserAccess = async (userData: User): Promise<boolean> => {
      try {
        const branch = await getBranchByManager(userData);

        if (!branch) {
          setCanBeAccessed(false);
          return false;
        }
        setCanBeAccessed(true);
        return true;
      } catch {
        setCanBeAccessed(false);
        return true;
      }
    };

    if (!userData) {
      return;
    }

    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: null,
    });

    checkUserAccess(userData)
      .then((canAccess) => {
        if (canAccess) fetchData(userData);
      })
      .catch((canAccess) => {
        if (canAccess) fetchData(userData);
      });
  }, [userData]);

  // TODO: Remove this when DataManager is refactored / fix.
  // useEffect(() => {
  //   updateSelectedCRUDTargetToMatch();
  //   updateDataManagerStrategy();
  // }, [updateDataManagerStrategy, updateSelectedCRUDTargetToMatch]);

  //#endregion
  //#region useMemos

  // #endregion
  //#region Handlers

  function handleNewRow() {
    dispatch({
      type: ManageActionType.NEW_ROW,
      payload: COLLECTION_NAME.BATCHES,
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
        // case DataManagerErrorCode.NO_DOC_FOUND:
        // case DataManagerErrorCode.NULL_ADD_DATA:
        // case DataManagerErrorCode.NULL_DATA:
        default:
          handleSnackbarAlert('error', 'Đã có lỗi xảy ra khi thêm mới!');
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
      payload: generateDefaultRow(COLLECTION_NAME.BATCHES),
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
    if (!userData) return;

    setLoading(true);

    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: null,
    });

    let factory: StorageDocsFactory | null = null;

    factory = new BatchStorageDocsFetcher(userData);

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
      {canBeAccessed == true && (
        <>
          <Box
            component={'div'}
            width={'100%'}
            sx={{ p: 2, pr: 3, overflow: 'hidden' }}
          >
            <Grid
              container
              justifyContent={'center'}
              alignItems={'center'}
              spacing={2}
            >
              <Grid item xs={12}>
                <Typography sx={{ color: 'common.black' }} variant="h4">
                  Quản lý kho chi nhánh
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography>Quản lý lô bánh</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Manage Buttons */}
              <Grid item xs={12}>
                <Box
                  component={'div'}
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
                    Thêm mới
                  </TableActionButton>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <CustomDataTable
                  mainDocs={state.mainDocs}
                  collectionName={COLLECTION_NAME.BATCHES}
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
              collectionName={COLLECTION_NAME.BATCHES}
              handleAddRow={handleAddRow}
              handleUpdateRow={handleUpdateRow}
              handleResetForm={handleResetForm}
              ref={rowModalRef}
              disabled={state.loading}
              loading={state.loading}
            />
          )}
        </>
      )}
      {canBeAccessed == false && <CanNotAccess />}
    </>
  );
};

export default BranchStorage;
