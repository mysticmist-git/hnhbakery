import Province from '@/models/province';
import { useEffect, useState } from 'react';
import { getProvinces } from '../DAO/provinceDAO';

function useProvinces() {
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        setProvinces(await getProvinces());
      } catch (error) {
        console.log('Fail to fetch provinces', error);
        setProvinces([]);
      }
    }

    getData();
  }, []);

  return provinces;
}

export default useProvinces;
