import React, { useContext } from 'react';

import { ManageContextType } from '../../lib/manage';
import { ManageContext } from '../../manage';
import BatchForm from './forms/BatchForm';
import RowModalLayout from './RowModalLayout';

export default function BatchRowModal() {
  const { state, dispatch } = useContext<ManageContextType>(ManageContext);

  async function handleAddNewRow() {}
  async function handleUpdateRow() {}

  return (
    <RowModalLayout
      handleAddNewRow={handleAddNewRow}
      handleUpdateRow={handleUpdateRow}
    >
      <BatchForm />;
    </RowModalLayout>
  );
}
