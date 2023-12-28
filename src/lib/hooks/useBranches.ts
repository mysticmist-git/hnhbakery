import Branch from '@/models/branch';
import { useEffect, useState } from 'react';
import { getBranches } from '../DAO/branchDAO';

let branches: Branch[] | null = null;
function useBranches() {
  const [localBranches, setLocalBranches] = useState<Branch[]>([]);
  useEffect(() => {
    async function getData() {
      if (!branches) {
        branches = await getBranches();
      }
      setLocalBranches(branches);
    }

    getData();
  }, []);

  return localBranches;
}

export default useBranches;
