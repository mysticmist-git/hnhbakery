import { ProductTypeTableRow } from '@/models/productType';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { useEffect, useState } from 'react';
import { getProductTypeTableRows } from '../DAO/productTypeDAO';

const cachedProductTypesTableRow = withHashCacheAsync(getProductTypeTableRows);
export default function useProductTypeTableRows() {
  const [productTypes, setProductTypes] = useState<ProductTypeTableRow[]>([]);
  useEffect(() => {
    async function fetchData() {
      const types = await cachedProductTypesTableRow();
      setProductTypes(types);
    }
    fetchData();
  }, []);

  return productTypes;
}
