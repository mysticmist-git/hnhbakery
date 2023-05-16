import React, { useContext } from 'react';
import { ManageContextType } from '../../lib/manage';
import { ManageContext } from '../../manage';
import ProductTypeRowModal from './ProductTypeRowModal';
import { CollectionName } from '@/lib/models/utilities';
import ProductRowModal from './ProductRowModal';
import BatchRowModal from './BatchRowModal';

export default function RowModal() {
  const { state } = useContext<ManageContextType>(ManageContext);

  switch (state.selectedTarget?.collectionName) {
    case CollectionName.ProductTypes:
      return <ProductTypeRowModal />;
    case CollectionName.Products:
      return <ProductRowModal />;
    case CollectionName.Batches:
      return <BatchRowModal />;
    default:
      return <div>RowModal</div>;
  }
}
