import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import useBranches from '@/lib/hooks/useBranches';
import {
  ProductBatchData,
  ProductTypeBatchData,
  VariantBatchData,
  getBatchTabData,
} from '@/lib/pageSpecific/report';
import Batch from '@/models/batch';
import Branch from '@/models/branch';
import { ProductTypeTableRow } from '@/models/productType';
import { ChevronLeft, KeyboardArrowDown } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type BatchTabProps = {
  types: ProductTypeTableRow[];
  batches: Batch[];
  onClickBack(): void;
};

export default function BatchTab({
  types,
  batches,
  onClickBack,
}: BatchTabProps) {
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const data = useMemo(() => {
    const filteredBatches = batches.filter((batch) => {
      if (!selectedBranch) {
        return true;
      }
      return batch.branch_id === selectedBranch.id;
    });
    return getBatchTabData(types, filteredBatches);
  }, [batches, selectedBranch, types]);

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
          Lô bánh làm ra
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          value={selectedBranch}
          options={[null, ...branches]}
          getOptionLabel={(option) => option?.name || 'Tất cả'}
          onChange={(_, value) => setSelectedBranch(value)}
          renderInput={(params) => (
            <TextField {...params} label="Chi nhánh" color="secondary" />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, p: 4 }}>
          <Grid container textAlign={'center'}>
            <Grid item xs={4}>
              <Typography typography="h5">Tổng lô bánh</Typography>
              <Typography>{data?.totalBatch}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography typography="h5">Tổng bánh bán được</Typography>
              <Typography>
                {data?.soldCake} / {data?.quantity}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography typography="h5">Tỉ lệ bán</Typography>
              <Typography>{data?.soldCakePercent}</Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4 }}>
          <CardHeader
            title="Báo cáo sản phẩm"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <List>
              {data?.productTypes.map((type) => (
                <>
                  <ProductTypeBatchItem key={type.id} {...type} />
                  <Divider />
                </>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

type ProductTypeBatchItemProps = ProductTypeBatchData;
export function ProductTypeBatchItem({
  name,
  image,
  data,
  products,
}: ProductTypeBatchItemProps) {
  const [img, setImg] = useState('');
  useEffect(() => {
    image
      ? getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url))
      : setImg('');
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
        {data.quantity !== 0 ? (
          <>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Tổng lô bánh</Typography>
              <Typography>
                {data.totalBatch} ({data.totalBatchPercent}%)
              </Typography>
            </Stack>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Bánh bán được</Typography>
              <Typography>
                {data.soldCake}/{data.quantity} ({data.soldCakePercent}%)
              </Typography>
            </Stack>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Tỉ lệ bán hết</Typography>
              <Typography>{data.soldCakeToQuantityPercent}%</Typography>
            </Stack>
          </>
        ) : (
          <Typography>Không có lô bánh nào</Typography>
        )}
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      <Collapse in={open}>
        {products.map((product) => (
          <>
            <ProductBatchItem key={product.id} {...product} />
            <Divider />
          </>
        ))}
      </Collapse>
    </>
  );
}

type ProductBatchItemProps = ProductBatchData;
function ProductBatchItem({
  name,
  image,
  data,
  variants,
}: ProductBatchItemProps) {
  const [img, setImg] = useState('');
  useEffect(() => {
    image
      ? getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url))
      : setImg('');
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
        {data.totalBatch !== 0 ? (
          <>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Tổng lô bánh</Typography>
              <Typography>
                {data.totalBatch} ({data.totalBatchPercent}%)
              </Typography>
            </Stack>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Bánh bán được</Typography>
              <Typography>
                {data.soldCake}/{data.quantity} ({data.soldCakePercent}%)
              </Typography>
            </Stack>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Tỉ lệ bán hết</Typography>
              <Typography>{data.soldCakeToQuantityPercent}%</Typography>
            </Stack>
          </>
        ) : (
          <Typography>Không có lô bánh nào</Typography>
        )}
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      <Collapse in={open}>
        {variants.map((variant) => (
          <>
            <VariantBatchItem key={variant.id} {...variant} />
            <Divider />
          </>
        ))}
      </Collapse>
    </>
  );
}

type VariantBatchItemProps = VariantBatchData;
function VariantBatchItem({
  material,
  size,
  data,
  batches,
}: VariantBatchItemProps) {
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
        <ListItemText primary={material} secondary={size} sx={{ ml: 8 }} />
        {data.quantity !== 0 ? (
          <>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Tổng lô bánh</Typography>
              <Typography>
                {data.totalBatch} ({data.totalBatchPercent}%)
              </Typography>
            </Stack>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Bánh bán được</Typography>
              <Typography>
                {data.soldCake}/{data.quantity} ({data.soldCakePercent}%)
              </Typography>
            </Stack>
            <Stack alignItems="center" px={2}>
              <Typography typography="h5">Tỉ lệ bán hết</Typography>
              <Typography>{data.soldCakeToQuantityPercent}%</Typography>
            </Stack>
          </>
        ) : (
          <Typography>Không có lô bánh nào</Typography>
        )}
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      <Collapse in={open}>
        {batches.map((batch) => (
          <BatchBatchItem key={batch.id} {...batch} />
        ))}
      </Collapse>
    </>
  );
}

type BatchBatchItemProps = VariantBatchData['batches'][0];
function BatchBatchItem(data: BatchBatchItemProps) {
  return (
    <ListItem sx={{ pr: 7 }}>
      <Stack alignItems="center" px={2} ml={12} flex={1} justifyContent="start">
        <Typography typography="h5">Mã lô</Typography>
        <Typography>{data.id}</Typography>
      </Stack>
      <Stack alignItems="center" px={2}>
        <Typography typography="h5">Bánh bán được</Typography>
        <Typography>
          {data.sold}/{data.quantity} ({data.soldCakePercent}%)
        </Typography>
      </Stack>
      <Stack alignItems="center" px={2}>
        <Typography typography="h5">Tỉ lệ bán hết</Typography>
        <Typography>{data.soldCakeToQuantityPercent}%</Typography>
      </Stack>
    </ListItem>
  );
}
