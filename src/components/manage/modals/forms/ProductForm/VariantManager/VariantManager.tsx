import { getSizes } from '@/lib/DAO/sizeDAO';
import { updateVariant } from '@/lib/DAO/variantDAO';
import Size from '@/models/size';
import Variant from '@/models/variant';
import { Button, List, ListItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import VariantItem from '../VariantItem';

type VariantManagerProps = {
  variants: Omit<Variant, 'id'>[];
  onVariantsChange: (variants: Omit<Variant, 'id'>[]) => void;
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
  //#region States

  const [sizes, setSizes] = useState<Size[]>([]);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    async function fetchSizes() {
      // TODO: Remove this later
      // let sizes: string[] = [];

      // try {
      //   const sizesRef: ReferenceObject[] = await getCollectionWithQuery(
      //     COLLECTION_NAME.REFERENCES,
      //     where('name', '==', 'sizes')
      //   );

      //   if (!sizesRef || !sizesRef.length) throw new Error('Sizes not found');

      //   sizes = sizesRef[0].values;

      //   setSizes(() => sizes);
      // } catch (error: any) {
      //   console.log(error);

      //   setSizes(() => []);
      // }

      try {
        const sizes = await getSizes();

        setSizes(sizes);
      } catch (error) {}
    }

    fetchSizes();
  }, []);

  //#endregion

  //#region handlers

  function handleAdd(variant: Omit<Variant, 'id'>) {
    if (variant) {
      props.onVariantsChange(props.variants.concat(variant));
    }
  }

  function handleRemove(index: number) {
    props.onVariantsChange(props.variants.filter((_, i) => i !== index));
  }

  function handleUpdate(index: number, variant: Omit<Variant, 'id'>) {
    // update variant

    props.onVariantsChange(
      props.variants.map((v, i) => {
        if (i === index) {
          const withIdVariant: Variant = variant as Variant;

          console.log(withIdVariant);

          if (withIdVariant.id) {
            updateVariant(
              withIdVariant.product_type_id,
              withIdVariant.product_id,
              withIdVariant.id,
              withIdVariant
            );
          }

          return variant;
        } else {
          return v;
        }
      })
    );
  }

  function handleAddClick() {
    const newVariant: Omit<Variant, 'id'> = {
      material: 'Mặc định',
      size: sizes.length > 0 ? sizes[0].id : '',
      price: 0,
      active: true,
      product_id: '',
      product_type_id: '',
      created_at: new Date(),
      updated_at: new Date(),
    };

    handleAdd(newVariant);
  }

  //#endregion

  return (
    <List>
      {props.variants.map((variant, index) => (
        <VariantItem
          index={index}
          variant={variant}
          key={index}
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
            onClick={handleAddClick}
          >
            Thêm
          </Button>
        </ListItem>
      )}
    </List>
  );
}

export default VariantManager;
