import { COLLECTION_NAME } from '@/lib/constants';
import {
  StorageBatchObject,
  StorageProductObject,
  StorageProductTypeObject,
} from '@/lib/firestore/firestoreLib';
import { DeleteRowHandler, ViewRowHandler } from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import { TableRow } from '@mui/material';
import React, { memo } from 'react';
import GeneratedBatchTableBody from './GeneratedBatchBody';
import GeneratedProductTableBody from './GeneratedProductBody';
import GeneratedProductTypeTableBody from './GeneratedProductTypeBody';

interface GeneratedTableBodyProps {
  mainDocs: BaseObject[] | null;
  collectionName: string;
  handleViewRow: ViewRowHandler;
  handleDeleteRow: DeleteRowHandler;
}

interface Handlers {
  handleViewRow: ViewRowHandler;
  handleDeleteRow: DeleteRowHandler;
}

export default memo(function GeneratedTableBody({
  mainDocs,
  collectionName,
  handleViewRow,
  handleDeleteRow,
}: GeneratedTableBodyProps) {
  const handlers: Handlers = {
    handleViewRow,
    handleDeleteRow,
  };

  switch (collectionName) {
    case COLLECTION_NAME.PRODUCT_TYPES:
      return (
        <GeneratedProductTypeTableBody
          mainDocs={mainDocs as StorageProductTypeObject[]}
          {...handlers}
        />
      );
    case COLLECTION_NAME.PRODUCTS:
      return (
        <GeneratedProductTableBody
          mainDocs={mainDocs as StorageProductObject[]}
          {...handlers}
        />
      );
    case COLLECTION_NAME.BATCHES:
      return (
        <GeneratedBatchTableBody
          mainDocs={mainDocs as StorageBatchObject[]}
          {...handlers}
        />
      );
    default:
      return <TableRow>Error generating body</TableRow>;
  }
});
