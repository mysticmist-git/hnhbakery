import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import {
  AddRowHandler,
  CommonRowModalProps,
  DeleteRowHandler,
  FormRef,
  ModalFormDataChangeHandler,
  ModalMode,
  UpdateRowHandler,
} from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import RowModalAssemblyDataStrategy, {
  BatchRowModalAssemblyDataStrategy,
  ProductRowModalAssemblyDataStrategy,
  ProductTypeRowModalAssemblyDataStrategy,
} from '@/lib/strategies/rowModalAssemblyDataStrategy';
import { ref } from 'firebase/storage';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Form from '../forms/Form';
import RowModalLayout from './RowModalLayout';

interface RowModalProps extends CommonRowModalProps {
  handleAddRow: AddRowHandler;
  handleUpdateRow: UpdateRowHandler;
  handleDeleteRow: DeleteRowHandler;
  onDataChange: ModalFormDataChangeHandler;
  data: BaseObject | null;
}

export interface FormProps {
  data: BaseObject | null;
  collectionName: string;
  onDataChange: ModalFormDataChangeHandler;
  readOnly: boolean;
  mode: ModalMode;
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
    }: RowModalProps,
    ref: React.ForwardedRef<FormRef>
  ) {
    //#region Hooks

    const handleSnackbarAlert = useSnackbarService();

    //#endregion

    //#region States
    const [readOnly, setReadOnly] = useState<boolean>(true);
    const [assemblyDataStrategy, setAssemblyDataStrategy] =
      useState<RowModalAssemblyDataStrategy | null>(null);

    //#endregion

    //#region UseEffects
    useEffect(() => {
      switch (collectionName) {
        case COLLECTION_NAME.PRODUCT_TYPES:
          setAssemblyDataStrategy(
            () => new ProductTypeRowModalAssemblyDataStrategy()
          );
          break;
        case COLLECTION_NAME.PRODUCTS:
          setAssemblyDataStrategy(
            () => new ProductRowModalAssemblyDataStrategy()
          );
          break;
        case COLLECTION_NAME.BATCHES:
          setAssemblyDataStrategy(
            () => new BatchRowModalAssemblyDataStrategy()
          );
          break;
        default:
          setAssemblyDataStrategy(() => null);
          break;
      }
    }, [collectionName]);

    useEffect(() => {
      const readOnlyModes: ModalMode[] = ['view', 'none'];

      setReadOnly(() => readOnlyModes.includes(mode));
    }, [mode]);

    //#endregion

    //#region Handlers

    const handleModalDeleteRow = () => {
      if (!data || !data.id) {
        console.log('Delete fail by NULL DATA OR NULL ID');
        return;
      }

      handleDeleteRow(data.id);
    };

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
      >
        <Form
          data={data}
          collectionName={collectionName}
          mode={mode}
          onDataChange={onDataChange}
          readOnly={readOnly}
          ref={ref}
        />
      </RowModalLayout>
    );
  })
);
