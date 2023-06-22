import { ProductVariant } from '@/lib/models/Product';
import formatPrice from '@/lib/utilities/formatCurrency';
import { Button, List, ListItem, ListItemText, styled } from '@mui/material';
import React, { useState } from 'react';
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
          onRemove={handleRemove}
          onUpdate={handleUpdate}
        />
      ))}
      <ListItem>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </ListItem>
    </List>
  );
}

export default VariantManager;
