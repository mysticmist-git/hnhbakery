import Branch from '@/models/branch';
import { useEffect, useState } from 'react';
import { getBranches } from '../DAO/branchDAO';

function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    async function getData() {
      setBranches((await getBranches()) ?? []);
    }

    getData();
  }, []);

  return branches;
}

export default useBranches;
