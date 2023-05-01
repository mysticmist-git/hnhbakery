import { CollectionName } from '@/lib/models/utilities';
import { TableRow } from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import React from 'react';
import GeneratedProductTypeTableBody from './GeneratedProductTypeBody';
import GeneratedProductTableBody from './GeneratedProductBody';
import GeneratedBatchTableBody from './GeneratedBatchBody';

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
    mainDocs,
    displayMainDocs,
    setModalMode,
    handleViewRow,
    handleDeleteRow,
  };

  switch (mainCollectionName) {
    case CollectionName.ProductTypes:
      return <GeneratedProductTypeTableBody {...props} />;
    case CollectionName.Products:
      return <GeneratedProductTableBody {...props} />;
    case CollectionName.Batches:
      return <GeneratedBatchTableBody {...props} />;
    default:
      return <TableRow>Error generating body</TableRow>;
  }
};

export default GeneratedTableBody;
