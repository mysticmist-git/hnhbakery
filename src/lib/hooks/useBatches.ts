import Batch from '@/models/batch';
import { useEffect, useState } from 'react';
import { getBatches } from '../DAO/batchDAO';

let cachedBatches: Batch[] | null = null;
export default function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    async function fetch() {
      if (!cachedBatches) {
        cachedBatches = await getBatches();
      }
      setBatches(cachedBatches ?? []);
    }
    fetch();
  }, [batches]);

  return batches;
}
