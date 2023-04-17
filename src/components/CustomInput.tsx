import { ReferenceDocs } from '@/pages/manager/manage';
import { FieldInfo } from '@/pages/manager/manageTargets';
import { Drafts, Inbox } from '@mui/icons-material';
import {
  TextField,
  Autocomplete,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  ListSubheader,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { setSyntheticLeadingComments } from 'typescript';
import { fetchData } from '../lib/fetchData';
import { CollectionObject } from '../lib/models/utilities';
import MultipleValueInput from './MultipleValueInput';

const CustomInput = (
  fieldInfo: FieldInfo,
  value: any,
  setValue: any,
  referenceDocs?: ReferenceDocs,
) => {
  switch (fieldInfo.fieldType) {
    case 'text':
      return (
        <TextField
          key={fieldInfo.column.field}
          label={fieldInfo.column.headerName}
          value={value?.[fieldInfo.column.field] || ''}
          onChange={(event) =>
            setValue({
              ...value!,
              [fieldInfo.column.field]: event.target.value,
            })
          }
          sx={{ marginRight: '8px' }}
        />
      );
    case 'isActive':
      return (
        <Autocomplete
          key={fieldInfo.column.field}
          disablePortal
          options={[true, false]}
          getOptionLabel={(option) =>
            option ? 'Còn cung cấp' : 'Ngưng cung cấp'
          }
          value={value?.[fieldInfo.column.field] || true}
          sx={{ width: 200, display: 'inline-block' }}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue({
                ...value!,
                [fieldInfo.column.field]: newValue.value,
              });
            } else {
              // handle the case when newValue is null
            }
          }}
          renderInput={(params) => <TextField {...params} label="Trạng thái" />}
        />
      );
    case 'reference':
      return (
        <Autocomplete
          key={fieldInfo.column.field}
          disablePortal
          // options={referenceDocs ? referenceDocs.docs : ['Không có lựa chọn']}
          options={referenceDocs ? referenceDocs.docs : []}
          getOptionLabel={(option: CollectionObject) => {
            if (!option) {
              return 'Không có lựa chọn';
            } else if ('productType_name' in option) {
              // option is a ProductTypeObject
              return option.productType_name;
            } else if ('brand_name' in option) {
              // option is a BrandObject
              return option.brand_name;
            } else {
              return 'Lỗi';
            }
          }}
          value={
            referenceDocs && referenceDocs.docs.length > 0
              ? referenceDocs.docs[0]
              : null
          }
          sx={{ width: 200 }}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue({
                ...value!,
                [fieldInfo.column.field]: newValue.id,
              });
            } else {
              // handle the case when newValue is null
              setValue({
                ...value!,
                [fieldInfo.column.field]: null,
              });
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label={fieldInfo.column.headerName} />
          )}
        />
      );
    case 'array':
      return (
        <MultipleValueInput
          header={fieldInfo.column.headerName || 'Không tên'}
          values={value?.[fieldInfo.column.field] || []}
          // values={['hello', 'hello2', 'hello3']}
          onChange={(listItems: string[]) => {
            if (!listItems) return;
            setValue({
              ...value!,
              [fieldInfo.column.field]: listItems,
            });
          }}
        />
      );
    // return <MultipleValueInput docs={} columns={} />;
  }
};

export default CustomInput;
