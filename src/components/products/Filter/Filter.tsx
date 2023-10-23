import ProductsContext from '@/lib/contexts/productsContext';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CustomAccordion from '../CustomAccordion';
import { Filter } from '@/pages/products';
import Color from '@/models/color';
import { getColors } from '@/lib/DAO/colorDAO';
import Size from '@/models/size';
import { getSizes } from '@/lib/DAO/sizeDAO';
import { formatPrice } from '@/lib/utils';
import ProductType from '@/models/productType';
import { getProductTypes } from '@/lib/DAO/productTypeDAO';

const prices = [
  {
    id: -1,
    value: {
      min: 0,
      max: Infinity,
    },
  },
  {
    id: 0,
    value: {
      min: 0,
      max: 100000,
    },
  },
  {
    id: 1,
    value: {
      min: 100000,
      max: 200000,
    },
  },
  {
    id: 2,
    value: {
      min: 200000,
      max: 300000,
    },
  },
  {
    id: 3,
    value: {
      min: 300000,
      max: 400000,
    },
  },
  {
    id: 4,
    value: {
      min: 400000,
      max: 500000,
    },
  },
  {
    id: 5,
    value: {
      min: 500000,
      max: Infinity,
    },
  },
];

function FilterComponent({
  filter,
  handleChangeFilter,
}: {
  filter: Filter;
  handleChangeFilter: (
    type: 'price' | 'sizes' | 'colors' | 'productTypes_id',
    value: string | { min: number; max: number }
  ) => void;
}) {
  const theme = useTheme();

  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setColors(await getColors());
        setSizes(await getSizes());
        setProductTypes(await getProductTypes());
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2} justifyContent={'space-between'}>
        <Grid item width={{ md: '100%', sm: '49%', xs: '100%' }}>
          <CustomAccordion label="Loại bánh">
            {productTypes.map((item) => (
              <FormControlLabel
                key={item.id}
                sx={{
                  width: '100%',
                }}
                control={
                  <Checkbox
                    sx={{ color: theme.palette.secondary.main }}
                    color="secondary"
                    checked={filter.productTypes_id.includes(item.id)}
                    onChange={() => {
                      handleChangeFilter('productTypes_id', item.id);
                    }}
                  />
                }
                label={
                  <Typography
                    variant="button"
                    color={theme.palette.common.black}
                    sx={{
                      px: 1,
                      borderRadius: '4px',
                      width: '100%',
                    }}
                    textTransform={'capitalize'}
                  >
                    {item.name}
                  </Typography>
                }
              />
            ))}
          </CustomAccordion>
        </Grid>

        <Grid item width={{ md: '100%', sm: '49%', xs: '100%' }}>
          <CustomAccordion label="Màu sắc">
            {colors.map((item) => (
              <FormControlLabel
                key={item.id}
                sx={{
                  width: '100%',
                }}
                control={
                  <Checkbox
                    sx={{ color: theme.palette.secondary.main }}
                    color="secondary"
                    checked={filter.colors.includes(item.id)}
                    onChange={() => {
                      handleChangeFilter('colors', item.id);
                    }}
                  />
                }
                label={
                  <Typography
                    variant="button"
                    color={theme.palette.common.white}
                    sx={{
                      px: 1,
                      background: item.hex,
                      borderRadius: '4px',
                      width: '100%',
                    }}
                  >
                    {item.name}
                  </Typography>
                }
              />
            ))}
          </CustomAccordion>
        </Grid>

        <Grid item width={{ md: '100%', sm: '49%', xs: '100%' }}>
          <CustomAccordion label="Cỡ bánh">
            {sizes.map((item) => (
              <FormControlLabel
                key={item.id}
                sx={{
                  width: '100%',
                }}
                control={
                  <Checkbox
                    sx={{ color: theme.palette.secondary.main }}
                    color="secondary"
                    checked={filter.sizes.includes(item.id)}
                    onChange={() => {
                      handleChangeFilter('sizes', item.id);
                    }}
                  />
                }
                label={
                  <Typography
                    variant="button"
                    color={theme.palette.common.black}
                    sx={{
                      px: 1,
                      borderRadius: '4px',
                      width: '100%',
                    }}
                    textTransform={'capitalize'}
                  >
                    {item.name}
                  </Typography>
                }
              />
            ))}
          </CustomAccordion>
        </Grid>

        <Grid item width={{ md: '100%', sm: '49%', xs: '100%' }}>
          <CustomAccordion label="Giá bánh">
            <RadioGroup>
              {prices.map((item) => (
                <FormControlLabel
                  key={item.id}
                  value={item.id}
                  onChange={() => {
                    handleChangeFilter('price', item.value);
                  }}
                  checked={
                    filter.price.min === item.value.min &&
                    filter.price.max === item.value.max
                  }
                  control={<Radio color="secondary" />}
                  label={
                    <Typography
                      variant="button"
                      color={theme.palette.common.black}
                      sx={{
                        px: 1,
                        borderRadius: '4px',
                        width: '100%',
                      }}
                    >
                      {getLabelContent(item.value)}
                    </Typography>
                  }
                  sx={{
                    width: '100%',
                  }}
                />
              ))}
            </RadioGroup>
          </CustomAccordion>
        </Grid>
      </Grid>
    </>
  );
}

function getLabelContent(value: { min: number; max: number }) {
  let label = '';
  if (value.min == 0 && value.max == Infinity) {
    label += 'Tất cả';
    return label;
  }
  if (value.min == 0) {
    label += 'Dưới ';
  } else {
    label += `${formatPrice(value.min, 'đ')}`;
  }
  if (value.max != Infinity && value.min != 0) {
    label += ' - ';
  }
  if (value.max == Infinity) {
    label += ' trở lên';
  } else {
    label += `${formatPrice(value.max, 'đ')}`;
  }
  return label;
}

export default FilterComponent;
