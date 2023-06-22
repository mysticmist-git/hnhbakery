import { COLLECTION_NAME } from '@/lib/constants';
import { getCollectionWithQuery } from '@/lib/firestore/firestoreLib';
import { ProductVariant } from '@/lib/models/Product';
import { ReferenceObject } from '@/lib/models/Reference';
import formatPrice from '@/lib/utilities/formatCurrency';
import { Button, List, ListItem, ListItemText, styled } from '@mui/material';
import { where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import VariantItem from './VariantItem';

type VariantManagerProps = {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
};

/**
 * Help managing variants of a product.
 * This only work with controlled states.
 * @param props Props
 * @returns
 */
function VariantManager(props: VariantManagerProps) {
  //#region States

  const [sizes, setSizes] = useState<string[]>([]);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    async function fetchSizes() {
      let sizes: string[] = [];

      try {
        const sizesRef: ReferenceObject[] = await getCollectionWithQuery(
          COLLECTION_NAME.REFERENCES,
          where('name', '==', 'sizes')
        );

        if (!sizesRef || !sizesRef.length) throw new Error('Sizes not found');

        sizes = sizesRef[0].values;

        setSizes(() => sizes);
      } catch (error: any) {
        console.log(error);

        setSizes(() => []);
      }
    }

    fetchSizes();
  }, []);

  //#endregion

  //#region handlers

  function handleAdd() {
    props.onChange([...props.variants, { id: '' } as ProductVariant]);
  }

  function handleRemove(variant: ProductVariant) {
    props.onChange(props.variants.filter((p) => p.id !== variant.id));
  }

  function handleUpdate(variant: ProductVariant) {
    // update variant
    props.onChange(
      props.variants.map((p) => {
        if (p.id === variant.id) {
          return variant;
        }
        return p;
      })
    );
  }

  //#endregion

  return (
    <List>
      {props.variants.map((variant) => (
        <VariantItem
          variant={variant}
          key={variant.id}
          references={{
            sizes: sizes,
          }}
          onRemove={handleRemove}
          onUpdate={handleUpdate}
        />
      ))}
      <ListItem>
        <Button variant="contained" onClick={handleAdd}>
          Thêm
        </Button>
      </ListItem>
    </List>
  );
}

export default VariantManager;
