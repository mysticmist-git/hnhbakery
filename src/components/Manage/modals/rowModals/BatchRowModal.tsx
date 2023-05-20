import React, { memo, useContext, useEffect, useState } from 'react';

import BatchForm from '../forms/BatchForm';
import RowModalLayout from './RowModalLayout';
import { storage, db } from '@/firebase/config';
import { useSnackbarService } from '@/lib/contexts';
import { DocumentData, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import ProductTypeForm from '../forms/ProductTypeForm';
import { BatchObject } from '@/lib/models/Batch';
import { tokenToString } from 'typescript';
import { ManageActionType, ManageContextType } from '@/lib/localLib/manage';
import { checkIfDataChanged } from '@/lib/localLib/manage-modal';
import { ManageContext } from '@/lib/contexts';
import {
  addDocumentToFirestore,
  updateDocumentToFirestore,
} from '@/lib/firestore/firestoreLib';

const BatchRowModal = () => {
  //#region States

  const [originalDisplayingData, setOriginalDisplayingData] =
    useState<DocumentData | null>(null);

  //#endregion

  //#region Hooks

  const { state, dispatch, resetDisplayingData } =
    useContext<ManageContextType>(ManageContext);
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region useEffects

  useEffect(() => {
    // Check if displaying data exist.
    // If no then alert and close the modal
    if (!state.displayingData) {
      alert('No data passed to the modal');
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_OPEN,
        payload: false,
      });
      return;
    }

    setOriginalDisplayingData(() => state.displayingData);
  }, []);

  //#endregion

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

    if (data.soldQuantity < 0) {
      return {
        isValid: false,
        errorMessage: 'Nhập tổng số lượng',
      };
    }

    if (data.totalQuantity < 0) {
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

    if (data.material < 0) {
      return {
        isValid: false,
        errorMessage: 'Vật liệu sai',
      };
    }

    if (data.size < 0) {
      return {
        isValid: false,
        errorMessage: 'Kích cỡ sai',
      };
    }

    if (data.color < 0) {
      return {
        isValid: false,
        errorMessage: 'Màu sắc sai',
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

    if (data.price < 0) {
      return {
        isValid: false,
        errorMessage: 'Giá sai',
      };
    }

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
      state.displayingData as BatchObject,
    );

    if (!isValid) {
      handleSnackbarAlert('error', errorMessage);
      return;
    }

    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) return;

    try {
      const data = {
        ...state.displayingData,
      };

      // Add new document to Firestore
      const docId = await addDocumentToFirestore(data, collectionName);

      // Add new row to table data
      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: [...state.mainDocs, { id: docId, ...data }],
      });
    } catch (error) {
      console.log('Error adding new document: ', error);
      handleSnackbarAlert('error', 'Thêm mới thất bại');
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
      state.displayingData as BatchObject,
    );

    if (!isValid) {
      handleSnackbarAlert('error', errorMessage);
      return;
    }

    // Check if data changed
    const dataChanged = checkIfDataChanged(
      originalDisplayingData,
      state.displayingData,
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

      // Update document to firestore
      updateDocumentToFirestore(displayingData, collectionName);

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
