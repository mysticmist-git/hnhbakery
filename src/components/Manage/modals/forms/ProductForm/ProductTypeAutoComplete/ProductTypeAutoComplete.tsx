import { CustomTextFieldWithLabel } from '@/components/Inputs/textFields';
import { Identifiable, Nameable } from '@/lib/models';
import { Autocomplete, AutocompleteRenderOptionState } from '@mui/material';
import React from 'react';
import ProductTypeRenderOption from '../ProductTypeRenderOption';

type ProductTypeAutocompleteProps<T> = {
  readOnly: boolean;
  productTypes: T[];
  selectedProductType: T | null;
  handleProductTypeChange: (value: T) => void;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T,
    state: AutocompleteRenderOptionState
  ) => React.ReactNode;
};

function ProductTypeAutocomplete<T extends Identifiable & Nameable>({
  readOnly,
  productTypes,
  selectedProductType,
  handleProductTypeChange: handleProductTypeChange,
}: ProductTypeAutocompleteProps<T>) {
  return (
    <Autocomplete
      disablePortal
      value={selectedProductType}
      onChange={(e, value) => {
        if (value) handleProductTypeChange(value);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      readOnly={readOnly}
      options={productTypes.sort((a, b) => {
        const nameA = a.name ?? '';
        const nameB = b.name ?? '';

        return -nameB.localeCompare(nameA);
      })}
      getOptionLabel={(type) => type.name ?? 'Không tên'}
      renderInput={(params) => (
        <CustomTextFieldWithLabel {...params} label="Loại sản phẩm" />
      )}
      renderOption={(props, option) => (
        <ProductTypeRenderOption props={props} option={option} />
      )}
    />
  );
}

export default ProductTypeAutocomplete;
