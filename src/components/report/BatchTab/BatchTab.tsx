import { getProductTypeTableRows } from '@/lib/DAO/productTypeDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import useBatches from '@/lib/hooks/useBatches';
import { ProductRevenue, VariantRevenue } from '@/lib/pageSpecific/report';
import { BatchDataManagerStrategy } from '@/lib/strategies/DataManagerStrategy';
import { formatPrice } from '@/lib/utils';
import Batch from '@/models/batch';
import Branch from '@/models/branch';
import { ProductTypeTableRow } from '@/models/productType';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { ChevronLeft, KeyboardArrowDown } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { ChildProcess } from 'child_process';
import { useCallback, useEffect, useState } from 'react';

type BatchTabProps = {
  onClickBack(): void;
};

const cachedProductTypesTableRow = withHashCacheAsync(getProductTypeTableRows);
function useProductTypeTableRows() {
  const [productTypes, setProductTypes] = useState<ProductTypeTableRow[]>([]);
  useEffect(() => {
    async function fetchData() {
      const types = await cachedProductTypesTableRow();
      setProductTypes(types);
    }
    fetchData();
  }, []);

  return productTypes;
}

type GeneralBatchItemData = {
  id: string;
  name: string;
  image?: string;
  data: GeneralBatchData;
};
type GeneralBatchData = {
  totalBatch: number;
  totalBatchPercent: number;
  quantity: number;
  quantityPercent: number;
  soldCake: number;
  soldCakeToQuantityPercent: number;
  soldCakePercent: number;
};

type WithGeneralBatchData<T> = T & GeneralBatchItemData;

type BatchTabData = Pick<
  GeneralBatchData,
  'totalBatch' | 'quantity' | 'soldCake' | 'soldCakePercent'
> & { productTypes: ProductTypeBatchData[] };
type ProductTypeBatchData = WithGeneralBatchData<{
  products: ProductBatchData[];
}>;
type ProductBatchData = WithGeneralBatchData<{
  variants: VariantBatchData[];
}>;
type VariantBatchData = Omit<
  WithGeneralBatchData<{
    id: string;
    material: string;
    size: string;
    batches: Batch[];
  }>,
  'name' | 'image'
>;

function getBatchTabData(
  productTypes: ProductTypeTableRow[],
  batches: Batch[]
): BatchTabData {
  const groupedBatches = getGroupedBatches(batches);

  const batchTabData = getDefaultBatchTabData(productTypes); // We will fill this data later

  for (let i = 0; i < batchTabData.productTypes.length; i++) {
    const type = batchTabData.productTypes[i];
    if (!groupedBatches.has(type.id)) continue;

    for (let j = 0; j < type.products!.length; j++) {
      const product = type.products![j];
      if (!groupedBatches.get(type.id)!.has(product.id)) continue;

      for (let k = 0; k < productTypes[i].products![j].variants!.length; k++) {
        const variant = product.variants![k];
        if (
          !groupedBatches.get(type.id)!.get(product.id)!.has(variant.id) ||
          groupedBatches.get(type.id)!.get(product.id)!.get(variant.id)!
            .length <= 0
        )
          continue;

        variant.batches =
          groupedBatches.get(type.id)!.get(product.id)!.get(variant.id)! || [];

        // Calculate sold cake percent
        variant.data.totalBatch = variant.batches.length;
        [variant.data.soldCake, variant.data.quantity] = variant.batches.reduce(
          (acc, cur) => [acc[0] + cur.sold, acc[1] + cur.quantity],
          [0, 0]
        );
        variant.data.soldCakeToQuantityPercent =
          Math.floor((variant.data.soldCake / variant.data.quantity) * 100) ??
          0;

        // Update product data
        product.data.totalBatch += variant.data.totalBatch;
        product.data.soldCake += variant.data.soldCake;
        product.data.quantity += variant.data.quantity;
      }
      // Calculate children percent data after parent gets needed data
      for (let k = 0; k < productTypes[i].products![j].variants!.length; k++) {
        const variant = product.variants![k];
        if (!groupedBatches.get(type.id)!.get(product.id)!.has(variant.id))
          continue;
        variant.data.totalBatchPercent =
          Math.floor(
            (variant.data.totalBatch / product.data.totalBatch) * 100
          ) ?? 0;
        variant.data.quantityPercent =
          Math.floor((variant.data.quantity / product.data.quantity) * 100) ??
          0;
        variant.data.soldCakePercent =
          Math.floor((variant.data.soldCake / product.data.soldCake) * 100) ??
          0;
      }

      // Update type data
      type.data.totalBatch += product.data.totalBatch;
      type.data.soldCake += product.data.soldCake;
      type.data.quantity += product.data.quantity;
    }
    // Calculate children percent data after parent gets needed data
    for (let j = 0; j < productTypes[i].products!.length; j++) {
      const product = type.products![j];
      if (!groupedBatches.get(type.id)!.has(product.id)) continue;

      product.data.totalBatchPercent =
        Math.floor((product.data.totalBatch / type.data.totalBatch) * 100) ?? 0;
      product.data.quantityPercent =
        Math.floor((product.data.quantity / type.data.quantity) * 100) ?? 0;
      product.data.soldCakePercent =
        Math.floor((product.data.soldCake / type.data.soldCake) * 100) ?? 0;
    }

    // Update batch data
    batchTabData.totalBatch += type.data.totalBatch;
    batchTabData.quantity += type.data.quantity;
    batchTabData.soldCake += type.data.soldCake;
  }
  // Calculate children percent data after parent gets needed data
  for (let i = 0; i < productTypes.length; i++) {
    const type = batchTabData.productTypes[i];
    if (!groupedBatches.has(type.id)) continue;

    type.data.totalBatchPercent =
      Math.floor((type.data.totalBatch / batchTabData.totalBatch) * 100) ?? 0;
    type.data.quantityPercent =
      Math.floor((type.data.quantity / batchTabData.quantity) * 100) ?? 0;
    type.data.soldCakePercent =
      Math.floor((type.data.soldCake / batchTabData.soldCake) * 100) ?? 0;
  }

  batchTabData.soldCakePercent =
    Math.floor((batchTabData.soldCake / batchTabData.quantity) * 100) ?? 0;

  return batchTabData;
}
function getDefaultBatchTabData(
  productTypes: ProductTypeTableRow[]
): BatchTabData {
  const types = productTypes.map(
    (type) =>
      ({
        id: type.id,
        name: type.name,
        image: type.image,
        data: getDefaultGeneralBatchData(),
        products: type.products?.map(
          (product) =>
            ({
              id: product.id,
              name: product.name,
              image: product.images[0],
              data: getDefaultGeneralBatchData(),
              variants: product.variants?.map(
                (variant) =>
                  ({
                    id: variant.id,
                    material: variant.material,
                    size: variant.size,
                    data: getDefaultGeneralBatchData(),
                    batches: [],
                  } as VariantBatchData)
              ),
            } as ProductBatchData)
        ),
      } as ProductTypeBatchData)
  );
  return {
    totalBatch: 0,
    quantity: 0,
    soldCake: 0,
    soldCakePercent: 0,
    productTypes: types,
  } as BatchTabData;
}
function getDefaultGeneralBatchData() {
  const data: GeneralBatchData = {
    totalBatch: 0,
    totalBatchPercent: 0,
    quantity: 0,
    quantityPercent: 0,
    soldCake: 0,
    soldCakeToQuantityPercent: 0,
    soldCakePercent: 0,
  };
  return data;
}
function getGroupedBatches(batches: Batch[]) {
  const groupedBatches: Map<
    string,
    Map<string, Map<string, Batch[]>>
  > = new Map();
  batches.forEach((batch) => {
    if (groupedBatches.has(batch.product_type_id)) {
      const productType = groupedBatches.get(batch.product_type_id);
      if (productType) {
        const product = productType.get(batch.product_id);
        if (product) {
          const variant = product.get(batch.variant_id);
          if (variant) {
            variant.push(batch);
          } else {
            product.set(batch.variant_id, [batch]);
          }
        } else {
          productType.set(
            batch.product_id,
            new Map([[batch.variant_id, [batch]]])
          );
        }
      }
    } else {
      groupedBatches.set(
        batch.product_type_id,
        new Map([[batch.product_id, new Map([[batch.variant_id, [batch]]])]])
      );
    }
  });
  return groupedBatches;
}
export default function BatchTab({ onClickBack }: BatchTabProps) {
  const types = useProductTypeTableRows();
  const batches = useBatches();
  const [data, setData] = useState<BatchTabData>();
  useEffect(() => {
    setData(getBatchTabData(types, batches));
  }, [batches, types]);

  return (
    <>
      <Grid item xs={12} display={'flex'} alignItems={'center'} gap={1}>
        <IconButton
          sx={{
            borderRadius: 2,
            color: 'white',
            backgroundColor: 'secondary.main',
            ':hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          onClick={onClickBack}
        >
          <ChevronLeft />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Typography
          typography="h6"
          sx={{
            cursor: 'default',
            transition: '0.2s ease-in-out',
            ':hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
              translate: '10%',
            },
          }}
        >
          Lô hàng
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, height: 200 }}></Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4 }}>
          <CardHeader
            title="Báo cáo sản phẩm"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <List>
              {types.map((type) => (
                <ListItemButton key={type.id}></ListItemButton>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

type ProductTypeBatchItemProps = {
  name: string;
  image: string;
  totalBatch: number;
  soldCake: number;
  totalBatchPercent: number;
  soldCakeToTotalPercent: number;
  soldCakePercent: number;
};

function ProductTypeBatchItem({
  name,
  image,
  totalBatch,
  totalBatchPercent,
  soldCake,
  soldCakeToTotalPercent,
  soldCakePercent,
}: ProductTypeBatchItemProps) {
  const [img, setImg] = useState('');
  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url));
  }, [image]);

  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(
    (value?: boolean) => {
      value ? setOpen(value) : setOpen(!open);
    },
    [open]
  );

  return (
    <>
      <ListItemButton onClick={() => toggleOpen()}>
        <Box
          component="img"
          src={img}
          width={100}
          height={100}
          borderRadius={4}
          sx={{
            objectFit: 'cover',
            mr: 4,
          }}
        />
        <ListItemText primary={name} />
        <ListItemText
          primary={formatPrice(totalBatch)}
          secondary={`${totalBatchPercent}%`}
        />
        <ListItemText
          primary={formatPrice(soldCake)}
          secondary={`${soldCakeToTotalPercent}%`}
        />
        <ListItemText primary={formatPrice(soldCakePercent)} />
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      {/* {open &&
        Object.entries(products).map((entry, index) => (
          <ProductBatchItem key={index} {...entry[1]} />
        ))} */}
    </>
  );
}

function ProductBatchItem({
  name,
  image,
  revenue,
  percent,
  variants,
}: {
  name: string;
  image: string;
  revenue: number;
  percent: number;
  variants: VariantRevenue;
}) {
  const [img, setImg] = useState('');
  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url));
  }, [image]);

  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(
    (value?: boolean) => {
      value ? setOpen(value) : setOpen(!open);
    },
    [open]
  );

  return (
    <>
      <ListItemButton onClick={() => toggleOpen()}>
        <Box
          component="img"
          src={img}
          width={100}
          height={100}
          borderRadius={4}
          sx={{
            objectFit: 'cover',
            mr: 4,
            ml: 4,
          }}
        />
        <ListItemText primary={name} />
        <ListItemText
          primary={formatPrice(revenue)}
          secondary={`${percent}%`}
        />
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      {open &&
        Object.values(variants).map((value, index) => (
          <ListItem key={index} sx={{ ml: 8 }}>
            <ListItemText primary={value.material} secondary={value.size} />
            <ListItemText
              primary={formatPrice(value.revenue)}
              secondary={`${value.percent}%`}
            />
          </ListItem>
        ))}
    </>
  );
}
