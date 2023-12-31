import { ProductTypeTableRow } from '@/models/productType';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { useEffect, useState } from 'react';
import { getProductTypeTableRows } from '../DAO/productTypeDAO';

// TODO: Remove this - This is just a temporary solution
function tempLocalCache<TResult>(fn: () => Promise<TResult>) {
  let cache: TResult;

  return async () => {
    if (!cache) {
      cache = await fn();
    }
    return cache;
  };
}
const cachedProductTypesTableRow = tempLocalCache(getProductTypeTableRows);
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
