import { ProductVariant } from '@/lib/models';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

export default function ProductVariantRenderOption({
  props,
  option,
}: ProductVariantRenderOptionProps) {
  return (
    <Box {...props} component={'li'} key={option.id}>
      <Stack>
        <ProductVariantListItem label={'Vật liệu'} value={option.material} />
        <ProductVariantListItem label={'Kích cỡ'} value={option.size} />
        <ProductVariantListItem label={'Giá tiền'} value={option.price} />
      </Stack>
    </Box>
  );
}
export function ProductVariantListItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Stack direction="row" gap={1} alignItems={'center'}>
      <Typography>{`${label}:`}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
export type ProductVariantRenderOptionProps = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: ProductVariant;
};
