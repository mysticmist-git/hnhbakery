import { getSizes } from '@/lib/DAO/sizeDAO';
import CustomerReference from '@/models/CustomerReference';
import Size from '@/models/size';
import { Box, Checkbox, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { CardItem } from './CardItem';

function KhaoSatSize({
  customerReferenceData,
  handleChangeData,
}: {
  customerReferenceData: CustomerReference;
  handleChangeData: (key: keyof CustomerReference, value: any) => void;
}) {
  const [sizeData, setSizeData] = React.useState<Size[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        let data = await getSizes().then((data) =>
          data.sort((a, b) => a.orderAppear - b.orderAppear)
        );
        setSizeData(data);
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
      {sizeData.map((item, index) => (
        <Box
          component={'div'}
          key={index}
          sx={{
            width: 'calc(100%/3)',
            p: 1,
          }}
        >
          <Checkbox
            checked={customerReferenceData.sizes.includes(item.id)}
            onChange={() => {
              handleChangeData(
                'sizes',
                customerReferenceData.sizes.includes(item.id)
                  ? customerReferenceData.sizes.filter((id) => id !== item.id)
                  : [...customerReferenceData.sizes, item.id]
              );
            }}
            sx={{ width: '100%', borderRadius: '8px' }}
            icon={<CardItem src={item.image} />}
            checkedIcon={<CardItem src={item.image} check={true} />}
          />
        </Box>
      ))}
    </Stack>
  );
}

export default KhaoSatSize;
