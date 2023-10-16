import { getSizes } from '@/lib/DAO/sizeDAO';
import Size from '@/models/size';
import Variant from '@/models/variant';
import { Button, List, ListItem } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import VariantItem from '../VariantItem';

type VariantManagerProps = {
  variants: Variant[];
  onAddVariant: (
    variant: Omit<Variant, 'id'>
  ) => Promise<DocumentReference<Omit<Variant, 'id'>> | undefined>;
  onUpdateVariant: (
    idOrIndex: string | number,
    data: Omit<Variant, 'id'>
  ) => Promise<void>;
  onDeleteVariant: (idOrIndex: string | number) => Promise<void>;
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
      try {
        const sizes = await getSizes();

        setSizes(sizes);
      } catch (error) {}
    }

    fetchSizes();
  }, []);

  //#endregion

  //#region handlers

  async function handleAdd(variant: Omit<Variant, 'id'>) {
    if (variant) {
      await props.onAddVariant(variant);
    }
  }

  async function handleUpdate(
    idOrIndex: string | number,
    variant: Omit<Variant, 'id'>
  ) {
    if (variant) {
      await props.onUpdateVariant(idOrIndex, variant);
    }
  }

  async function handleDelete(idOrIndex: string | number) {
    if (idOrIndex) {
      await props.onDeleteVariant(idOrIndex);
    }
  }

  async function handleAddClick() {
    const newVariant: Omit<Variant, 'id'> = {
      material: 'Mặc định',
      size: sizes.length > 0 ? sizes[0].id : '',
      price: 0,
      active: true,
      product_id: '',
      product_type_id: '',
      batches: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    await handleAdd(newVariant);
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
          onRemove={handleDelete}
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
