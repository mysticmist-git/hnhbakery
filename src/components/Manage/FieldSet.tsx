import { ProductType } from '@/lib/models';
import { CollectionName } from '@/lib/models/utilities';
import { CrudTarget } from '@/pages/manager/lib/manage';
import {
  Avatar,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import * as React from 'react';
import Button from '@mui/material/Button';
import { Close } from '@mui/icons-material';

export function UploadButton() {
  const handleUpload = (event: any) => {
    const file = event.target.files[0];
    // handle the uploaded file here
  };

  return (
    <>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Tải ảnh lên
        </Button>
      </label>
    </>
  );
}

interface FieldSetProps {
  row: any;
  setRow: any;
  isDisabled: boolean;
}

interface SuperFieldSetProps extends FieldSetProps {
  target: CrudTarget;
}

function ProductTypeFieldSet({ row, setRow, isDisabled }: FieldSetProps) {
  return (
    <Box>
      <Box>
        <Avatar
          src={row?.image}
          variant="rounded"
          sx={{ width: 260, height: 260, border: '2px solid #fff' }}
        />
        <Box sx={{ mt: '1rem' }}>
          <UploadButton />
        </Box>
      </Box>
      <Box
        sx={{
          mt: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          gap: '1rem',
        }}
      >
        <TextField
          label="Tên loại sản phẩm"
          variant="outlined"
          value={row?.name ?? ''}
          onChange={(e) => setRow({ ...row, name: e.target.value })}
          disabled={isDisabled}
        />
        <TextField
          label="Mô tả"
          variant="outlined"
          multiline
          value={row?.description || ''}
          onChange={(e) => setRow({ ...row, description: e.target.value })}
          disabled={isDisabled}
        />
        <FormControlLabel
          control={
            <Switch
              checked={row?.isActive || false}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRow({ ...row, isActive: event.target.checked });
              }}
              disabled={isDisabled}
            />
          }
          label="Còn cung cấp"
        />
      </Box>
    </Box>
  );
}
function ProductFieldSet({ row, setRow, isDisabled }: FieldSetProps) {
  return <div>ProductFieldSet</div>;
}
function BatchFieldSet({ row, setRow, isDisabled }: FieldSetProps) {
  return <div>BatchFieldSet</div>;
}

export default function FieldSet({
  target,
  row,
  setRow,
  isDisabled,
}: SuperFieldSetProps) {
  switch (target.collectionName) {
    case CollectionName.ProductTypes:
      return (
        <ProductTypeFieldSet
          row={row}
          setRow={setRow}
          isDisabled={isDisabled}
        />
      );
    case CollectionName.Products:
      return (
        <ProductFieldSet row={row} setRow={setRow} isDisabled={isDisabled} />
      );
    case CollectionName.Batches:
      return (
        <BatchFieldSet row={row} setRow={setRow} isDisabled={isDisabled} />
      );
    default:
      return <div>Đã có lỗi xảy ra!</div>;
  }
}
