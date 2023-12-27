import { getProductTypes } from '@/lib/DAO/productTypeDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import CustomerReference from '@/models/CustomerReference';
import ProductType from '@/models/productType';
import { Box, Checkbox, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { CardItem } from './CardItem';

export function KhaoSatLoaiSanPham({
  customerReferenceData,
  handleChangeData,
}: {
  customerReferenceData: CustomerReference;
  handleChangeData: (key: keyof CustomerReference, value: any) => void;
}) {
  const [productTypeData, setProductTypeData] = React.useState<ProductType[]>(
    []
  );
  useEffect(() => {
    async function fetchData() {
      try {
        let data = await getProductTypes().then((data) =>
          data.filter((item) => item.active)
        );

        const images: string[] = await Promise.all(
          data.map(
            async (item) => await getDownloadUrlFromFirebaseStorage(item.image)
          )
        );

        data = data.map((item, index) => ({
          ...item,
          image: images[index],
        }));

        setProductTypeData(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        flexWrap={'wrap'}
        sx={{
          width: '100%',
        }}
      >
        {productTypeData.map((item, index) => (
          <Box
            component={'div'}
            key={index}
            sx={{
              width: 'calc(100%/3)',
              p: 1,
            }}
          >
            <Checkbox
              checked={customerReferenceData.productTypeIds.includes(item.id)}
              onChange={() => {
                handleChangeData(
                  'productTypeIds',
                  customerReferenceData.productTypeIds.includes(item.id)
                    ? customerReferenceData.productTypeIds.filter(
                        (id) => id !== item.id
                      )
                    : [...customerReferenceData.productTypeIds, item.id]
                );
              }}
              sx={{ width: '100%', borderRadius: '8px' }}
              icon={<CardItem src={item.image} />}
              checkedIcon={<CardItem src={item.image} check={true} />}
            />
          </Box>
        ))}
      </Stack>
    </>
  );
}
