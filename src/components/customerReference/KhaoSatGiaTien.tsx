import { formatPrice } from '@/lib/utils';
import CustomerReference from '@/models/CustomerReference';
import { Box, Slider } from '@mui/material';
import React from 'react';

function valuetext(value: number) {
  return formatPrice(value, '', true);
}

const marks = [
  {
    value: 0,
    label: valuetext(0),
  },
  {
    value: 100000,
    label: valuetext(100000),
  },
  {
    value: 500000,
    label: valuetext(500000),
  },
  {
    value: 1000000,
    label: valuetext(1000000),
  },
];

function KhaoSatGiaTien({
  customerReferenceData,
  handleChangeData,
}: {
  customerReferenceData: CustomerReference;
  handleChangeData: (key: keyof CustomerReference, value: any) => void;
}) {
  const [value, setValue] = React.useState<number[]>([
    customerReferenceData.prices.min,
    customerReferenceData.prices.max,
  ]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    if (typeof newValue === 'number') {
      handleChangeData('prices', { min: newValue, max: newValue });
    } else {
      const min: number = newValue[0] > newValue[1] ? newValue[1] : newValue[0];
      const max: number = newValue[0] > newValue[1] ? newValue[0] : newValue[1];
      handleChangeData('prices', { min: min, max: max });
    }
  };
  return (
    <Box component="div" sx={{ width: '100%', p: 3, pt: 4 }}>
      <Slider
        color="secondary"
        valueLabelDisplay="on"
        value={value}
        max={1000000}
        min={0}
        step={10000}
        onChange={handleChange}
        valueLabelFormat={valuetext}
        marks={marks}
      />
    </Box>
  );
}

export default KhaoSatGiaTien;
