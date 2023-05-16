import { CollectionName } from '@/lib/models/utilities';
import { TableRow } from '@mui/material';
import React, { useContext } from 'react';
import GeneratedProductTypeTableBody from './GeneratedProductTypeBody';
import GeneratedProductTableBody from './GeneratedProductBody';
import GeneratedBatchTableBody from './GeneratedBatchBody';
import { ManageContextType } from '@/pages/manager/lib/manage';
import { ManageContext } from '@/pages/manager/manage';

const GeneratedTableBody = () => {
  const { state } = useContext<ManageContextType>(ManageContext);

  switch (state.selectedTarget?.collectionName) {
    case CollectionName.ProductTypes:
      return <GeneratedProductTypeTableBody />;
    case CollectionName.Products:
      return <GeneratedProductTableBody />;
    case CollectionName.Batches:
      return <GeneratedBatchTableBody />;
    default:
      return <TableRow>Error generating body</TableRow>;
  }
};

export default GeneratedTableBody;
