import { useSnackbarService } from '@/lib/contexts';
import {} from '@/lib/manage';
import {
  AddRowHandler,
  CommonRowModalProps,
  DeleteRowHandler,
  FormRef,
  ModalFormDataChangeHandler,
  ModalMode,
  UpdateRowHandler,
} from '@/lib/types/manage';
import { BaseModel } from '@/models/storageModels';
import { Backdrop, CircularProgress } from '@mui/material';
import React, { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { Form } from '../../forms/';
import RowModalLayout from '../RowModalLayout';

interface RowModalProps extends CommonRowModalProps {
  handleAddRow: AddRowHandler;
  handleUpdateRow: UpdateRowHandler;
  handleDeleteRow: DeleteRowHandler;
  onDataChange: ModalFormDataChangeHandler;
  data: BaseModel | null;
}

export interface FormProps {
  data: BaseModel | null;
  collectionName: string;
  onDataChange: ModalFormDataChangeHandler;
  readOnly: boolean;
  mode: ModalMode;
  disabled: boolean;
  loading: boolean;
}

export default memo(
  forwardRef(function RowModal(
    {
      open,
      data,
      collectionName,
      mode,
      onDataChange,
      handleAddRow,
      handleUpdateRow,
      handleDeleteRow,
      handleResetForm,
      handleModalClose,
      handleToggleModalEditMode,
      handleCancelUpdateData,
      disabled = false,
      loading = false,
    }: RowModalProps,
    ref: React.ForwardedRef<FormRef>
  ) {
    //#region Hooks

    const handleSnackbarAlert = useSnackbarService();

    //#endregion

    //#region States

    const [readOnly, setReadOnly] = useState<boolean>(true);

    //#endregion

    //#region UseEffects

    useEffect(() => {
      const readOnlyModes: ModalMode[] = ['view', 'none'];

      setReadOnly(() => readOnlyModes.includes(mode));
    }, [mode]);

    //#endregion

    //#region Handlers

    const handleModalDeleteRow = useCallback(() => {
      if (!data || !data.id) {
        console.log('Delete fail by NULL DATA OR NULL ID');
        return;
      }

      handleDeleteRow(data);
    }, [data, handleDeleteRow]);

    //#endregion

    return (
      <RowModalLayout
        open={open}
        mode={mode}
        collectionName={collectionName}
        handleAddRow={handleAddRow}
        handleUpdateRow={handleUpdateRow}
        handleDeleteRow={handleModalDeleteRow}
        handleResetForm={handleResetForm}
        handleModalClose={handleModalClose}
        handleToggleModalEditMode={handleToggleModalEditMode}
        handleCancelUpdateData={handleCancelUpdateData}
        disabled={disabled}
        loading={loading}
      >
        <Form
          data={data}
          collectionName={collectionName}
          mode={mode}
          onDataChange={onDataChange}
          readOnly={readOnly}
          ref={ref}
          disabled={disabled}
          loading={loading}
        />
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </RowModalLayout>
    );
  })
);
