import { COLLECTION_NAME } from '@/lib/constants';
import { getCollectionWithQuery } from '@/lib/firestore';
import { ProductVariant, ReferenceObject } from '@/lib/models';
import { Button, List, ListItem, ListItemText, styled } from '@mui/material';
import { where } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import VariantItem from '../VariantItem/VariantItem';

type VariantManagerProps = {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  readOnly?: boolean;
  disabled?: boolean;
};

/**
 * Help mannaging variants of a product.
 * This only work with controlled states.
 * @param props Props
 * @returns
 */
function VariantManager(props: VariantManagerProps) {
  console.log(props.variants);

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

  function handleAdd(variant: ProductVariant) {
    props.onChange([...props.variants, variant]);
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
          readOnly={props.readOnly}
          disabled={props.disabled}
        />
      ))}
      {!props.readOnly && (
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            sx={{ paddingX: 3 }}
            onClick={() =>
              handleAdd({
                id: nanoid(2),
                material: 'Mặc định',
                size: sizes[0],
                price: 0,
                isActive: true,
              } as ProductVariant)
            }
          >
            Thêm
          </Button>
        </ListItem>
      )}
    </List>
  );
}

export default VariantManager;
