import React, { useMemo, useState } from 'react';
import { BatchTabProps, ProductTypeBatchItem } from '../BatchTab/BatchTab';
import useBranches from '@/lib/hooks/useBranches';
import Branch from '@/models/branch';
import { getBatchTabData } from '@/lib/pageSpecific/report';
import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  List,
  TextField,
  Typography,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

function BatchSoldTab({ types, batches, onClickBack }: BatchTabProps) {
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
          Lô có bánh đã bán
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

export default BatchSoldTab;
