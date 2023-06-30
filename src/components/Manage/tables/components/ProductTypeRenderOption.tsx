import { ProductTypeObject } from '@/lib/models';
import { IsActivable, Nameable } from '@/lib/models/utilities';
import { Check, Close } from '@mui/icons-material';
import {
  AutocompleteRenderOptionState,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

type ProductTypeRenderOptionProps<T> = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: T;
  state?: AutocompleteRenderOptionState;
};

function ProductTypeRenderOption<T extends Nameable & IsActivable>({
  props,
  option,
  state,
}: ProductTypeRenderOptionProps<T>) {
  return (
    <Box {...props} component="li">
      <Stack
        sx={{ width: '100%' }}
        direction="row"
        justifyContent="space-between"
      >
        <Typography>{option.name}</Typography>
        {option.isActive ? (
          <Check sx={{ color: 'green' }} />
        ) : (
          <Close sx={{ color: 'red' }} />
        )}
      </Stack>
    </Box>
  );
}

export default ProductTypeRenderOption;
