import { CollectionName } from '@/lib/models/utilities';
import { TableRow } from '@mui/material';
import React, { memo, useContext, useMemo } from 'react';
import GeneratedProductTypeTableBody from './GeneratedProductTypeBody';
import GeneratedProductTableBody from './GeneratedProductBody';
import GeneratedBatchTableBody from './GeneratedBatchBody';
import { ManageContext } from '@/pages/manager/manage';
import { ManageContextType } from '@/lib/localLib/manage';

const GeneratedTableBody = () => {
  const { state } = useContext<ManageContextType>(ManageContext);

  const TableBody = useMemo(() => {
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
  }, [state.selectedTarget?.collectionName]);

  return TableBody;
};

export default memo(GeneratedTableBody);
