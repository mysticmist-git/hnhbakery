import { countDocs, getCollection } from '@/lib/firestore/firestoreLib';
import { ModalBatchObject, ModalFormProps } from '@/lib/localLib/manage';
import { ProductTypeObject } from '@/lib/models';
import { Autocomplete, TextField } from '@mui/material';
import { where } from 'firebase/firestore';
import { memo, useEffect, useState } from 'react';

interface BatchFormProps extends ModalFormProps {
  data: ModalBatchObject | null;
}

type SimpleProductType = {
  id: string;
  name: string;
  productCount: number;
};

export default memo(function BatchForm(props: BatchFormProps) {
  //#region States

  const [productTypes, setProductTypes] = useState<SimpleProductType[]>([]);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    async function fetchProductTypes() {
      const productTypes = await getCollection<ProductTypeObject>(
        'productTypes'
      );

      const simpleProductTypes = await Promise.all(
        productTypes.map(async (type) => {
          let count = 0;
          try {
            count = await countDocs(
              'products',
              where('productType_id', '==', type.id)
            );
          } catch (error: any) {
            console.log(error);
          }

          const simpleProductType: SimpleProductType = {
            id: type.id ?? '',
            name: type.name,
            productCount: count,
          };

          return simpleProductType;
        })
      );

      setProductTypes(() => simpleProductTypes);
    }

    fetchProductTypes();
  }, []);

  //#endregion

  return (
    <Autocomplete
      disablePortal
      id="combo-box-productTypes"
      options={productTypes.map((type) => type.id)}
      getOptionLabel={(typeId) =>
        productTypes.find((type) => type.id === typeId)?.name ?? ''
      }
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
});
