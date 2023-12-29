import { getColors } from '@/lib/DAO/colorDAO';
import CustomerReference from '@/models/CustomerReference';
import Color from '@/models/color';
import { Box, Checkbox, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { CardItem } from './CardItem';

function KhaoSatColor({
  customerReferenceData,
  handleChangeData,
}: {
  customerReferenceData: CustomerReference;
  handleChangeData: (key: keyof CustomerReference, value: any) => void;
}) {
  const [colorData, setColorData] = React.useState<Color[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        let data = await getColors();
        setColorData(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      flexWrap={'wrap'}
      sx={{
        width: '100%',
      }}
    >
      {colorData.map((item, index) => (
        <Box
          component={'div'}
          key={index}
          sx={{
            width: 'calc(100%/3)',
            p: 1,
          }}
        >
          <Checkbox
            checked={customerReferenceData.colors.includes(item.id)}
            onChange={() => {
              handleChangeData(
                'colors',
                customerReferenceData.colors.includes(item.id)
                  ? customerReferenceData.colors.filter((id) => id !== item.id)
                  : [...customerReferenceData.colors, item.id]
              );
            }}
            sx={{ width: '100%', borderRadius: '8px' }}
            icon={<CardItem aspectRatio="1/0.8" src={item.image} />}
            checkedIcon={
              <CardItem aspectRatio="1/0.8" src={item.image} check={true} />
            }
          />
        </Box>
      ))}
    </Stack>
  );
}

export default KhaoSatColor;
