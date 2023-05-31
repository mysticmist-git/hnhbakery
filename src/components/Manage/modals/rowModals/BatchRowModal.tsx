import React, { memo, useContext, useMemo } from 'react';

import BatchForm from '../forms/BatchForm';
import RowModalLayout from './RowModalLayout';
import { useSnackbarService } from '@/lib/contexts';
import { Timestamp } from 'firebase/firestore';
import { BatchObject } from '@/lib/models/Batch';
import { ManageActionType, ManageContextType } from '@/lib/localLib/manage';
import { checkIfDataChanged } from '@/lib/localLib/manage-modal';
import { ManageContext } from '@/lib/contexts';
import {
  addDocToFirestore,
  updateDocToFirestore,
} from '@/lib/firestore/firestoreLib';

const BatchRowModal = () => {
  //#region States

  // const [originalDisplayingData, setOriginalDisplayingData] =
  //   useState<DocumentData | null>(null);

  //#endregion

  //#region Hooks

  const { state, dispatch, resetDisplayingData } =
    useContext<ManageContextType>(ManageContext);
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region useEffects

  //#endregion

  // #region useMemos

  const originalDisplayingData = useMemo(() => {
    // Check if displaying data exist.
    // If no then alert and close the modal
    if (!state.displayingData) {
      alert('No data passed to the modal');
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_OPEN,
        payload: false,
      });
      return null;
    }

    return state.displayingData;
  }, [state.displayingData]);

  // #endregion

  //#region Functions

  //#endregion

  //#region Methods

  const resetForm = () => {
    resetDisplayingData();
  };

  function validateData(data: BatchObject): {
    isValid: boolean;
    errorMessage: string;
  } {
    if (!data.product_id) {
      return {
        isValid: false,
        errorMessage: 'Chọn sản phẩm',
      };
    }

    if (data.price <= 0) {
      return {
        isValid: false,
        errorMessage: 'Giá sai',
      };
    }

    if (data.soldQuantity < 0) {
      return {
        isValid: false,
        errorMessage: 'Nhập tổng số lượng',
      };
    }

    if (data.totalQuantity <= 0) {
      return {
        isValid: false,
        errorMessage: 'Nhập tổng số lượng',
      };
    }

    if (data.soldQuantity > data.totalQuantity) {
      return {
        isValid: false,
        errorMessage: 'Lượng đã bán không được lớn hơn tổng lượng',
      };
    }

    if (!data.MFG) {
      return {
        isValid: false,
        errorMessage: 'Nhập ngày sản xuất (MFG)',
      };
    }

    if (!data.EXP) {
      return {
        isValid: false,
        errorMessage: 'Nhập ngày hết hạn (EXP)',
      };
    }

    if (data.MFG > data.EXP) {
      return {
        isValid: false,
        errorMessage: 'Ngày sản xuất phải trước ngày hết hạn',
      };
    }

    if (!data.discountDate) {
      return {
        isValid: false,
        errorMessage: 'Nhập thời điểm giảm giá',
      };
    }

    if (data.discountDate < data.MFG || data.discountDate > data.EXP) {
      return {
        isValid: false,
        errorMessage: 'Thời điểm giảm giá không hợp lệ',
      };
    }

    if (data.discountPercent < 0 || data.discountPercent > 100)
      return {
        isValid: false,
        errorMessage: 'Giá khuyến mãi phải lớn hơn 0 và nhỏ hơn 100',
      };

    return {
      isValid: true,
      errorMessage: 'ok',
    };
  }

  //#endregion

  //#region Hanlders

  const handleAddNewRow = async () => {
    if (state.crudModalMode !== 'create') {
      alert('Wrong mode detected');
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_OPEN,
        payload: false,
      });
      return;
    }

    // Check if displaying data is null
    if (!state.displayingData) {
      const errorMsg = 'Null data error';
      handleSnackbarAlert('error', `Lỗi: ${errorMsg}`);
      return;
    }

    // validate data before adding
    const { isValid, errorMessage } = validateData(
      state.displayingData as BatchObject
    );

    if (!isValid) {
      handleSnackbarAlert('error', errorMessage);
      return;
    }

    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) return;

    try {
      const dataForFirestoreAdding = {
        ...state.displayingData,
        MFG: Timestamp.fromDate(state.displayingData.MFG),
        EXP: Timestamp.fromDate(state.displayingData.EXP),
      };

      // Add new document to Firestore
      const docRef = await addDocToFirestore(
        dataForFirestoreAdding,
        collectionName
      );

      // Add new row to table data
      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: [
          ...state.mainDocs,
          { ...state.displayingData, id: docRef.id },
        ],
      });
    } catch (error) {
      console.log('Error adding new document: ', error);
      handleSnackbarAlert('error', 'Thêm mới thất bại');

      return;
    }

    handleSnackbarAlert('success', 'Thêm mới thành công');

    // Close modal
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  const handleUpdateRow = async () => {
    //#region Local functions

    function switchBackToViewMode() {
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_MODE,
        payload: 'view',
      });
    }

    function handleUpdateSuccess() {
      switchBackToViewMode();
      handleSnackbarAlert('success', 'Cập nhật thành công');
    }

    function handleUpdateFail() {
      switchBackToViewMode();
      handleSnackbarAlert('success', 'Cập nhật thất bại');
    }

    function handleNoUpdateMade() {
      switchBackToViewMode();
      handleSnackbarAlert('info', 'Đã không có cập nhật nào xảy ra!');
    }

    //#endregion

    if (state.crudModalMode !== 'update') {
      alert('Wrong mode detected');
      handleUpdateFail();
      return;
    }

    // Check if displaying data is null
    if (!state.displayingData) {
      const errorMsg = 'Null data error';
      handleSnackbarAlert('error', `Lỗi: ${errorMsg}`);
      return;
    }

    // validate data before adding
    const { isValid, errorMessage } = validateData(
      state.displayingData as BatchObject
    );

    if (!isValid) {
      handleSnackbarAlert('error', errorMessage);
      return;
    }

    // Check if data changed
    const dataChanged = checkIfDataChanged(
      originalDisplayingData,
      state.displayingData
    );

    try {
      // Proceed to update things
      if (!dataChanged) {
        handleNoUpdateMade();
      }

      const collectionName = state.selectedTarget?.collectionName;
      const displayingData = state.displayingData;

      if (!collectionName || !displayingData) {
        handleUpdateFail();
        return;
      }

      const dataForFirestoreAdding = {
        ...displayingData,
        MFG: Timestamp.fromDate(new Date(displayingData.MFG)),
        EXP: Timestamp.fromDate(new Date(displayingData.EXP)),
        discountDate: Timestamp.fromDate(new Date(displayingData.discountDate)),
      };

      // Update document to firestore
      await updateDocToFirestore(dataForFirestoreAdding, collectionName);

      // Update state
      dispatch({
        type: ManageActionType.UPDATE_SPECIFIC_DOC,
        payload: { id: displayingData.id, data: displayingData },
      });

      // Close modal
      handleUpdateSuccess();
    } catch (error) {
      console.log('Update row failed, error: ', error);
      handleSnackbarAlert('error', `Cập nhật thất bại, error: ${error}`);
    }
  };

  //#endregion

  return (
    <RowModalLayout
      handleAddNewRow={handleAddNewRow}
      handleUpdateRow={handleUpdateRow}
      resetForm={resetForm}
    >
      <BatchForm readOnly={state.crudModalMode === 'view'} />
    </RowModalLayout>
  );
};

export default memo(BatchRowModal);
