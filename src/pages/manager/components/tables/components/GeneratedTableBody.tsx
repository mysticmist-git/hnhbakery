import { CollectionName } from '@/lib/models/utilities';
import { TableRow } from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import React from 'react';
import GeneratedProductTypeTableBody from './GeneratedProductTypeBody';
import GeneratedProductTableBody from './GeneratedProductBody';
import GeneratedBatchTableBody from './GeneratedBatchBody';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import { BatchObject } from '@/lib/models/Batch';

type Props = {
  mainDocs: DocumentData[];
  mainCollectionName: CollectionName;
  displayMainDocs: DocumentData[];
  setModalMode: any;
  handleViewRow: any;
  handleDeleteRow: any;
};

const GeneratedTableBody = ({
  mainDocs,
  mainCollectionName,
  displayMainDocs,
  setModalMode,
  handleViewRow,
  handleDeleteRow,
}: Props) => {
  const props = {
    setModalMode,
    handleViewRow,
    handleDeleteRow,
  };

  switch (mainCollectionName) {
    case CollectionName.ProductTypes:
      return (
        <GeneratedProductTypeTableBody
          {...props}
          mainDocs={mainDocs as ProductTypeObject[]}
        />
      );
    case CollectionName.Products:
      return (
        <GeneratedProductTableBody
          {...props}
          mainDocs={mainDocs as ProductObject[]}
          displayMainDocs={displayMainDocs as ProductObject[]}
        />
      );
    case CollectionName.Batches:
      return (
        <GeneratedBatchTableBody
          {...props}
          mainDocs={mainDocs as BatchObject[]}
        />
      );
    default:
      return <TableRow>Error generating body</TableRow>;
  }
};

export default GeneratedTableBody;
