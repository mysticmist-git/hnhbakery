import { ProductTypeWithCount } from '@/lib/models/ProductType';
import { Box, Typography } from '@mui/material';
import React from 'react';

export function ProductTypeRenderOption({
  props,
  option,
}: ProductTypeRenderOptionProps) {
  return (
    <Box {...props} component={'li'} key={option.id}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
        }}
      >
        <Typography>{option.name}</Typography>
        <Typography variant="body2">Số sản phẩm: {option.count}</Typography>
      </Box>
    </Box>
  );
}
export type ProductTypeRenderOptionProps = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: ProductTypeWithCount;
};
